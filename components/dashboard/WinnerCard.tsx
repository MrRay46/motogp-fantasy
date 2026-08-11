"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import StatCard from "./StatCard";

type GanadorGP = {
  nombreGP: string;
  usuario: string;
  puntos: number;
  avatar: string;
};

export default function WinnerCard() {
  const [ganador, setGanador] =
    useState<GanadorGP | null>(null);

  useEffect(() => {
    cargarGanador();
  }, []);

  async function cargarGanador() {
    // --------------------------------------
    // USUARIO ACTUAL
    // --------------------------------------

    const sesion = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    if (!sesion.id) return;

    // --------------------------------------
    // LIGA ACTUAL DEL USUARIO
    // --------------------------------------

    const { data: usuario, error: usuarioError } =
      await supabase
        .from("usuarios")
        .select("liga_actual_id")
        .eq("id", sesion.id)
        .single();

    if (usuarioError || !usuario) {
      console.error(
        "Error obteniendo usuario:",
        usuarioError
      );

      return;
    }

    if (!usuario.liga_actual_id) return;

    // --------------------------------------
    // ÚLTIMO GP PROCESADO
    // --------------------------------------

    const { data: gp, error: gpError } =
      await supabase
        .from("grandes_premios")
        .select(`
          nombre,
          fantasy_procesado,
          ganador_fantasy_equipo_id
        `)
        .eq("fantasy_procesado", true)
        .order("orden", {
          ascending: false,
        })
        .limit(1)
        .single();

    if (gpError || !gp) {
      console.error(
        "Error obteniendo último GP procesado:",
        gpError
      );

      return;
    }

    // --------------------------------------
    // EQUIPO GANADOR DE LA LIGA ACTUAL
    // --------------------------------------

    const { data: equipo, error: equipoError } =
      await supabase
        .from("equipos")
        .select(`
          usuario_id,
          usuario,
          puntos_gp_actual
        `)
        .eq(
          "id",
          gp.ganador_fantasy_equipo_id
        )
        .eq(
          "liga_id",
          usuario.liga_actual_id
        )
        .single();

    if (equipoError || !equipo) {
      console.error(
        "Error obteniendo equipo ganador:",
        equipoError
      );

      return;
    }

    // --------------------------------------
    // AVATAR DEL USUARIO
    // --------------------------------------

    const { data: usuarioGanador, error: avatarError } =
      await supabase
        .from("usuarios")
        .select("avatar")
        .eq("id", equipo.usuario_id)
        .single();

    if (avatarError) {
      console.error(
        "Error obteniendo avatar:",
        avatarError
      );
    }

    // --------------------------------------
    // GUARDAR GANADOR
    // --------------------------------------

    setGanador({
      nombreGP: gp.nombre,
      usuario: equipo.usuario,
      puntos: equipo.puntos_gp_actual ?? 0,
      avatar:
        usuarioGanador?.avatar ||
        "avatar1.png",
    });
  }

  // --------------------------------------
  // SIN DATOS
  // --------------------------------------

  if (!ganador) return null;

  // --------------------------------------
  // RENDER
  // --------------------------------------

  return (
    <StatCard color="gold">
      <div className="flex flex-col items-center text-center">

        <h2 className="text-lg font-semibold text-yellow-300">
          🏆 Ganador del GP {ganador.nombreGP}
        </h2>

        <h3 className="mt-8 text-4xl font-black">
          🥇 {ganador.usuario}
        </h3>

        <p className="mt-2 text-2xl text-zinc-300">
          {ganador.puntos} pts
        </p>

        <img
          src={`/avatars/${ganador.avatar}`}
          alt={ganador.usuario}
          className="
            mt-8
            h-24
            w-24
            rounded-full
            border-4
            border-yellow-400
            object-cover
            shadow-lg
          "
        />

      </div>
    </StatCard>
  );
}
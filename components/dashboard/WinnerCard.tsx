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
    const sesion = JSON.parse(
      localStorage.getItem("usuario") ||
        "{}"
    );

    if (!sesion.id) return;

    //--------------------------------------
    // Liga actual
    //--------------------------------------

    const { data: usuario } =
      await supabase
        .from("usuarios")
        .select("liga_actual_id")
        .eq("id", sesion.id)
        .single();

    if (!usuario) return;

    //--------------------------------------
    // Último GP procesado
    //--------------------------------------

    const { data: gp } =
      await supabase
        .from("grandes_premios")
        .select(`
          nombre,
          procesado
        `)
        .eq("procesado", true)
        .order("orden", {
          ascending: false,
        })
        .limit(1)
        .single();

    if (!gp) return;

    //--------------------------------------
    // Ganador Fantasy del GP
    //--------------------------------------

    const { data: equipo } =
      await supabase
        .from("equipos")
        .select(`
          usuario,
          avatar,
          puntos_gp_actual
        `)
        .eq(
          "liga_id",
          usuario.liga_actual_id
        )
        .order("puntos_gp_actual", {
          ascending: false,
        })
        .limit(1)
        .single();

    if (!equipo) return;

    setGanador({
      nombreGP: gp.nombre,
      usuario: equipo.usuario,
      puntos: equipo.puntos_gp_actual,
      avatar:
        equipo.avatar ||
        "avatar1.png",
    });
  }

  if (!ganador) return null;

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
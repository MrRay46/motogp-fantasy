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

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    cargarGanador();
  }, []);

  async function cargarGanador() {
    try {
      setCargando(true);

      // -----------------------------------------
      // SESIÓN
      // -----------------------------------------

      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.id) {
        return;
      }

      // -----------------------------------------
      // LIGA ACTUAL DEL USUARIO
      // -----------------------------------------

      const { data: usuario, error: usuarioError } =
        await supabase
          .from("usuarios")
          .select("liga_actual_id")
          .eq("id", sesion.id)
          .single();

      if (usuarioError) {
        console.error(
          "Error obteniendo usuario:",
          usuarioError
        );

        return;
      }

      if (!usuario?.liga_actual_id) {
        return;
      }

      // -----------------------------------------
      // ÚLTIMO GP PROCESADO
      // -----------------------------------------

      const { data: gp, error: gpError } =
        await supabase
          .from("grandes_premios")
          .select(`
            id,
            nombre,
            orden,
            fantasy_procesado
          `)
          .eq("temporada", 2026)
          .eq("fantasy_procesado", true)
          .order("orden", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

      if (gpError) {
        console.error(
          "Error obteniendo último GP procesado:",
          gpError
        );

        return;
      }

      if (!gp) {
        return;
      }

      // -----------------------------------------
      // GANADOR DEL GP EN LA LIGA ACTUAL
      // -----------------------------------------

      const { data: equipo, error: equipoError } =
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
          .maybeSingle();

      if (equipoError) {
        console.error(
          "Error obteniendo ganador del GP:",
          equipoError
        );

        return;
      }

      if (!equipo) {
        return;
      }

      // -----------------------------------------
      // GUARDAR GANADOR
      // -----------------------------------------

      setGanador({
        nombreGP: gp.nombre,
        usuario: equipo.usuario,
        puntos: equipo.puntos_gp_actual ?? 0,
        avatar:
          equipo.avatar || "avatar1.png",
      });
    } catch (error) {
      console.error(
        "Error cargando ganador del GP:",
        error
      );
    } finally {
      setCargando(false);
    }
  }

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (cargando) {
    return (
      <StatCard color="gold">
        <div className="text-center py-8">
          <p className="text-zinc-400">
            Cargando ganador...
          </p>
        </div>
      </StatCard>
    );
  }

  // -----------------------------------------
  // SIN GANADOR
  // -----------------------------------------

  if (!ganador) {
    return (
      <StatCard color="gold">
        <div className="text-center py-8">
          <h2 className="text-lg font-semibold text-yellow-300">
            🏆 Ganador del GP
          </h2>

          <p className="mt-4 text-zinc-400">
            Todavía no hay ningún Gran Premio
            procesado.
          </p>
        </div>
      </StatCard>
    );
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

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
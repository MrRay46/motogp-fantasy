"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "./StatCard";

type Equipo = {
  puntos: number;
  posicion_actual: number;
  posicion_anterior: number;
  diferencia_lider: number;
  diferencia_lider_anterior: number;
};

export default function PerformanceCard() {
  const [equipo, setEquipo] =
    useState<Equipo | null>(null);

  const [color, setColor] = useState<
    "success" | "danger" | undefined
  >();

  const [mensaje, setMensaje] =
    useState("");

  const [flecha, setFlecha] =
    useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const sesion = JSON.parse(
      localStorage.getItem("usuario") ||
        "{}"
    );

    if (!sesion.id) return;

    //------------------------------------------------
    // Obtener liga actual del usuario
    //------------------------------------------------

    const { data: usuario } =
      await supabase
        .from("usuarios")
        .select("liga_actual_id")
        .eq("id", sesion.id)
        .single();

    if (!usuario) return;

    //------------------------------------------------
    // Leer únicamente el equipo del usuario
    //------------------------------------------------

    const { data: miEquipo } =
      await supabase
        .from("equipos")
        .select(`
          puntos,
          posicion_actual,
          posicion_anterior,
          diferencia_lider,
          diferencia_lider_anterior
        `)
        .eq("usuario_id", sesion.id)
        .eq(
          "liga_id",
          usuario.liga_actual_id
        )
        .single();

    if (!miEquipo) return;

    setEquipo(miEquipo);

    //-----------------------------------------
    // Flecha posición
    //-----------------------------------------

    if (
      miEquipo.posicion_anterior > 0
    ) {
      if (
        miEquipo.posicion_actual <
        miEquipo.posicion_anterior
      ) {
        setFlecha("▲");
      } else if (
        miEquipo.posicion_actual >
        miEquipo.posicion_anterior
      ) {
        setFlecha("▼");
      }
    }

    //-----------------------------------------
    // Diferencia líder
    //-----------------------------------------

    const cambio =
      miEquipo.diferencia_lider_anterior -
      miEquipo.diferencia_lider;

    if (cambio > 0) {
      setColor("success");
      setMensaje(
        `Has recortado ${cambio} pts al líder`
      );
    } else if (cambio < 0) {
      setColor("danger");
      setMensaje(
        `El líder te ha sacado ${Math.abs(
          cambio
        )} pts`
      );
    }
  }

  if (!equipo) return null;

  return (
    <StatCard
      title="📊 Tu rendimiento"
      color={color}
    >
      <div className="text-center">
        <h2 className="text-6xl font-black">
          #{equipo.posicion_actual}

          {flecha === "▲" && (
            <span className="ml-2 text-green-400">
              ▲
            </span>
          )}

          {flecha === "▼" && (
            <span className="ml-2 text-red-500">
              ▼
            </span>
          )}
        </h2>

        <p className="mt-4 text-4xl font-bold">
          {equipo.puntos} pts
        </p>

        {mensaje && (
          <p className="mt-6 text-zinc-300">
            {mensaje}
          </p>
        )}
      </div>
    </StatCard>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import StatCard from "./StatCard";

export default function PerformanceCard() {
  const [equipo, setEquipo] = useState<any>(null);
  const [posicion, setPosicion] = useState(0);
  const [color, setColor] = useState<
    "success" | "danger" | undefined
  >();

  const [mensaje, setMensaje] = useState("");

  const [flecha, setFlecha] = useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    const sesion = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

if (!sesion.usuario) return;

    const { data } = await supabase
      .from("equipos")
      .select("*")
      .order("puntos", {
        ascending: false,
      });

    if (!data) return;

   const indice = data.findIndex(
  (e) => e.usuario === sesion.usuario
);

    if (indice === -1) return;

    const miEquipo = data[indice];

    setEquipo(miEquipo);

    const posicionActual = indice + 1;

    setPosicion(posicionActual);

    //---------------------------------
    // CAMBIO DE POSICIÓN
    //---------------------------------

    if (
      miEquipo.posicion_anterior > 0
    ) {
      if (
        posicionActual <
        miEquipo.posicion_anterior
      ) {
        setFlecha("▲");
      } else if (
        posicionActual >
        miEquipo.posicion_anterior
      ) {
        setFlecha("▼");
      }
    }

    //---------------------------------
    // DIFERENCIA CON EL LÍDER
    //---------------------------------

    const lider = data[0];

    const diferenciaActual =
      lider.puntos - miEquipo.puntos;

    const cambio =
      miEquipo.diferencia_lider_anterior -
      diferenciaActual;

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

          #{posicion}

          {flecha === "▲" && (
            <span className="text-green-400 ml-2">
              ▲
            </span>
          )}

          {flecha === "▼" && (
            <span className="text-red-500 ml-2">
              ▼
            </span>
          )}

        </h2>

        <p className="text-4xl font-bold mt-4">
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
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
  const [equipo, setEquipo] = useState<Equipo | null>(null);
  const [color, setColor] = useState<"success" | "danger" | undefined>();
  const [mensaje, setMensaje] = useState("");
  const [flecha, setFlecha] = useState("");

  useEffect(() => {
    async function cargarDatos() {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error("No hay sesión autenticada.", sessionError);
        return;
      }

      const respuesta = await fetch("/api/dashboard/resumen", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      const resultado = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        console.error(
          "Error cargando rendimiento:",
          resultado?.error ?? respuesta.statusText
        );
        return;
      }

      const datos = resultado?.rendimiento as Equipo | null;
      if (!datos) return;

      setEquipo(datos);

      if (datos.posicion_anterior > 0) {
        if (datos.posicion_actual < datos.posicion_anterior) {
          setFlecha("▲");
        } else if (datos.posicion_actual > datos.posicion_anterior) {
          setFlecha("▼");
        }
      }

      const cambio =
        datos.diferencia_lider_anterior - datos.diferencia_lider;

      if (cambio > 0) {
        setColor("success");
        setMensaje(`Has recortado ${cambio} pts al líder`);
      } else if (cambio < 0) {
        setColor("danger");
        setMensaje(`El líder te ha sacado ${Math.abs(cambio)} pts`);
      }
    }

    cargarDatos();
  }, []);

  if (!equipo) return null;

  return (
    <StatCard title="📊 Tu rendimiento" color={color}>
      <div className="text-center">
        <h2 className="text-6xl font-black">
          #{equipo.posicion_actual}
          {flecha === "▲" && (
            <span className="ml-2 text-green-400">▲</span>
          )}
          {flecha === "▼" && (
            <span className="ml-2 text-red-500">▼</span>
          )}
        </h2>

        <p className="mt-4 text-4xl font-bold">
          {equipo.puntos} pts
        </p>

        {mensaje && (
          <p className="mt-6 text-zinc-300">{mensaje}</p>
        )}
      </div>
    </StatCard>
  );
}
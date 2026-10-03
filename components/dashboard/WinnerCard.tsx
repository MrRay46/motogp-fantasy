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
  const [ganador, setGanador] = useState<GanadorGP | null>(null);

  useEffect(() => {
    async function cargarGanador() {
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
          "Error cargando ganador:",
          resultado?.error ?? respuesta.statusText
        );
        return;
      }

      setGanador(resultado?.ganador ?? null);
    }

    cargarGanador();
  }, []);

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
          className="mt-8 h-24 w-24 rounded-full border-4 border-yellow-400 object-cover shadow-lg"
        />
      </div>
    </StatCard>
  );
}
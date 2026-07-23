"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { obtenerRankingPilotos } from "@/services/liga";
import type { PilotoDB } from "@/types/liga";

interface RiderRowProps {
  piloto: PilotoDB;
  posicion: number;
  leaderPoints: number;
}

function RiderRow({
  piloto,
  posicion,
  leaderPoints,
}: RiderRowProps) {
  const diferencia = leaderPoints - piloto.puntos_totales;

  const posicionLabel =
    posicion === 1
      ? "🥇"
      : posicion === 2
      ? "🥈"
      : posicion === 3
      ? "🥉"
      : `#${posicion}`;

  return (
    <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-3 transition-all duration-200 hover:border-red-500 hover:bg-zinc-900">
      <div className="flex items-center gap-4">
        <div className="w-10 text-center text-lg font-bold">
          {posicionLabel}
        </div>

        <div className="relative h-12 w-12 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
          <Image
            src={piloto.miniatura}
            alt={piloto.nombre}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>

        <div className="flex flex-col">
          <span
            className={`font-semibold ${
              posicion === 1
                ? "text-yellow-400"
                : "text-white"
            }`}
          >
            {piloto.nombre}
          </span>

          <span className="text-xs text-zinc-400">
            #{piloto.dorsal}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="text-lg font-bold text-white">
          {piloto.puntos_totales} pts
        </span>

        {posicion !== 1 && (
          <span className="text-sm text-zinc-400">
            -{diferencia}
          </span>
        )}
      </div>
    </div>
  );
}

export default function RidersRanking() {
  const [ranking, setRanking] = useState<PilotoDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    async function cargarRanking() {
      try {
        setLoading(true);

        const datos = await obtenerRankingPilotos();

        setRanking(datos);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar la clasificación.");
      } finally {
        setLoading(false);
      }
    }

    cargarRanking();
  }, []);

  const leaderPoints =
    ranking.length > 0 ? ranking[0].puntos_totales : 0;

  const pilotosVisibles = expanded
    ? ranking
    : ranking.slice(0, 8);
      if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          🏍 Clasificación de Pilotos
        </h2>

        <div className="py-8 text-center text-zinc-400">
          Cargando clasificación...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-zinc-900 p-6">
        <h2 className="mb-4 text-xl font-bold text-white">
          🏍 Clasificación de Pilotos
        </h2>

        <div className="py-8 text-center text-red-400">
          {error}
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">
            🏍 Clasificación de Pilotos
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Campeonato del Mundo
          </p>
        </div>

        <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
          {ranking.length} pilotos
        </span>
      </div>

      <div className="space-y-3">
        {pilotosVisibles.map((piloto, index) => (
          <RiderRow
            key={piloto.id}
            piloto={piloto}
            posicion={index + 1}
            leaderPoints={leaderPoints}
          />
        ))}
      </div>

      {ranking.length > 8 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex w-full items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800/40 py-3 text-sm font-semibold text-zinc-300 transition-all duration-200 hover:border-red-500 hover:bg-zinc-800 hover:text-white"
        >
          {expanded
            ? "▲ Mostrar menos"
            : "▼ Ver clasificación completa"}
        </button>
      )}
    </section>
  );
}
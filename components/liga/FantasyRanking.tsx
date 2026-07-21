"use client";

import Link from "next/link";

import { getUsuarioActual } from "@/lib/session";

import { RankingJugador } from "@/types/liga";

import FantasyRankingRow from "./FantasyRankingRow";

interface FantasyRankingProps {
  ranking: RankingJugador[];
}

export default function FantasyRanking({
  ranking,
}: FantasyRankingProps) {
  const usuario = getUsuarioActual();
  const usuarioId = usuario?.id ?? null;

  return (
    <section className="rounded-2xl bg-zinc-900 p-5 shadow-lg">
      <h2 className="mb-5 text-xl font-bold text-white">
        🏆 Clasificación Fantasy
      </h2>

      {ranking.length === 0 ? (
        <div className="py-8 text-center text-zinc-400">
          Todavía no hay jugadores en esta liga.
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {ranking.slice(0, 7).map((jugador) => (
              <FantasyRankingRow
                key={jugador.id}
                jugador={jugador}
                esUsuarioActual={jugador.id === usuarioId}
              />
            ))}
          </div>

          <Link
            href="/clasificacion"
            className="mt-5 flex justify-center rounded-xl bg-zinc-800 py-3 font-medium text-white transition hover:bg-zinc-700"
          >
            Ver clasificación completa →
          </Link>
        </>
      )}
    </section>
  );
}
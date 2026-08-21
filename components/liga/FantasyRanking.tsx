"use client";

import { useEffect, useState } from "react";

import { getUsuarioActual } from "@/lib/session";
import { obtenerRankingFantasy } from "@/services/liga";

import { RankingJugador } from "@/types/liga";

import FantasyRankingRow from "./FantasyRankingRow";

export default function FantasyRanking() {
  const [ranking, setRanking] = useState<RankingJugador[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [expandedPlayer, setExpandedPlayer] =
    useState<number | null>(null);

  const usuario = getUsuarioActual();

  const ligaId =
    usuario?.liga_actual_id ?? null;

  const usuarioId =
    usuario?.id ?? null;

  useEffect(() => {
    async function cargarRanking() {
      if (ligaId === null) {
        setError("No hay una liga seleccionada.");
        setLoading(false);
        return;
      }

      try {
        const datos =
          await obtenerRankingFantasy(ligaId);

        setRanking(datos);
      } catch (err) {
        console.error(err);

        setError(
          "No se pudo cargar la clasificación."
        );
      } finally {
        setLoading(false);
      }
    }

    cargarRanking();
  }, [ligaId]);

  return (
    <section className="rounded-2xl bg-zinc-900 p-5 shadow-lg">

      <h2 className="mb-5 text-xl font-bold text-white">
        🏆 Clasificación Fantasy
      </h2>

      {/* CARGANDO */}

      {loading && (
        <div className="py-8 text-center text-zinc-400">
          Cargando clasificación...
        </div>
      )}

      {/* ERROR */}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-center text-red-300">
          {error}
        </div>
      )}

      {/* SIN JUGADORES */}

      {!loading &&
        !error &&
        ranking.length === 0 && (
          <div className="py-8 text-center text-zinc-400">
            Todavía no hay jugadores en esta liga.
          </div>
        )}

      {/* CLASIFICACIÓN */}

      {!loading &&
        !error &&
        ligaId !== null &&
        ranking.length > 0 && (

          <div className="space-y-3">

            {ranking.map((jugador) => (
              <FantasyRankingRow
                key={jugador.id}
                jugador={jugador}
                ligaId={ligaId}
                esUsuarioActual={
                  jugador.id === usuarioId
                }
                expanded={
                  expandedPlayer === jugador.id
                }
                onToggle={() =>
                  setExpandedPlayer((prev) =>
                    prev === jugador.id
                      ? null
                      : jugador.id
                  )
                }
              />
            ))}

          </div>
        )}

    </section>
  );
}
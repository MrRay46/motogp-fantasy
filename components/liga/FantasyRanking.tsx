"use client";

import { useEffect, useState } from "react";

import { getUsuarioActual } from "@/lib/session";
import { supabase } from "@/lib/supabase";

import { RankingJugador } from "@/types/liga";

import FantasyRankingRow from "./FantasyRankingRow";

export default function FantasyRanking() {
  const [ranking, setRanking] =
    useState<RankingJugador[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

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
        setError(
          "No hay una liga seleccionada."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError(null);

        // --------------------------------------------------
        // OBTENER SESIÓN AUTENTICADA
        // --------------------------------------------------

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (
          sessionError ||
          !session?.access_token
        ) {
          throw new Error(
            "No hay una sesión autenticada."
          );
        }

        // --------------------------------------------------
        // CARGAR CLASIFICACIÓN MEDIANTE API
        // --------------------------------------------------

        const respuesta = await fetch(
          `/api/ligas/clasificacion?liga_id=${encodeURIComponent(
            ligaId
          )}`,
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const resultado =
          await respuesta
            .json()
            .catch(() => null);

        if (!respuesta.ok) {
          throw new Error(
            resultado?.error ??
              "No se pudo cargar la clasificación."
          );
        }

        setRanking(
          resultado?.ranking ?? []
        );
      } catch (err) {
        console.error(
          "Error cargando clasificación:",
          err
        );

        setError(
          "No se pudo cargar la clasificación."
        );

        setRanking([]);
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
                  expandedPlayer ===
                  jugador.id
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
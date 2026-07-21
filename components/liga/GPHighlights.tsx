"use client";

import { useEffect, useState } from "react";

import { obtenerDestacadosGP } from "@/services/liga";
import { DestacadosGP } from "@/types/liga";

export default function GPHighlights() {
  const [destacados, setDestacados] =
    useState<DestacadosGP | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function cargarDestacados() {
      try {
        const datos =
          await obtenerDestacadosGP();

        setDestacados(datos);
      } catch (err) {
        console.error(err);
        setError(
          "No se pudieron cargar los destacados."
        );
      } finally {
        setLoading(false);
      }
    }

    cargarDestacados();
  }, []);

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-3xl font-black">
        🏍 Últimos destacados
      </h2>

      {loading && (
        <p className="text-zinc-400">
          Cargando destacados...
        </p>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          {error}
        </div>
      )}

      {!loading && !error && !destacados && (
        <p className="text-zinc-400">
          Todavía no hay Grandes Premios finalizados.
        </p>
      )}

      {!loading && !error && destacados && (
        <div className="space-y-5">
          <div>
            <p className="text-sm text-zinc-500">
              Sprint Winner
            </p>

            <p className="text-lg font-bold">
              {destacados.sprintWinner?.nombre ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Race Winner
            </p>

            <p className="text-lg font-bold">
              {destacados.raceWinner?.nombre ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Rider in Form
            </p>

            <p className="text-lg font-bold">
              {destacados.riderInForm?.nombre ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-500">
              Championship Leader
            </p>

            <p className="text-lg font-bold">
              {destacados.championshipLeader?.nombre ?? "-"}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
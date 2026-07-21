"use client";

import { DestacadosGP } from "@/types/liga";

interface GPHighlightsProps {
  destacados: DestacadosGP | null;
}

export default function GPHighlights({
  destacados,
}: GPHighlightsProps) {
  if (!destacados) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-3xl font-black">
          🏍 Últimos destacados
        </h2>

        <p className="text-zinc-400">
          No hay datos disponibles.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-3xl font-black">
        🏍 Últimos destacados
      </h2>

      <div className="space-y-4">
        <div>
          <p className="text-sm text-zinc-500">
            Sprint Winner
          </p>

          <p className="text-lg font-bold text-white">
            {destacados.sprintWinner?.nombre}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">
            Race Winner
          </p>

          <p className="text-lg font-bold text-white">
            {destacados.raceWinner?.nombre}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">
            Rider in Form
          </p>

          <p className="text-lg font-bold text-white">
            {destacados.riderInForm?.nombre}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">
            Championship Leader
          </p>

          <p className="text-lg font-bold text-white">
            {destacados.championshipLeader?.nombre}
          </p>
        </div>
      </div>
    </section>
  );
}
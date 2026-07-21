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

  if (loading) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-3xl font-black">
          🏍 Últimos destacados
        </h2>

        <p className="text-zinc-400">
          Cargando destacados...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-3xl font-black">
          🏍 Últimos destacados
        </h2>

        <p className="text-red-400">
          {error}
        </p>
      </section>
    );
  }

  if (!destacados) {
    return (
      <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <h2 className="mb-6 text-3xl font-black">
          🏍 Últimos destacados
        </h2>

        <p className="text-zinc-400">
          No hay ningún Gran Premio finalizado.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
      <h2 className="mb-6 text-3xl font-black">
        🏍 Últimos destacados
      </h2>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-zinc-800 p-5">
          <p className="text-sm text-zinc-400">
            Sprint Winner
          </p>

          <p className="mt-2 text-xl font-bold">
            {destacados.sprintWinner?.nombre ??
              "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-800 p-5">
          <p className="text-sm text-zinc-400">
            Race Winner
          </p>

          <p className="mt-2 text-xl font-bold">
            {destacados.raceWinner?.nombre ??
              "-"}
          </p>
        </div>

        <div className="rounded-2xl bg-zinc-800 p-5">
          <p className="text-sm text-zinc-400">
            Rider in Form
          </p>

          <p className="mt-2 text-xl font-bold">
            {destacados.riderInForm?.nombre ??
              "-"}
          </p>
        </div>
      </div>
    </section>
  );
}
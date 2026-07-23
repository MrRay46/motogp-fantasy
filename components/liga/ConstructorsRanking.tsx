"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { obtenerRankingConstructores } from "@/services/liga";
import type { ConstructorDB } from "@/types/liga";

interface ConstructorRowProps {
  constructor: ConstructorDB;
  posicion: number;
}

function ConstructorRow({
  constructor,
  posicion,
}: ConstructorRowProps) {

  const posicionLabel =
    posicion === 1
      ? "🥇"
      : posicion === 2
      ? "🥈"
      : posicion === 3
      ? "🥉"
      : `#${posicion}`;

  const hoverColor = {
    ducati: "hover:border-red-500",
    ktm: "hover:border-orange-500",
    yamaha: "hover:border-blue-500",
    aprilia: "hover:border-violet-500",
    honda: "hover:border-rose-600",
  }[constructor.slug] ?? "hover:border-zinc-500";

  const textColor = {
    ducati: "text-red-500",
    ktm: "text-orange-400",
    yamaha: "text-blue-400",
    aprilia: "text-violet-400",
    honda: "text-rose-500",
  }[constructor.slug] ?? "text-white";

  return (
    <div
      className={`flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-900/60 px-4 py-4 transition-all duration-200 ${hoverColor}`}
    >
      <div className="flex items-center gap-4">

        <div className="w-10 text-center text-lg font-bold">
          {posicionLabel}
        </div>

        <div className="relative flex h-14 w-20 items-center justify-center">
  <Image
    src={constructor.logo}
    alt={constructor.nombre}
    fill
    className="object-contain"
    sizes="80px"
  />
</div>

        <span className={`text-lg font-semibold ${textColor}`}>
          {constructor.nombre}
        </span>

      </div>

      <span className="text-xl font-bold text-white">
        {constructor.puntos} pts
      </span>
    </div>
  );
}

export default function ConstructorsRanking() {

  const [ranking, setRanking] = useState<ConstructorDB[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {

    async function cargar() {

      try {

        setLoading(true);

        const datos =
          await obtenerRankingConstructores();

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

    cargar();

  }, []);
    if (loading) {
    return (
      <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6">
        <h2 className="mb-2 text-2xl font-bold text-white">
          🏭 Clasificación de Constructores
        </h2>

        <p className="text-sm text-zinc-400">
          Fabricantes oficiales MotoGP
        </p>

        <div className="py-8 text-center text-zinc-400">
          Cargando clasificación...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-500/30 bg-zinc-900 p-6">
        <h2 className="mb-2 text-2xl font-bold text-white">
          🏭 Clasificación de Constructores
        </h2>

        <p className="text-sm text-zinc-400">
          Fabricantes oficiales MotoGP
        </p>

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
            🏭 Clasificación de Constructores
          </h2>

          <p className="mt-1 text-sm text-zinc-400">
            Fabricantes oficiales MotoGP
          </p>
        </div>

        <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-semibold text-white">
          {ranking.length} constructores
        </span>
      </div>

      <div className="space-y-3">
        {ranking.map((constructor, index) => (
          <ConstructorRow
            key={constructor.id}
            constructor={constructor}
            posicion={index + 1}
          />
        ))}
      </div>
    </section>
  );
}
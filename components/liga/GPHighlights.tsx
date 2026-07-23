"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { obtenerDestacadosGP } from "@/services/liga";
import { DestacadosGP, PilotoDB } from "@/types/liga";

interface HighlightCardProps {
  icon: string;
  title: string;
  pilot: PilotoDB | null;
  accent: "cyan" | "orange" | "yellow";
  subtitle: string;
}

function HighlightCard({
  icon,
  title,
  pilot,
  accent,
  subtitle,
}: HighlightCardProps) {
  const colors = {
    cyan: {
      border: "border-cyan-700",
      bg: "bg-cyan-950/20",
      title: "text-cyan-300",
    },
    orange: {
      border: "border-orange-600",
      bg: "bg-orange-950/20",
      title: "text-orange-300",
    },
    yellow: {
      border: "border-yellow-500",
      bg: "bg-yellow-950/20",
      title: "text-yellow-300",
    },
  };

  const style = colors[accent];

  return (
    <article
      className={`
        ${style.bg}
        ${style.border}
        rounded-2xl
        border
        p-5
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-xl
      `}
    >
      <div className="flex items-center gap-2">
        <span className="text-xl">{icon}</span>

        <p className={`text-sm font-semibold ${style.title}`}>
          {title}
        </p>
      </div>

      {!pilot ? (
        <div className="mt-8 text-zinc-500">
          Sin datos
        </div>
      ) : (
        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xl font-black text-white">
              {pilot.nombre}
            </h3>

            <p className="mt-2 text-sm text-zinc-400">
              {subtitle}
            </p>
          </div>

          <div className="relative h-24 w-24 shrink-0 drop-shadow-xl">
            <Image
              src={pilot.miniatura}
              alt={pilot.nombre}
              fill
              className="object-contain"
              sizes="96px"
            />
          </div>
        </div>
      )}
    </article>
  );
}

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-black text-white">
            🏍 Últimos destacados
          </h2>

          <p className="mt-2 text-zinc-400">
            {destacados.granPremio.nombre}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <HighlightCard
          icon="🏁"
          title="Ganador Sprint"
          pilot={destacados.sprintWinner}
          accent="cyan"
          subtitle={
            destacados.sprintWinner?.equipo ??
            "-"
          }
        />

        <HighlightCard
          icon="🏆"
          title="Ganador Carrera"
          pilot={destacados.raceWinner}
          accent="orange"
          subtitle={
            destacados.raceWinner?.equipo ??
            "-"
          }
        />

        <HighlightCard
          icon="👑"
          title="Líder del Mundial"
          pilot={destacados.riderInForm}
          accent="yellow"
          subtitle={
            destacados.riderInForm
              ? `${destacados.riderInForm.puntos_totales} puntos`
              : "-"
          }
        />
      </div>
    </section>
  );
}
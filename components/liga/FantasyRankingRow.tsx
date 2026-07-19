"use client";

import Image from "next/image";

import {
  MovimientoRanking,
  RankingJugador,
} from "@/types/liga";

interface FantasyRankingRowProps {
  jugador: RankingJugador;
  esUsuarioActual: boolean;
}

export default function FantasyRankingRow({
  jugador,
  esUsuarioActual,
}: FantasyRankingRowProps) {
  return (
    <div
      className={`
        flex items-center
        rounded-xl
        border
        px-4
        py-3
        transition-all
        duration-200

        ${
          esUsuarioActual
            ? "border-red-500 bg-red-600/20"
            : "border-zinc-800 bg-zinc-800 hover:bg-zinc-700"
        }

        ${obtenerBordeTop3(jugador.posicion)}
      `}
    >
      {/* Posición */}

      <div className="w-10 text-center text-xl font-bold">
        {obtenerPosicion(jugador.posicion)}
      </div>

      {/* Avatar */}

      <div className="mx-3">
        <Image
  src={`/avatars/${jugador.avatar}`}
  alt={jugador.usuario}
  width={40}
  height={40}
  className="rounded-full"
  priority={jugador.posicion <= 3}
/>
      </div>

      {/* Usuario */}

      <div className="flex-1">

        <p className="font-semibold text-white">
          {jugador.usuario}
        </p>

      </div>

      {/* Puntos */}

      <div className="mr-5 text-right">

        <p className="font-bold text-white">
          {jugador.puntos}
        </p>

        <p className="text-xs text-zinc-400">
          pts
        </p>

      </div>

      {/* Movimiento */}

      <div
        className={`w-6 text-center text-lg font-bold ${obtenerColorMovimiento(
          jugador.movimiento
        )}`}
      >
        {obtenerMovimiento(jugador.movimiento)}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                   Helpers                                  */
/* -------------------------------------------------------------------------- */

function obtenerPosicion(posicion: number) {
  switch (posicion) {
    case 1:
      return "🥇";

    case 2:
      return "🥈";

    case 3:
      return "🥉";

    default:
      return `#${posicion}`;
  }
}

function obtenerMovimiento(
  movimiento: MovimientoRanking
) {
  switch (movimiento) {
    case "up":
      return "▲";

    case "down":
      return "▼";

    default:
      return "➖";
  }
}

function obtenerColorMovimiento(
  movimiento: MovimientoRanking
) {
  switch (movimiento) {
    case "up":
      return "text-green-400";

    case "down":
      return "text-red-400";

    default:
      return "text-zinc-500";
  }
}

function obtenerBordeTop3(
  posicion: number
) {
  switch (posicion) {
    case 1:
      return "border-yellow-500";

    case 2:
      return "border-slate-300";

    case 3:
      return "border-orange-500";

    default:
      return "";
  }
}
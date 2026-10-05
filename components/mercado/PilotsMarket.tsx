"use client";

import { useEffect, useState } from "react";

import { obtenerRankingPilotos } from "@/services/liga";

import PilotCard from "./PilotCard";
import { Piloto } from "./types";

type PilotsMarketProps = {
  pilotos: Piloto[];

  fichados: string[];
  reserva: string | null;

  puedeFichar: boolean;
  puedeQuitar: boolean;
  puedeElegirReserva: boolean;

  onFichar: (piloto: Piloto) => void;
  onReserva: (piloto: Piloto) => void;
};

export default function PilotsMarket({
  pilotos,
  fichados,
  reserva,
  puedeFichar,
  puedeQuitar,
  puedeElegirReserva,
  onFichar,
  onReserva,
}: PilotsMarketProps) {
  const [puntosActuales, setPuntosActuales] =
    useState<Record<number, number>>({});

  useEffect(() => {
    let cancelado = false;

    async function cargarPuntosActuales() {
      try {
        const ranking =
          await obtenerRankingPilotos();

        if (cancelado) {
          return;
        }

        const puntosPorId: Record<number, number> = {};

        for (const piloto of ranking) {
          puntosPorId[piloto.id] =
            piloto.puntos_totales;
        }

        setPuntosActuales(puntosPorId);
      } catch (error) {
        console.error(
          "Error cargando los puntos actuales de los pilotos:",
          error
        );
      }
    }

    cargarPuntosActuales();

    return () => {
      cancelado = true;
    };
  }, []);

  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {pilotos.map((piloto) => {
        const pilotoConPuntosActuales = {
          ...piloto,
          puntos:
            puntosActuales[piloto.id] ??
            piloto.puntos,
        };

        const fichado =
          fichados.includes(piloto.nombre);

        const esReserva =
          reserva === piloto.nombre;

        const puedeModificarPiloto = fichado
          ? puedeQuitar
          : puedeFichar;

        const puedeConvertirEnReserva =
          fichado &&
          !esReserva &&
          puedeElegirReserva;

        return (
          <PilotCard
            key={piloto.nombre}
            piloto={pilotoConPuntosActuales}
            estado={{
              fichado,
              reserva: esReserva,
              puedeFichar: puedeModificarPiloto,
              puedeReserva:
                puedeConvertirEnReserva,
            }}
            acciones={{
              fichar: () => onFichar(piloto),
              reserva: () => onReserva(piloto),
            }}
          />
        );
      })}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";

import {
  StartingGrid,
  MotorCard,
  PredictionsCard,
} from "@/components/equipo";

import { pilotos } from "@/data/pilotos";
import { motores } from "@/data/motores";

import { useFantasy } from "@/context/FantasyContext";

export default function EquipoPage() {
  const router = useRouter();

  const [comprobandoLiga, setComprobandoLiga] =
    useState(true);

  const {
    equipos,
    jugadorActual,
    cargando,
  } = useFantasy();

  useEffect(() => {
    const guardado =
      localStorage.getItem("usuario");

    if (!guardado) {
      router.replace("/");
      return;
    }

    try {
      const usuario = JSON.parse(guardado);

      if (
        usuario.liga_actual_id === null ||
        usuario.liga_actual_id === undefined
      ) {
        router.replace("/ligas");
        return;
      }

      setComprobandoLiga(false);
    } catch (error) {
      console.error(
        "Error leyendo usuario:",
        error
      );

      router.replace("/");
    }
  }, [router]);

  if (comprobandoLiga) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-400">
          Comprobando liga...
        </div>
      </main>
    );
  }

  if (cargando) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-zinc-400">
          Cargando equipo...
        </div>
      </main>
    );
  }

  const equipoActual =
    equipos[jugadorActual] || {
      fichados: [],
      reserva: null,
      motor: null,
      prediccionPiloto: null,
      prediccionMotor: null,
      puntos: 0,
      puntosGPActual: 0,
    };

  const fichados = equipoActual.fichados;
  const reserva = equipoActual.reserva;
  const motor = equipoActual.motor;

  if (fichados.length === 0) {
    return (
      <AppLayout>
        <div className="max-w-3xl mx-auto py-16 px-6">
          <div
            className="
              rounded-3xl
              border
              border-zinc-800
              bg-zinc-900/70
              p-10
              text-center
            "
          >
            <div className="text-6xl mb-6">
              🏁
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-white mb-5">
              Tu equipo todavía no está creado
            </h1>

            <p className="text-zinc-400 text-lg mb-8">
              Ya perteneces a una liga.
              Puedes crear tu equipo cuando quieras.
            </p>

            <button
              onClick={() =>
                router.push("/mercado")
              }
              className="
                inline-flex
                items-center
                justify-center
                bg-orange-500
                hover:bg-orange-400
                text-white
                font-bold
                px-8
                py-4
                rounded-xl
                transition
              "
            >
              🏍️ Crear mi equipo
            </button>
          </div>
        </div>
      </AppLayout>
    );
  }

  const prediccionPiloto =
    equipoActual.prediccionPiloto;

  const prediccionMotor =
    equipoActual.prediccionMotor;

  const prediccionPilotoModificada =
    equipoActual.prediccionPilotoModificada ??
    false;

  const prediccionMotorModificada =
    equipoActual.prediccionMotorModificada ??
    false;

  const equipo = pilotos.filter(
    (piloto) =>
      fichados.includes(piloto.nombre)
  );

  const titulares = equipo.filter(
    (piloto) =>
      piloto.nombre !== reserva
  );

  const pilotoReserva = pilotos.find(
    (piloto) =>
      piloto.nombre === reserva
  );

  const motorSeleccionado =
    motores.find(
      (item) =>
        item.nombre === motor
    );

  const presupuestoPilotos =
    equipo.reduce(
      (total, piloto) =>
        total + piloto.precio,
      0
    );

  const precioMotor =
    motorSeleccionado?.precio || 0;

  const presupuestoUsado =
    presupuestoPilotos +
    precioMotor;

  const puntosGP =
    equipoActual.puntosGPActual ?? 0;

  const puntosTotales =
    equipoActual.puntos ?? 0;

  return (
    <AppLayout>
      <div className="relative">
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-8">
          </h1>

          <div className="flex flex-wrap gap-6 mb-10">
            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/40
                px-5
                py-3
                min-w-[180px]
              "
            >
              <div className="text-sm text-zinc-400">
                🏆 Puntos GP
              </div>

              <div className="mt-1 text-3xl font-bold text-white">
                {puntosGP}
              </div>
            </div>

            <div
              className="
                rounded-xl
                border
                border-zinc-800
                bg-zinc-900/40
                px-5
                py-3
                min-w-[180px]
              "
            >
              <div className="text-sm text-zinc-400">
                ⭐ Puntos Totales
              </div>

              <div className="mt-1 text-3xl font-bold text-white">
                {puntosTotales}
              </div>
            </div>
          </div>

          <StartingGrid
            titulares={titulares}
            reserva={pilotoReserva ?? null}
          />

          <div className="mt-8">
            <MotorCard
              motor={motorSeleccionado ?? null}
              puntos={0}
            />

            <div className="mt-6">
              <PredictionsCard
                piloto={prediccionPiloto}
                motor={prediccionMotor}
                pilotoModificado={
                  prediccionPilotoModificada
                }
                motorModificado={
                  prediccionMotorModificada
                }
              />
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
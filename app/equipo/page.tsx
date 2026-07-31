"use client";

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
  const {
    equipos,
    jugadorActual,
    cargando,
  } = useFantasy();

  if (cargando) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        Cargando equipo...
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
  };

  const fichados = equipoActual.fichados;
  const reserva = equipoActual.reserva;
  const motor = equipoActual.motor;

  const prediccionPiloto =
    equipoActual.prediccionPiloto;

  const prediccionMotor =
    equipoActual.prediccionMotor;
const prediccionPilotoModificada =
  equipoActual.prediccionPilotoModificada ?? false;

const prediccionMotorModificada =
  equipoActual.prediccionMotorModificada ?? false;

  const equipo = pilotos.filter((piloto) =>
    fichados.includes(piloto.nombre)
  );

  const titulares = equipo.filter(
    (piloto) => piloto.nombre !== reserva
  );

  const pilotoReserva = pilotos.find(
    (piloto) => piloto.nombre === reserva
  );

  const motorSeleccionado =
    motores.find(
      (item) => item.nombre === motor
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
    presupuestoPilotos + precioMotor;

  const puntosTitulares =
    titulares.reduce(
      (total, piloto) =>
        total + piloto.puntosGP,
      0
    );

  const titularConCero =
    titulares.some(
      (piloto) =>
        piloto.puntosGP === 0
    );

  const puntosReserva =
    titularConCero && pilotoReserva
      ? pilotoReserva.puntosGP
      : 0;

  const marcas = [
    "Ducati",
    "Aprilia",
    "KTM",
    "Honda",
    "Yamaha",
  ];

  const resultadosMotores =
    marcas.map((marca) => {
      const pilotosMarca = pilotos
        .filter(
          (piloto) =>
            piloto.marca === marca
        )
        .sort(
          (a, b) =>
            b.puntosGP - a.puntosGP
        );

      const mejoresDos =
        pilotosMarca.slice(0, 2);

      const totalGP =
        mejoresDos.reduce(
          (total, piloto) =>
            total + piloto.puntosGP,
          0
        );

      return {
        marca,
        totalGP,
      };
    });

  const motoresOrdenados =
    resultadosMotores.sort(
      (a, b) => b.totalGP - a.totalGP
    );

  const puntosMotorFantasy = {
    0: 10,
    1: 8,
    2: 6,
    3: 4,
    4: 2,
  };

  const posicionMotor =
    motoresOrdenados.findIndex(
      (item) =>
        item.marca === motor
    );

  const puntosMotor =
    posicionMotor >= 0
      ? puntosMotorFantasy[
          posicionMotor as keyof typeof puntosMotorFantasy
        ]
      : 0;

  const puntosEquipo =
    puntosTitulares +
    puntosReserva +
    puntosMotor;
const puntosTotales =
  equipoActual.puntos ?? 0;

  return (
    <AppLayout>
      <div className="relative">


        <div className="relative z-10">

          <h1 className="text-4xl md:text-5xl font-bold text-red-500 mb-8">
  
</h1>

          <div className="flex flex-wrap gap-6 mb-10">

  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-3 min-w-[180px]">

    <div className="text-sm text-zinc-400">
      🏆 Puntos GP
    </div>

    <div className="mt-1 text-3xl font-bold text-white">
      {puntosEquipo}
    </div>

  </div>

  <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-3 min-w-[180px]">

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
              puntos={puntosMotor}
            />
<div className="mt-6">

</div>
           <PredictionsCard
    piloto={prediccionPiloto}
    motor={prediccionMotor}
    pilotoModificado={prediccionPilotoModificada}
    motorModificado={prediccionMotorModificada}
/>

          </div>

        </div>

      </div>

    </AppLayout>
  );
}
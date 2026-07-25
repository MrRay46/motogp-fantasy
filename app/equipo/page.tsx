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
    };

  const fichados = equipoActual.fichados;
  const reserva = equipoActual.reserva;
  const motor = equipoActual.motor;

  const prediccionPiloto =
    equipoActual.prediccionPiloto;

  const prediccionMotor =
    equipoActual.prediccionMotor;

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

  return (
    <AppLayout>
      <div className="relative">

        {/* Fondo */}

        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">

          <img
            src="/trofeo.png"
            alt="Trofeo MotoGP"
            className="w-full h-full object-cover scale-[1.2] md:scale-100"
          />

        </div>

        <div className="relative z-10">

          <h1 className="text-5xl font-bold text-red-500 mb-8">
            Mi Equipo
          </h1>

          <div className="flex flex-wrap gap-8 mb-10 text-lg">

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-3">

              💰 Presupuesto

              <div className="mt-1 text-2xl font-bold">

                {presupuestoUsado.toFixed(1)} / 172 M

              </div>

            </div>

            <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 px-5 py-3">

              🏆 Puntos GP

              <div className="mt-1 text-2xl font-bold">

                {puntosEquipo}

              </div>

            </div>

          </div>

          <StartingGrid
            titulares={titulares}
            reserva={pilotoReserva ?? null}
          />
                    <div className="grid lg:grid-cols-2 gap-6 mt-8">

            <MotorCard
              motor={motorSeleccionado ?? null}
              puntos={puntosMotor}
            />

            <PredictionsCard
              piloto={prediccionPiloto}
              motor={prediccionMotor}
            />

          </div>

        </div>

      </div>

    </AppLayout>
  );
}
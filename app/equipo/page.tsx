"use client";

import Navbar from "@/components/Navbar";

import { pilotos } from "@/data/pilotos";
import { motores } from "@/data/motores";

import { useFantasy } from "@/context/FantasyContext";

export default function EquipoPage() {
  const {
    equipos,
    jugadorActual,
  } = useFantasy();

  const equipoActual =
    equipos[jugadorActual] || {
  fichados: [],
  reserva: null,
  motor: null,

  prediccionPiloto: null,
  prediccionMotor: null,
}

  const fichados =
    equipoActual.fichados;

  const reserva =
    equipoActual.reserva;

  const motor =
    equipoActual.motor;
const prediccionPiloto =
  equipoActual.prediccionPiloto;

const prediccionMotor =
  equipoActual.prediccionMotor;
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
    titularConCero &&
    pilotoReserva
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
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-8">
      <Navbar />

      <h1 className="text-5xl font-bold text-red-500 mb-8">
        Mi Equipo
      </h1>

      <div className="flex gap-10 mb-10 text-xl">
        <p>
          💰 Presupuesto:{" "}
          {presupuestoUsado.toFixed(
            1
          )}{" "}
          / 172 M
        </p>

        <p>
          🏆 Puntos GP:{" "}
          {puntosEquipo}
        </p>
      </div>

      <h2 className="text-3xl font-semibold mb-6">
        Titulares
      </h2>

      <div className="grid gap-4 mb-10">
        {titulares.map((piloto) => (
          <div
            key={piloto.nombre}
            className="bg-zinc-900/80 border border-zinc-700 p-5 rounded-3xl"
          >
            <h2 className="text-2xl font-bold">
              {piloto.nombre}
            </h2>

            <div className="flex gap-6 mt-3 text-lg">
              <p>
                🏁 GP:{" "}
                {piloto.puntosGP}
              </p>

              <p>
                🌍 Mundial:{" "}
                {piloto.puntos}
              </p>

              <p>
                💰 {piloto.precio} M
              </p>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-semibold mb-6">
        Reserva
      </h2>

      {pilotoReserva ? (
        <div className="bg-blue-900/40 border border-blue-500 p-5 rounded-3xl mb-10">
          <h2 className="text-2xl font-bold">
            {pilotoReserva.nombre}
          </h2>

          <div className="flex gap-6 mt-3 text-lg">
            <p>
              🏁 GP:{" "}
              {pilotoReserva.puntosGP}
            </p>

            <p>
              🌍 Mundial:{" "}
              {pilotoReserva.puntos}
            </p>

            <p>
              💰{" "}
              {pilotoReserva.precio} M
            </p>
          </div>
        </div>
      ) : (
        <p>No tienes piloto reserva.</p>
      )}

      <h2 className="text-3xl font-semibold mb-6">
        Motor
      </h2>

      {motorSeleccionado ? (
        <div className="bg-red-900/40 border border-red-500 p-5 rounded-3xl">
          <h2 className="text-2xl font-bold">
            {motorSeleccionado.nombre}
          </h2>

          <p className="mt-3 text-lg">
            💰{" "}
            {motorSeleccionado.precio} M
            <p className="mt-2 text-lg">
  🏆 {puntosMotor} pts fantasy
</p>
          </p>
        </div>
      ) : (
        <p>No tienes motor seleccionado.</p>
      )}
      <h2 className="text-3xl font-semibold mt-10 mb-6">
  🎯 Predicciones Temporada
</h2>

<div className="grid md:grid-cols-2 gap-6">
  <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-3xl">
    <h3 className="text-2xl font-bold mb-3">
      🏆 Piloto Campeón
    </h3>

    <p className="text-xl">
      {prediccionPiloto ||
        "Sin predicción"}
    </p>
  </div>

  <div className="bg-zinc-900 border border-zinc-700 p-5 rounded-3xl">
    <h3 className="text-2xl font-bold mb-3">
      🏍️ Motor Campeón
    </h3>

    <p className="text-xl">
      {prediccionMotor ||
        "Sin predicción"}
    </p>
  </div>
</div>
<h2>
  🎯 Predicciones Temporada
</h2>
    </main>
  );
}
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
 };

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
    <main className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-8">
      <div className="absolute inset-0 flex justify-center items-center opacity-15 pointer-events-none">

  <img
    src="/trofeo.png"
    alt="Trofeo MotoGP"
    className="w-[1200px] object-contain"
  />

</div>
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

 <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-10">

  {titulares.map((piloto) => (

    <div
      key={piloto.nombre}
      className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-red-500/20 transition-all duration-300"
    >

      <div className="relative">

        <img
          src={piloto.foto}
          alt={piloto.nombre}
          className="w-full h-72 object-contain bg-black"
        />

       <div className="absolute top-4 left-4">

  <img
    src={piloto.logoEquipo}
    alt={piloto.equipo}
    className="w-14 h-14 object-contain"
  />

</div>

        <div className="absolute bottom-4 left-4">
          <h2 className="text-3xl font-black">
            {piloto.nombre}
          </h2>
        </div>

      </div>

      <div className="p-5">

        <div className="flex justify-between text-lg mb-3">

          <p>
            🏆 {piloto.puntosGP} pts
          </p>

          <p>
            💰 {piloto.precio} M
          </p>

        </div>

        <p className="text-zinc-300">
          🌍 Mundial: {piloto.puntos}
        </p>

      </div>

    </div>

  ))}

</div>
      <h2 className="text-3xl font-semibold mb-6">
        Reserva
      </h2>

      {pilotoReserva ? (

  <div className="mb-10 max-w-xl">

    <div
      className="bg-blue-900/30 backdrop-blur-xl border border-blue-500 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] transition-all duration-300"
    >

      <div className="relative">

        <img
          src={pilotoReserva.foto}
          alt={pilotoReserva.nombre}
          className="w-full h-72 object-contain bg-black"
        />

        <div className="absolute top-4 left-4">

  <img
    src={pilotoReserva.logoEquipo}
    alt={pilotoReserva.equipo}
    className="w-14 h-14 object-contain"
  />

</div>

        <div className="absolute bottom-4 left-4">
          <h2 className="text-3xl font-black">
            {pilotoReserva.nombre}
          </h2>
        </div>

      </div>

      <div className="p-5">

        <div className="flex justify-between text-lg mb-3">

          <p>
            🏆 {pilotoReserva.puntosGP} pts
          </p>

          <p>
            💰 {pilotoReserva.precio} M
          </p>

        </div>

        <p className="text-zinc-300">
          🌍 Mundial: {pilotoReserva.puntos}
        </p>

      </div>

    </div>

  </div>

) : (
  <p>No tienes piloto reserva.</p>
)}

      <h2 className="text-3xl font-semibold mb-6">
        Motor
      </h2>

      {motorSeleccionado ? (

  <div className="bg-red-900/30 backdrop-blur-xl border border-red-500 rounded-3xl overflow-hidden shadow-2xl mb-10 max-w-2xl">
    <div className="p-8 flex flex-col md:flex-row items-center gap-8">

      <img
        src={motorSeleccionado.logo}
        alt={motorSeleccionado.nombre}
        className="w-40 h-40 object-contain"
      />

      <div>

        <h2 className="text-5xl font-black mb-4">
          {motorSeleccionado.nombre}
        </h2>

        <div className="flex flex-wrap gap-6 text-xl">

          <p>
            🏆 {puntosMotor} pts fantasy
          </p>

          <p>
            💰 {motorSeleccionado.precio} M
          </p>

        </div>

      </div>

    </div>

  </div>

) : (
  <p>No tienes motor seleccionado.</p>
)}
      <h2 className="text-3xl font-semibold mt-10 mb-6">
  🎯 Predicciones Temporada
</h2>

<div className="grid md:grid-cols-2 gap-6">

  <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">

    <h3 className="text-2xl font-bold mb-6">
      🏆 Piloto Campeón
    </h3>

    {prediccionPiloto ? (

      <div className="flex items-center gap-5">

        <img
          src={
            pilotos.find(
              (p) =>
                p.nombre ===
                prediccionPiloto
            )?.foto
          }
          alt={prediccionPiloto}
          className="w-24 h-24 object-contain"
        />

        <div>

          <p className="text-3xl font-black">
            {prediccionPiloto}
          </p>

          <p className="text-zinc-400 mt-2">
            Predicción temporada
          </p>

        </div>

      </div>

    ) : (

      <p className="text-zinc-400">
        Sin predicción
      </p>

    )}

  </div>

  <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl p-6 shadow-2xl">

    <h3 className="text-2xl font-bold mb-6">
      🏍️ Motor Campeón
    </h3>

    {prediccionMotor ? (

      <div className="flex items-center gap-5">

        <img
          src={
            motores.find(
              (m) =>
                m.nombre ===
                prediccionMotor
            )?.logo
          }
          alt={prediccionMotor}
          className="w-24 h-24 object-contain"
        />

        <div>

          <p className="text-3xl font-black">
            {prediccionMotor}
          </p>

          <p className="text-zinc-400 mt-2">
            Predicción temporada
          </p>

        </div>

      </div>

    ) : (

      <p className="text-zinc-400">
        Sin predicción
      </p>

    )}

  </div>

</div>

    </main>
  );
}
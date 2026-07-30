"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";

import { motores } from "@/data/motores";
import { pilotos } from "@/data/pilotos";

import { obtenerEstadoMercado } from "@/lib/mercado";

import { useFantasy } from "@/context/FantasyContext";

export default function MercadoPage() {

  const {
    equipos,
    setEquipos,
    jugadorActual,
  } = useFantasy();

  const equipoActual =
  equipos[jugadorActual] || {
    fichados: [],
    reserva: null,
    motor: null,

    prediccionPiloto: null,
    prediccionMotor: null,

    constructorModificado: false,
    reservaModificada: false,
    cambiosPilotos: 0,
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

  const [mercadoAbierto, setMercadoAbierto] =
    useState(false);

  const [diasRestantes, setDiasRestantes] =
    useState<number | null>(null);

    const [estadoMercado, setEstadoMercado] = useState<any>(null);
useEffect(() => {
  async function cargarMercado() {
    const estado = await obtenerEstadoMercado();

    if (!estado) return;

    setEstadoMercado(estado);
    setMercadoAbierto(estado.mercadoAbierto);
    setDiasRestantes(estado.diasRestantes);
  }

  cargarMercado();
}, []);

  const setFichados = (
    nuevosFichados: string[]
  ) => {

    const nuevosEquipos = {
      ...equipos,

      [jugadorActual]: {

        ...equipos[jugadorActual],

        fichados:
          nuevosFichados,

      },

    };

    setEquipos(
      nuevosEquipos
    );

  };

  const setReserva = (
    nuevaReserva: string | null
  ) => {

    setEquipos((prev) => ({

      ...prev,

      [jugadorActual]: {

        ...prev[jugadorActual],

        reserva: nuevaReserva,

      },

    }));

  };

  const setMotor = (
    nuevoMotor: string | null
  ) => {

    setEquipos((prev) => ({

      ...prev,

      [jugadorActual]: {

        ...prev[jugadorActual],

        motor: nuevoMotor,

      },

    }));

  };

  const setPrediccionPiloto = (
    piloto: string
  ) => {

    setEquipos((prev) => ({

      ...prev,

      [jugadorActual]: {

        ...prev[jugadorActual],

        prediccionPiloto: piloto,

        prediccionPilotoOriginal:
          prev[jugadorActual]
            ?.prediccionPilotoOriginal ||
          piloto,

        prediccionPilotoModificada:

          prev[jugadorActual]
            ?.prediccionPilotoOriginal &&

          prev[jugadorActual]
            ?.prediccionPilotoOriginal !== piloto

            ? true

            : prev[jugadorActual]
                ?.prediccionPilotoModificada ||
              false,

      },

    }));

  };

  const setPrediccionMotor = (
    marca: string
  ) => {

    setEquipos((prev) => ({

      ...prev,

      [jugadorActual]: {

        ...prev[jugadorActual],

        prediccionMotor: marca,

        prediccionMotorOriginal:
          prev[jugadorActual]
            ?.prediccionMotorOriginal ||
          marca,

        prediccionMotorModificada:

          prev[jugadorActual]
            ?.prediccionMotorOriginal &&

          prev[jugadorActual]
            ?.prediccionMotorOriginal !== marca

            ? true

            : prev[jugadorActual]
                ?.prediccionMotorModificada ||
              false,

      },

    }));

  };

  const equipo = pilotos.filter(
    (piloto) =>
      fichados.includes(
        piloto.nombre
      )
  );

  const motorSeleccionado =
    motores.find(
      (m) => m.nombre === motor
    );

  const precioMotor =
    motorSeleccionado?.precio || 0;

  const presupuestoUsado =
    equipo.reduce(
      (total, piloto) =>
        total + piloto.precio,
      0
    ) + precioMotor;

  const presupuestoRestante =
    172 - presupuestoUsado;
    const puedeCambiarConstructor = () => {
  if (!mercadoAbierto) return false;

  if (!estadoMercado?.cambiarConstructor) return false;

  if (equipoActual.constructorModificado) return false;

  return true;
};
    return (

  <AppLayout>

    <h1 className="text-5xl font-bold text-red-500 mb-4">
      Mercado
    </h1>

    {mercadoAbierto ? (

      <p className="text-xl mb-6 text-green-400 font-semibold">
        🟢 Mercado abierto
      </p>

    ) : (

      <div className="mb-6 space-y-2">

        <p className="text-xl text-yellow-400 font-semibold">
          🔒 Mercado cerrado
        </p>

        {diasRestantes !== null && (
          <p className="text-lg text-zinc-300">
            ⏳ Abre en {diasRestantes}{" "}
            {diasRestantes === 1 ? "día" : "días"}
          </p>
        )}

      </div>

    )}

    <p className="text-xl mb-8">
      💰 Presupuesto restante:{" "}
      {presupuestoRestante.toFixed(1)} M
    </p>

    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

      {pilotos.map((piloto) => (

        <div
          key={piloto.nombre}
          className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-red-500/20 transition-all duration-300"
        >

          <div className="relative">

            <img
              src={piloto.foto}
              alt={piloto.nombre}
              className="w-full h-72 object-contain bg-gradient-to-b from-zinc-900 to-black p-4"
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

            <div className="flex justify-between text-lg mb-5">

              <p>🏆 {piloto.puntos} pts</p>

              <p>💰 {piloto.precio} M</p>

            </div>

            <div className="flex gap-3 flex-wrap">

              <button
  disabled={
    !mercadoAbierto ||
    (
      !fichados.includes(piloto.nombre) &&
      (
        fichados.length >= 6 ||
        presupuestoUsado + piloto.precio > 172
      )
    )
  }
  onClick={() => {
    if (!mercadoAbierto) return;

    if (fichados.includes(piloto.nombre)) {
      setFichados(
        fichados.filter(
          (nombre) => nombre !== piloto.nombre
        )
      );
      return;
    }

    if (
      fichados.length >= 6 ||
      presupuestoUsado + piloto.precio > 172
    ) {
      return;
    }

    setFichados([
      ...fichados,
      piloto.nombre,
    ]);
  }}
  className={`px-4 py-2 rounded-xl font-bold transition ${
    fichados.includes(piloto.nombre)
      ? "bg-red-600"
      : "bg-red-500 hover:bg-red-400"
  }`}
>
  {fichados.includes(piloto.nombre)
    ? "Quitar ❌"
    : "Fichar"}
</button>

              {fichados.includes(piloto.nombre) && (

                <button
                  disabled={!mercadoAbierto}
                  onClick={() => {

                    if (!mercadoAbierto) return;

                    setReserva(
                      piloto.nombre
                    );

                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    reserva === piloto.nombre
                      ? "bg-blue-600"
                      : "bg-blue-500 hover:bg-blue-400"
                  }`}
                >

                  {reserva === piloto.nombre
                    ? "Reserva ✅"
                    : "Reserva"}

                </button>

              )}

            </div>

          </div>

        </div>

      ))}

    </div>
  <h2 className="text-4xl font-bold mt-16 mb-6">
  Motores
</h2>

<div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
  {motores.map((item) => (
    <div
      key={item.nombre}
      className="bg-red-900/40 border border-red-500 p-6 rounded-3xl"
    >
      <div className="flex items-center gap-4 mb-4">
        <img
          src={item.logo}
          alt={item.nombre}
          className="w-16 h-16 object-contain"
        />

        <h2 className="text-2xl font-bold">
          {item.nombre}
        </h2>
      </div>

      <p className="text-lg">
        💰 {item.precio} M
      </p>

      <button
        disabled={!puedeCambiarConstructor()}
        onClick={() => {
  if (!puedeCambiarConstructor()) return;

  setEquipos((prev) => ({
    ...prev,
    [jugadorActual]: {
      ...prev[jugadorActual],
      motor: item.nombre,
      constructorModificado: true,
    },
  }));
}}
        className={`mt-4 px-4 py-2 rounded-xl transition ${
         !puedeCambiarConstructor()
            ? "bg-zinc-700 opacity-50 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-400"
        }`}
      >
        {motor === item.nombre
          ? "Seleccionado ✅"
          : "Seleccionar"}
      </button>
    </div>
  ))}
</div>

    <h2 className="text-4xl font-bold mt-16 mb-6">
      🎯 Predicciones Temporada
    </h2>

    <div className="grid md:grid-cols-2 gap-6">

      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl">

        <h3 className="text-2xl font-bold mb-4">
          🏆 Piloto Campeón
        </h3>

        <div className="flex flex-wrap gap-3">

          {pilotos.map((piloto) => (

            <button
              key={piloto.nombre}
              disabled={!mercadoAbierto}
              onClick={() => {

                if (!mercadoAbierto) return;

                setPrediccionPiloto(
                  piloto.nombre
                );

              }}
              className={`px-4 py-2 rounded-xl transition ${
                prediccionPiloto === piloto.nombre
                  ? "bg-green-500"
                  : mercadoAbierto
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-zinc-700 opacity-50 cursor-not-allowed"
              }`}
            >

              {piloto.nombre}

            </button>

          ))}

        </div>

      </div>

      <div className="bg-zinc-900 border border-zinc-700 p-6 rounded-3xl">

        <h3 className="text-2xl font-bold mb-4">
          🏍️ Motor Campeón
        </h3>

        <div className="flex flex-wrap gap-3">

          {motores.map((item) => (

            <button
              key={item.nombre}
              disabled={!mercadoAbierto}
              onClick={() => {

                if (!mercadoAbierto) return;

                setPrediccionMotor(
                  item.nombre
                );

              }}
              className={`px-4 py-2 rounded-xl transition ${
                prediccionMotor === item.nombre
                  ? "bg-green-500"
                  : mercadoAbierto
                  ? "bg-zinc-800 hover:bg-zinc-700"
                  : "bg-zinc-700 opacity-50 cursor-not-allowed"
              }`}
            >

              {item.nombre}

            </button>

          ))}

        </div>

      </div>

    </div>

  </AppLayout>

);

}
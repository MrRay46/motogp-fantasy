"use client";

import Navbar from "@/components/Navbar";

import { motores } from "@/data/motores";
import { pilotos } from "@/data/pilotos";
import { ventanasMercado } from "@/data/mercado";

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

  const setFichados = (
    nuevosFichados: string[]
  ) => {
    setEquipos((prev) => ({
      ...prev,
      [jugadorActual]: {
        ...equipoActual,
        fichados: nuevosFichados,
      },
    }));
  };

  const setReserva = (
    nuevaReserva: string | null
  ) => {
    setEquipos((prev) => ({
      ...prev,
      [jugadorActual]: {
        ...equipoActual,
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
        ...equipoActual,
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
        ...equipoActual,
        prediccionPiloto: piloto,
      },
    }));
  };

  const setPrediccionMotor = (
    marca: string
  ) => {
    setEquipos((prev) => ({
      ...prev,
      [jugadorActual]: {
        ...equipoActual,
        prediccionMotor: marca,
      },
    }));
  };

  const equipo = pilotos.filter(
    (piloto) =>
      fichados.includes(
        piloto.nombre
      )
  );

  const presupuestoUsado =
    equipo.reduce(
      (total, piloto) =>
        total + piloto.precio,
      0
    );

  const presupuestoRestante =
    172 - presupuestoUsado;

  const hoy = new Date()
    .toISOString()
    .split("T")[0];

  const mercadoAbierto =
    ventanasMercado.some(
      (ventana) => {
        return (
          hoy >= ventana.inicio &&
          hoy <= ventana.fin
        );
      }
    );

  return (
    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-8">

      <Navbar />

      <h1 className="text-5xl font-bold text-red-500 mb-4">
        Mercado
      </h1>

      <p className="text-xl mb-6">
        {mercadoAbierto
          ? "🟢 Mercado abierto"
          : "🔒 Mercado cerrado"}
      </p>

      <p className="text-xl mb-8">
        💰 Presupuesto restante:{" "}
        {presupuestoRestante.toFixed(
          1
        )}{" "}
        M
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

              <div className="absolute top-4 left-4 bg-black/70 px-3 py-1 rounded-xl text-sm font-bold">
                {piloto.marca}
              </div>

              <div className="absolute bottom-4 left-4">
                <h2 className="text-3xl font-black">
                  {piloto.nombre}
                </h2>
              </div>

            </div>

            <div className="p-5">

              <div className="flex justify-between text-lg mb-5">

                <p>
                  🏆 {piloto.puntos} pts
                </p>

                <p>
                  💰 {piloto.precio} M
                </p>

              </div>

              <div className="flex gap-3 flex-wrap">

                <button
                  disabled={
                    !mercadoAbierto ||
                    (
                      !fichados.includes(
                        piloto.nombre
                      ) &&
                      (
                        fichados.length >= 6 ||
                        presupuestoUsado +
                          piloto.precio >
                          172
                      )
                    )
                  }
                  onClick={() => {

                    if (
                      !mercadoAbierto
                    ) return;

                    if (
                      fichados.includes(
                        piloto.nombre
                      )
                    ) {

                      setFichados(
                        fichados.filter(
                          (nombre) =>
                            nombre !==
                            piloto.nombre
                        )
                      );

                      return;
                    }

                    if (
                      fichados.length >= 6 ||
                      presupuestoUsado +
                        piloto.precio >
                        172
                    ) {
                      return;
                    }

                    setFichados([
                      ...fichados,
                      piloto.nombre,
                    ]);
                  }}
                  className={`px-4 py-2 rounded-xl font-bold transition ${
                    fichados.includes(
                      piloto.nombre
                    )
                      ? "bg-red-600"
                      : "bg-red-500 hover:bg-red-400"
                  }`}
                >
                  {fichados.includes(
                    piloto.nombre
                  )
                    ? "Quitar ❌"
                    : "Fichar"}
                </button>

                {fichados.includes(
                  piloto.nombre
                ) && (

                  <button
                    disabled={
                      !mercadoAbierto
                    }
                    onClick={() => {

                      if (
                        !mercadoAbierto
                      ) return;

                      setReserva(
                        piloto.nombre
                      );
                    }}
                    className={`px-4 py-2 rounded-xl font-bold transition ${
                      reserva ===
                      piloto.nombre
                        ? "bg-blue-600"
                        : "bg-blue-500 hover:bg-blue-400"
                    }`}
                  >
                    {reserva ===
                    piloto.nombre
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
              disabled={!mercadoAbierto}
              onClick={() => {

                if (
                  !mercadoAbierto
                ) return;

                setMotor(
                  item.nombre
                );
              }}
              className={`mt-4 px-4 py-2 rounded-xl transition ${
                mercadoAbierto
                  ? "bg-red-500 hover:bg-red-400"
                  : "bg-zinc-700 opacity-50 cursor-not-allowed"
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

                  if (
                    !mercadoAbierto
                  ) return;

                  setPrediccionPiloto(
                    piloto.nombre
                  );
                }}
                className={`px-4 py-2 rounded-xl transition ${
                  prediccionPiloto ===
                  piloto.nombre
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

                  if (
                    !mercadoAbierto
                  ) return;

                  setPrediccionMotor(
                    item.nombre
                  );
                }}
                className={`px-4 py-2 rounded-xl transition ${
                  prediccionMotor ===
                  item.nombre
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

    </main>
  );
}
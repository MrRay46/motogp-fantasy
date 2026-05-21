"use client";
import { motores } from "@/data/motores";
import Navbar from "@/components/Navbar";
import { ventanasMercado } from "@/data/mercado";
import { pilotos } from "@/data/pilotos";

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
  };

const fichados =
  equipoActual.fichados;

const reserva =
  equipoActual.reserva;

const motor =
  equipoActual.motor;
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
  const equipo = pilotos.filter((piloto) =>
    fichados.includes(piloto.nombre)
  );

  const presupuestoUsado = equipo.reduce(
    (total, piloto) => total + piloto.precio,
    0
  );

  const presupuestoRestante =
    172 - presupuestoUsado;
const hoy = new Date()
  .toISOString()
  .split("T")[0];

const mercadoAbierto =
  ventanasMercado.some((ventana) => {
    return (
      hoy >= ventana.inicio &&
      hoy <= ventana.fin
    );
  });
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


      <p className="text-xl mb-6">
        💰 Presupuesto restante:{" "}
        {presupuestoRestante.toFixed(1)} M
      </p>

      <div className="grid gap-4">
        {pilotos.map((piloto) => (
          <div
            key={piloto.nombre}
            className="bg-zinc-900/80 backdrop-blur p-5 rounded-3xl border border-zinc-700"
          >
            <h2 className="text-2xl font-bold">
              {piloto.nombre}
            </h2>

            <div className="flex gap-6 mt-3 text-lg">
              <p>🏆 {piloto.puntos} pts</p>
              <p>💰 {piloto.precio} M</p>
            </div>

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
  if (!mercadoAbierto) return;

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
              className="mt-4 bg-red-500 hover:bg-red-400 transition px-4 py-2 rounded-xl"
            >
              {fichados.includes(
                piloto.nombre
              )
                ? "Quitar ❌"
                : "Fichar"}
            </button>
            {fichados.includes(piloto.nombre) && (
  <button
  disabled={!mercadoAbierto}
   onClick={() => {
  if (!mercadoAbierto) return;

  setReserva(piloto.nombre);
}}
    className="mt-2 ml-3 bg-blue-500 hover:bg-blue-400 transition px-4 py-2 rounded-xl"
  >
    {reserva === piloto.nombre
      ? "Reserva ✅"
      : "Hacer Reserva"}
  </button>
)}
          </div>
        ))}
      </div>
      <h2 className="text-4xl font-bold mt-12 mb-6">
  Motores
</h2>

<div className="grid gap-4">
  {motores.map((item) => (
    <div
      key={item.nombre}
      className="bg-red-900/40 border border-red-500 p-5 rounded-3xl"
    >
      <h2 className="text-2xl font-bold">
        {item.nombre}
      </h2>

      <p className="mt-3 text-lg">
        💰 {item.precio} M
      </p>

      <button
      disabled={!mercadoAbierto}
        onClick={() => {
  if (!mercadoAbierto) return;

  setMotor(item.nombre);
}}
        className="mt-4 bg-red-500 hover:bg-red-400 transition px-4 py-2 rounded-xl"
      >
        {motor === item.nombre
          ? "Seleccionado ✅"
          : "Seleccionar"}
      </button>
    </div>
  ))}
</div>
    </main>

  );
}
"use client";

import { jugadores } from "@/data/jugadores";

export default function LoginPage() {
  const seleccionarJugador = (
    jugador: string
  ) => {
    localStorage.setItem(
      "usuarioLogueado",
      jugador
    );

    window.location.href = "/";
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-5xl font-bold text-red-500 mb-12">
        MotoGP Fantasy
      </h1>

      <div className="grid gap-6 w-full max-w-md">
        {jugadores.map((jugador) => (
          <button
            key={jugador.nombre}
            onClick={() =>
              seleccionarJugador(
                jugador.nombre
              )
            }
            className="bg-zinc-900 border border-zinc-700 hover:border-red-500 transition p-6 rounded-3xl text-2xl font-bold"
          >
            {jugador.nombre}
          </button>
        ))}
      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [jugadores, setJugadores] =
    useState<any[]>([]);

  useEffect(() => {

    const cargarJugadores =
      async () => {

        const {
  data,
  error,
} = await supabase
  .from("usuarios")
  .select("usuario")
  .eq("activo", true);

        if (error) {
          console.error(error);
          return;
        }

        setJugadores(
          data || []
        );

      };

    cargarJugadores();

  }, []);

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

        {jugadores.map(
          (jugador) => (

            <button
              key={jugador.usuario}
              onClick={() =>
                seleccionarJugador(
                  jugador.usuario
                )
              }
              className="bg-zinc-900 border border-zinc-700 hover:border-red-500 transition p-6 rounded-3xl text-2xl font-bold"
            >
              {jugador.usuario}
            </button>

          )
        )}

      </div>

    </main>

  );

}
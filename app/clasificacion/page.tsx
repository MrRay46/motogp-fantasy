"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

type Jugador = {
  usuario: string;
  avatar: string | null;
  puntos: number;
};

export default function ClasificacionPage() {

  const [jugadores, setJugadores] =
    useState<Jugador[]>([]);

  useEffect(() => {

    const cargarClasificacion =
      async () => {

        const {
          data,
          error,
        } = await supabase
          .from("equipos")
          .select(
            "usuario, avatar, puntos"
          )
          .order(
            "puntos",
            {
              ascending: false,
            }
          );

        if (error) {
          console.error(error);
          return;
        }

        setJugadores(
          data || []
        );
      };

    cargarClasificacion();

  }, []);

  return (

    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-8">

      <Navbar />

      <h1 className="text-5xl font-bold text-red-500 mb-10">
        Clasificación
      </h1>

      <div className="space-y-4">

        {jugadores.map(
          (
            jugador,
            index
          ) => (

            <div
              key={
                jugador.usuario
              }
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-3xl p-4"
            >

              <div className="flex items-center gap-4">

                <div className="text-2xl font-bold text-yellow-400 w-12">
                  #{index + 1}
                </div>

                <img
                  src={
                    jugador.avatar
                      ? `/avatars/${jugador.avatar}`
                      : "/avatars/avatar1.png"
                  }
                  alt={
                    jugador.usuario
                  }
                  className="w-16 h-16 object-contain"
                />

                <div>

                  <p className="text-xl font-bold">
                    {
                      jugador.usuario
                    }
                  </p>

                </div>

              </div>

              <div className="text-2xl font-bold text-green-400">
                {
                  jugador.puntos
                } pts
              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}
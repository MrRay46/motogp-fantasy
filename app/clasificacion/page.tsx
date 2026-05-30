"use client";

import Navbar from "@/components/Navbar";
import { pilotos } from "@/data/pilotos";
import { motores } from "@/data/motores";

export default function ClasificacionPage() {

  const clasificacionPilotos =
    [...pilotos].sort(
      (a, b) => b.puntos - a.puntos
    );

  const clasificacionMotores =
    [...motores].sort(
      (a, b) => b.puntos - a.puntos
    );

  return (

    <main className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-white p-8">

      <Navbar />

      <h1 className="text-5xl font-bold text-red-500 mb-10">
        Clasificaciones Oficiales
      </h1>

      <h2 className="text-3xl font-bold mb-6">
        🏍️ Mundial de Pilotos
      </h2>

      <div className="space-y-4 mb-16">

        {clasificacionPilotos.map(
          (piloto, index) => (

            <div
              key={piloto.nombre}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-3xl p-4"
            >

              <div className="flex items-center gap-4">

                <div className="text-2xl font-bold text-yellow-400 w-12">
                  #{index + 1}
                </div>

                <img
                  src={piloto.foto}
                  alt={piloto.nombre}
                  className="w-16 h-16 object-contain"
                />

                <div>

                  <p className="text-xl font-bold">
                    {piloto.nombre}
                  </p>

                  <p className="text-zinc-400">
                    {piloto.equipo}
                  </p>

                </div>

              </div>

              <div className="text-2xl font-bold text-green-400">
                {piloto.puntos} pts
              </div>

            </div>

          )
        )}

      </div>

      <h2 className="text-3xl font-bold mb-6">
        🏭 Mundial de Constructores
      </h2>

      <div className="space-y-4">

        {clasificacionMotores.map(
          (motor, index) => (

            <div
              key={motor.nombre}
              className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-3xl p-4"
            >

              <div className="flex items-center gap-4">

                <div className="text-2xl font-bold text-yellow-400 w-12">
                  #{index + 1}
                </div>

                <img
                  src={motor.logo}
                  alt={motor.nombre}
                  className="w-16 h-16 object-contain"
                />

                <p className="text-xl font-bold">
                  {motor.nombre}
                </p>

              </div>

              <div className="text-2xl font-bold text-green-400">
                {motor.puntos} pts
              </div>

            </div>

          )
        )}

      </div>

    </main>

  );

}
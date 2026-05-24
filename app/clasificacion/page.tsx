"use client";

import Navbar from "@/components/Navbar";

import { pilotos } from "@/data/pilotos";

export default function ClasificacionPage() {

  const pilotosOrdenados =
    [...pilotos].sort(
      (a, b) => b.puntos - a.puntos
    );

  const marcas = [
    "Ducati",
    "Aprilia",
    "KTM",
    "Honda",
    "Yamaha",
  ];

  const constructores =
    marcas.map((marca) => {
      const pilotosMarca =
        pilotos.filter(
          (piloto) =>
            piloto.marca === marca
        );

      const puntos =
        pilotosMarca.reduce(
          (total, piloto) =>
            total + piloto.puntos,
          0
        );

      return {
        marca,
        puntos,
      };
    });

  constructores.sort(
    (a, b) => b.puntos - a.puntos
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-8">

      <Navbar />

      <h1 className="text-6xl font-black mb-10 bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent">
        Clasificaciones
      </h1>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            🏆 Mundial Pilotos
          </h2>

          {pilotosOrdenados.map(
            (piloto, index) => (
              <div
                key={piloto.nombre}
                className="flex justify-between py-3 border-b border-zinc-800"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={piloto.foto}
                    alt={piloto.nombre}
                    className="w-14 h-14 object-cover rounded-xl border border-zinc-700"
                  />

                  <p className="text-xl font-semibold">
                    {index + 1}. {piloto.nombre}
                  </p>

                </div>

                <p className="text-xl font-bold text-red-400">
                  {piloto.puntos}
                </p>
              </div>
            )
          )}
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-6 rounded-3xl shadow-2xl">

          <h2 className="text-3xl font-bold mb-6">
            🏍️ Constructores
          </h2>

          {constructores.map(
            (constructor, index) => (
              <div
                key={constructor.marca}
                className="flex justify-between py-3 border-b border-zinc-800"
              >
                <div className="flex items-center gap-4">

  <img
    src={`/marcas/${constructor.marca.toLowerCase()}.png`}
    alt={constructor.marca}
    className="w-12 h-12 object-contain"
  />

  <p className="text-xl font-semibold">
    {index + 1}. {constructor.marca}
  </p>

</div>

                <p className="text-xl font-bold text-orange-400">
                  {constructor.puntos}
                </p>
              </div>
            )
          )}
        </div>

      </div>
    </main>
  );
}
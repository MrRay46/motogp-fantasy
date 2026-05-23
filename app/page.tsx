"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { jugadores } from "@/data/jugadores";
import { pilotos } from "@/data/pilotos";

import { useFantasy } from "@/context/FantasyContext";

export default function Home() {
  const router = useRouter();

useEffect(() => {
  const usuario =
    localStorage.getItem(
      "usuarioLogueado"
    );

  if (!usuario) {
    router.push("/login");
  }
}, []);
const {
  equipos,
  jugadorActual,
} = useFantasy();

 const equipoActual =
  equipos[jugadorActual];

const fichados =
  equipoActual?.fichados || [];

const equipo = pilotos.filter((piloto) =>
  fichados.includes(piloto.nombre)
);

  const puntosEquipo = equipo.reduce(
    (total, piloto) => total + piloto.puntos,
    0
  );
const marcas = ["Ducati", "Aprilia", "KTM", "Honda", "Yamaha"];

const resultadosMotores = marcas.map((marca) => {
  const pilotosMarca = pilotos
    .filter((piloto) => piloto.marca === marca)
    .sort((a, b) => b.puntosGP - a.puntosGP);

  const mejoresDos =
    pilotosMarca.slice(0, 2);

  const totalGP = mejoresDos.reduce(
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
  const clasificacion = [
    {
      nombre: "Alejandro",
      puntos: 388,
    },
    {
      nombre: "David",
      puntos: 428,
    },
    {
      nombre: "De la Raya Jr",
      puntos: 367,
    },
    {
      nombre: "De la Raya Sr",
      puntos: 387,
    },
    {
      nombre: "José",
      puntos: 285,
    },
  ];
clasificacion.sort(
  (a, b) => b.puntos - a.puntos
);
  const posicion =
    clasificacion.findIndex(
      (jugador) =>
        jugador.nombre === jugadorActual
    ) + 1;

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-8">
      <Navbar />

      <div className="mb-12">
  <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
    MotoGP Fantasy
  </h1>

  <p className="text-zinc-400 text-xl mt-3">
    Campeonato Fantasy 2025
  </p>
</div>
<div className="mb-8">
  <h2 className="text-3xl font-bold mb-6">
    👤 {jugadorActual}
  </h2>
</div>
      <div className="grid md:grid-cols-3 gap-6 mb-10">

        <div className=" bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">
            🏆 Tu Posición
          </h2>

          <p className="text-5xl font-extrabold text-red-500">
            #{posicion}
          </p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">
            📊 Tus Puntos
          </h2>

          <p className="text-5xl font-extrabold text-green-400">
            {puntosEquipo}
          </p>
        </div>

        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
          <h2 className="text-2xl font-bold mb-4">
            🏁 Próximo GP
          </h2>

          <p className="text-3xl font-bold">
            Autodromo Internazionale del Mugello
          </p>

          <p className="mt-2 text-zinc-400">
            29 may - 31 may
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-10">

  <div className="bg-red-900/40 border border-red-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
    <h2 className="text-2xl font-bold mb-4">
      🏁 Último Ganador
    </h2>

    <p className="text-3xl font-bold">
      Di Giannantonio
    </p>

    <p className="mt-2 text-zinc-300">
      GP de Cataluña
    </p>
  </div>

  <div className="bg-orange-900/40 border border-orange-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
    <h2 className="text-2xl font-bold mb-4">
      🏍️ Motor Ganador
    </h2>

    <p className="text-3xl font-bold">
      Ducati
    </p>

    <p className="mt-2 text-zinc-300">
      Mejor constructor del GP
    </p>
  </div>

  <div className="bg-blue-900/40 border border-blue-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 hover:scale-[1.02] transition-all duration-300">
    <h2 className="text-2xl font-bold mb-4">
      🔥 Piloto en Forma
    </h2>

    <p className="text-3xl font-bold">
      Marco Bezzecchi
    </p>

    <p className="mt-2 text-zinc-300">
      Lider del mundial y fantasy
    </p>
  </div>

  <div className="bg-yellow-900/40 border border-yellow-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
    <h2 className="text-2xl font-bold mb-4">
      🔥 Motor en Forma
    </h2>

    <p className="text-3xl font-bold">
      Aprilia
    </p>

    <p className="mt-2 text-zinc-300">
      Líder fantasy actual
    </p>
  </div>



        
      </div>

      <h2 className="text-4xl font-bold mb-6">
        Clasificación General
      </h2>

      <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
        {clasificacion.map((jugador, index) => (
          <div
            key={jugador.nombre}
            className="flex justify-between py-3 border-b border-zinc-700"
          >
            <p className="text-xl">
              {index === 0
  ? "🥇"
  : index === 1
  ? "🥈"
  : index === 2
  ? "🥉"
  : `${index + 1}.`} {jugador.nombre}
            </p>

            <p className="text-xl font-bold">
              {jugador.puntos} pts
            </p>
          </div>
        ))}
      </div>
      <h2 className="text-4xl font-bold mt-12 mb-6">
  🏍️ Constructores Fantasy
</h2>

<div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">
  {motoresOrdenados.map(
    (motor, index) => (
      <div
        key={motor.marca}
        className="flex justify-between py-3 border-b border-zinc-700"
      >
        <div>
          <p className="text-xl font-bold">
            {index === 0
  ? "🥇"
  : index === 1
  ? "🥈"
  : index === 2
  ? "🥉"
  : `${index + 1}.`} {motor.marca}
          </p>

          <p className="text-zinc-400">
            Suma GP: {motor.totalGP}
          </p>
        </div>

        <p className="text-2xl font-extrabold text-red-500">
          {
            puntosMotorFantasy[
              index as keyof typeof puntosMotorFantasy
            ]
          } pts
        </p>
      </div>
    )
  )}
</div>
    </main>
  );
}
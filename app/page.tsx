"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { jugadores } from "@/data/jugadores";
import { pilotos } from "@/data/pilotos";
import { circuitos } from "@/data/circuitos";
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

  const puntosEquipo =
  jugadores.find(
    (jugador) =>
      jugador.nombre ===
      jugadorActual
  )?.puntos || 0;
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
  const clasificacion = [...jugadores];
clasificacion.sort(
  (a, b) => b.puntos - a.puntos
);
  const posicion =
    clasificacion.findIndex(
      (jugador) =>
        jugador.nombre === jugadorActual
    ) + 1;
const hoy = new Date()
  .toISOString()
  .split("T")[0];

const proximoCircuito =
  circuitos.find(
    (circuito) =>
      circuito.fechaInicio >= hoy
  );
  return (
    <main className="relative overflow-hidden min-h-screen bg-gradient-to-br from-black via-zinc-950 to-red-950 text-white p-8">
      <div className="absolute top-32 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
  <img
  src="/trofeo.png"
  alt="Trofeo MotoGP"
  className="
w-full
h-full
object-center
object-cover
scale-[1.2]
md:scale-100
md:object-cover
"
/>

</div>
      <Navbar />

      <div className="mb-12">
  <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
    MotoGP Fantasy
  </h1>

  <p className="text-zinc-400 text-xl mt-3">
    Campeonato Fantasy 2026
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

{proximoCircuito && (
  <>
    <img
      src={proximoCircuito.imagen}
      alt={proximoCircuito.nombre}
      className="w-40 mx-auto mb-4 opacity-90"
    />

    <p className="text-3xl font-bold text-center text-white">
      {proximoCircuito.nombre}
    </p>

    <p className="mt-2 text-zinc-300 text-center">
      {proximoCircuito.pais}
    </p>

    <p className="mt-1 text-zinc-400 text-center">
      {proximoCircuito.fechaInicio}
    </p>
  </>
)}
        </div>
      </div>

      

 <div className="grid md:grid-cols-2 gap-6 mb-10">

  <div className="bg-red-900/40 border border-red-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">

    <h2 className="text-2xl font-bold mb-4">
      🏁 Último Ganador
    </h2>

    <div className="flex items-center gap-4">

      <img
        src="/pilotos/fabio digiannantonio.webp"
        alt="Di Giannantonio"
        className="w-20 h-20 object-cover rounded-2xl border border-red-500"
      />

      <div>
        <p className="text-3xl font-bold">
          Di Giannantonio
        </p>

        <p className="mt-2 text-zinc-300">
          GP de Cataluña
        </p>
      </div>

    </div>

  </div>

  <div className="bg-orange-900/40 border border-orange-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">

    <h2 className="text-2xl font-bold mb-4">
      🏍️ Motor Ganador
    </h2>

    <div className="flex items-center gap-4">

      <img
        src="/marcas/ducati.png"
        alt="Ducati"
        className="w-20 h-20 object-contain"
      />

      <div>
        <p className="text-3xl font-bold">
          Ducati
        </p>

        <p className="mt-2 text-zinc-300">
          Mejor constructor del GP
        </p>
      </div>

    </div>

  </div>

  <div className="bg-blue-900/40 border border-blue-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">

    <h2 className="text-2xl font-bold mb-4">
      🔥 Piloto en Forma
    </h2>

    <div className="flex items-center gap-4">

      <img
        src="/pilotos/marco bezzecchi.webp"
        alt="Bezzecchi"
        className="w-20 h-20 object-cover rounded-2xl border border-blue-500"
      />

      <div>
        <p className="text-3xl font-bold">
          Marco Bezzecchi
        </p>

        <p className="mt-2 text-zinc-300">
          Líder del mundial y fantasy
        </p>
      </div>

    </div>

  </div>

  <div className="bg-yellow-900/40 border border-yellow-500 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300">

    <h2 className="text-2xl font-bold mb-4">
      🔥 Motor en Forma
    </h2>

    <div className="flex items-center gap-4">

      <img
        src="/marcas/aprilia.png"
        alt="Aprilia"
        className="w-20 h-20 object-contain"
      />

      <div>
        <p className="text-3xl font-bold">
          Aprilia
        </p>

        <p className="mt-2 text-zinc-300">
          Líder fantasy actual
        </p>
      </div>

    </div>

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
          : `${index + 1}.`}{" "}
        {jugador.nombre}
      </p>

      <p className="text-xl font-bold">
        {jugador.puntos} pts
      </p>
    </div>
  ))}
</div>

    </main>
  );
}
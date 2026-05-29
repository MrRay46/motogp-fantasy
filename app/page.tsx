"use client";

import { useEffect, useState } from "react";
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
const [avatar, setAvatar] =
  useState("avatar1.png");

useEffect(() => {
  const avatarGuardado =
    localStorage.getItem(
      "avatarSeleccionado"
    );

  if (avatarGuardado) {
    setAvatar(avatarGuardado);
  }
}, []);
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

  const clasificacion = [
    ...jugadores,
  ];

  clasificacion.sort(
    (a, b) =>
      b.puntos - a.puntos
  );

  const posicion =
    clasificacion.findIndex(
      (jugador) =>
        jugador.nombre ===
        jugadorActual
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

      {/* Fondo Copa */}
      <div className="absolute top-32 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">

        <img
          src="/trofeo.png"
          alt="Trofeo MotoGP"
          className="
            w-full
            h-full
            object-cover
            object-center
            scale-[1.45]
            md:scale-100
          "
        />

      </div>

      <Navbar />

      {/* Header */}
      <div className="mb-12 relative z-10">

        <h1 className="text-7xl font-black tracking-tight bg-gradient-to-r from-red-500 via-orange-400 to-red-600 bg-clip-text text-transparent drop-shadow-lg">
          MotoGP Fantasy
        </h1>

        <p className="text-zinc-400 text-xl mt-3">
          Campeonato Fantasy 2026
        </p>

      </div>

      {/* Usuario */}
      <div className="mb-8 relative z-10">

        <div className="flex items-center gap-4 mb-6">
  <img
    src={`/avatars/${avatar}`}
    alt="Avatar"
    className="
      w-16
      h-16
      rounded-full
      object-contain
      border-2
      border-red-500
      bg-black/30
      p-1
    "
  />

  <h2 className="text-3xl font-bold">
    {jugadorActual}
  </h2>
</div>

      </div>

      {/* TOP CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mb-10 relative z-10">

        {/* Rendimiento */}
        <div className="bg-black/20 border border-zinc-700/40 shadow-2xl shadow-black/40 p-8 rounded-3xl hover:scale-[1.02] transition-all duration-300">

          <h2 className="text-2xl font-bold mb-8">
            📊 Tu Rendimiento
          </h2>

          <div className="flex justify-between items-center">

            <div className="text-center">

              <p className="text-lg text-zinc-400 mb-2">
                Posición
              </p>

              <p className="text-6xl font-extrabold text-red-500">
                #{posicion}
              </p>

            </div>

            <div className="w-px h-28 bg-zinc-700/40"></div>

            <div className="text-center">

              <p className="text-lg text-zinc-400 mb-2">
                Puntos
              </p>

              <p className="text-6xl font-extrabold text-green-400">
                {puntosEquipo}
              </p>

            </div>

          </div>

        </div>

        {/* Equipo del GP */}
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/40 shadow-2xl shadow-yellow-500/10 p-8 rounded-3xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-center">

          <p className="text-yellow-300 text-lg font-semibold mb-3">
            ⭐ Equipo del GP
          </p>

          <h2 className="text-5xl font-black mb-3">
            De la Raya Sr
          </h2>

          <p className="text-3xl text-yellow-100 font-bold">
            73 pts
          </p>

          <p className="mt-4 text-zinc-300">
            Mejor puntuación del GP de Cataluña
          </p>

        </div>

        {/* Próximo GP */}
        <div className="bg-black/20 border border-zinc-700/40 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 flex flex-col justify-between">

          <div>

            <h2 className="text-2xl font-bold mb-6">
              🏁 Próximo GP
            </h2>

            {proximoCircuito && (
              <>

                <img
                  src={proximoCircuito.imagen}
                  alt={proximoCircuito.nombre}
                  className="w-44 mx-auto mb-6 opacity-90"
                />

                <p className="text-4xl font-bold text-center text-white">
                  {proximoCircuito.nombre}
                </p>

                <p className="mt-2 text-zinc-300 text-center text-lg">
                  {proximoCircuito.pais}
                </p>

                <p className="mt-2 text-zinc-400 text-center">
                  {proximoCircuito.fechaInicio}
                </p>

              </>
            )}

          </div>

        </div>

      </div>

      {/* Cards inferiores */}
      <div className="grid md:grid-cols-2 gap-6 mb-10 relative z-10">

        {/* Último ganador */}
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

        {/* Motor ganador */}
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

        {/* Piloto en forma */}
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

        {/* Motor en forma */}
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

      {/* Clasificación */}
      <h2 className="text-4xl font-bold mb-6 relative z-10">
        Clasificación General
      </h2>

      <div className="bg-black/20 border border-zinc-700/40 shadow-2xl shadow-black/40 p-6 rounded-3xl hover:scale-[1.02] transition-all duration-300 relative z-10">

        {clasificacion.map(
          (jugador, index) => (

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

          )
        )}

      </div>

    </main>

  );

}
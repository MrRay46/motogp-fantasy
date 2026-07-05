"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SplashScreen from "@/components/SplashScreen";

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  const [mostrarSplash, setMostrarSplash] =
    useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {

      setMostrarSplash(false);

    }, 1800);

    return () => clearTimeout(timer);

  }, []);

  return (

    <>

      {mostrarSplash && <SplashScreen />}

      <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

        <Image
          src="/images/rayongrid-logo.png"
          alt="Rayongrid"
          width={320}
          height={320}
          priority
        />

        <h1 className="text-5xl font-black mt-6">
          RAYONGRID
        </h1>

        <p className="text-zinc-400 text-center text-lg mt-4 max-w-xl">
          Tu equipo. Tus decisiones. Tu campeonato.
        </p>

        <div className="flex flex-col gap-4 w-full max-w-sm mt-12">

          <button
            onClick={() => window.location.href = "/login"}
            className="
              bg-orange-500
              hover:bg-orange-400
              transition
              p-4
              rounded-2xl
              font-bold
              text-lg
            "
          >
            Iniciar sesión
          </button>

          <button
            onClick={() => window.location.href = "/registro"}
            className="
              border
              border-zinc-700
              hover:border-orange-500
              hover:bg-zinc-900
              transition
              p-4
              rounded-2xl
              font-bold
              text-lg
            "
          >
            Crear una cuenta
          </button>

        </div>

        <div className="mt-16 max-w-4xl grid md:grid-cols-3 gap-6">

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

            <h2 className="text-2xl mb-3">🏆</h2>

            <h3 className="font-bold text-xl mb-2">
              Compite
            </h3>

            <p className="text-zinc-400">
              Crea ligas privadas y demuestra quién es el mejor manager.
            </p>

          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

            <h2 className="text-2xl mb-3">📊</h2>

            <h3 className="font-bold text-xl mb-2">
              Gestiona
            </h3>

            <p className="text-zinc-400">
              Elige pilotos, controla tu presupuesto y toma las mejores decisiones.
            </p>

          </div>

          <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

            <h2 className="text-2xl mb-3">🏁</h2>

            <h3 className="font-bold text-xl mb-2">
              Vive MotoGP
            </h3>

            <p className="text-zinc-400">
              Sigue toda la temporada y lucha por el campeonato con tus amigos.
            </p>

          </div>

        </div>

        <p className="mt-16 text-zinc-600 text-sm">
          v0.9 Alpha
        </p>

      </main>

    </>

  );

}
"use client";

import { useState } from "react";

import CreateLeagueForm from "@/components/auth/CreateLeagueForm";
import JoinLeagueForm from "@/components/auth/JoinLeagueForm";

export default function BienvenidaPage() {

  const [modo, setModo] =
    useState<"crear" | "unirse" | null>(null);

  return (

    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-lg">

        {modo === null && (

          <>

            <h1 className="text-4xl font-black text-center mb-4">
              Bienvenido a RayonGrid
            </h1>

            <p className="text-zinc-400 text-center mb-10">
              Tu cuenta ya está creada.
              <br />
              Ahora elige cómo quieres empezar.
            </p>

            <div className="space-y-6">

              <button
                onClick={() => setModo("crear")}
                className="
                  w-full
                  bg-yellow-500
                  hover:bg-yellow-400
                  text-black
                  font-bold
                  py-5
                  rounded-2xl
                  text-xl
                "
              >
                🏆 Crear una liga
              </button>

              <button
                onClick={() => setModo("unirse")}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-500
                  text-white
                  font-bold
                  py-5
                  rounded-2xl
                  text-xl
                "
              >
                🤝 Unirme a una liga
              </button>

            </div>

          </>

        )}

        {modo === "crear" && (

          <>

            <CreateLeagueForm />

            <button
              onClick={() => setModo(null)}
              className="
                w-full
                mt-6
                bg-zinc-700
                hover:bg-zinc-600
                rounded-xl
                py-3
              "
            >
              ← Volver
            </button>

          </>

        )}

        {modo === "unirse" && (

          <>

            <JoinLeagueForm />

            <button
              onClick={() => setModo(null)}
              className="
                w-full
                mt-6
                bg-zinc-700
                hover:bg-zinc-600
                rounded-xl
                py-3
              "
            >
              ← Volver
            </button>

          </>

        )}

      </div>

    </main>

  );

}
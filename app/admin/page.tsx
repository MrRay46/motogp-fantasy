"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";

export default function AdminPage() {

  const [linkInvitacion, setLinkInvitacion] =
    useState("");

  const generarInvitacion = async () => {

    const token =
      Math.random()
        .toString(36)
        .substring(2, 12)
        .toUpperCase();

    const { error } =
      await supabase
        .from("invitaciones")
        .insert([
          {
            token,
            usado: false,
          },
        ]);

    if (error) {
      console.error(error);
      return;
    }

    const link =
      `${window.location.origin}/registro?token=${token}`;

    setLinkInvitacion(link);

  };

  const copiarLink = async () => {

    await navigator.clipboard.writeText(
      linkInvitacion
    );

    alert(
      "Enlace copiado al portapapeles"
    );

  };

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <Navbar />

      <h1 className="text-5xl font-bold text-yellow-500 mb-10">
        ⚙️ Panel de Administración
      </h1>

      <div className="grid gap-6 max-w-3xl">

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            ➕ Añadir participante
          </h2>

          <button
            onClick={generarInvitacion}
            className="
              bg-green-600
              hover:bg-green-500
              px-5
              py-3
              rounded-xl
              font-bold
              mb-4
            "
          >
            Generar invitación
          </button>

          {linkInvitacion && (

            <div className="space-y-3">

              <p className="text-green-400 break-all">
                {linkInvitacion}
              </p>

              <button
                onClick={copiarLink}
                className="
                  bg-blue-600
                  hover:bg-blue-500
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Copiar enlace
              </button>

            </div>

          )}

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            🚫 Expulsar participante
          </h2>

          <p className="text-zinc-400">
            Próximamente.
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            🏆 Bonus de temporada
          </h2>

          <p className="text-zinc-400">
            Aplicar bonus finales.
          </p>

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            ⚠️ Resolver incidencias
          </h2>

          <p className="text-zinc-400">
            Herramientas administrativas.
          </p>

        </div>

      </div>

    </main>

  );

}
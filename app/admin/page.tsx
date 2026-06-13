"use client";

import Navbar from "@/components/Navbar";

export default function AdminPage() {

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

          <p className="text-zinc-400">
            Próximamente.
          </p>

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
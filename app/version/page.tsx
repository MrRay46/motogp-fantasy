"use client";

import Navbar from "@/components/Navbar";

export default function VersionPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold text-red-500 mb-4">
          Versión RayonGrid
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Información sobre la versión actual de la aplicación y sus datos
          generales.
        </p>

        <div className="space-y-8">

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Versión
            </h2>

            <p className="text-zinc-300">
              1.0.0
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Última actualización
            </h2>

            <p className="text-zinc-300">
              Julio de 2026
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Desarrollado por
            </h2>

            <p className="text-zinc-300">
              Equipo RayonGrid
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2">
              Derechos
            </h2>

            <p className="text-zinc-300">
              © 2026 RayonGrid. Todos los derechos reservados.
            </p>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-zinc-800">
          <p className="text-zinc-400 italic">
            Gracias por confiar en RayonGrid.
          </p>
        </div>

      </div>
    </main>
  );
}
"use client";

export default function BienvenidaPage() {

  return (

    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div className="max-w-xl w-full">

        <h1 className="text-5xl font-black text-center mb-4">
          Bienvenido a RayonGrid
        </h1>

        <p className="text-zinc-400 text-center mb-12">
          Tu cuenta ya está creada.
          <br />
          Ahora elige cómo quieres empezar.
        </p>

        <div className="space-y-6">

          <button
            onClick={() => window.location.href="/crear-liga"}
            className="
              w-full
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              rounded-2xl
              py-5
              text-xl
              font-bold
            "
          >
            🏆 Crear una liga
          </button>

          <button
            onClick={() => window.location.href="/unirse-liga"}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-500
              rounded-2xl
              py-5
              text-xl
              font-bold
            "
          >
            🤝 Unirme mediante invitación
          </button>

        </div>

      </div>

    </main>

  );

}
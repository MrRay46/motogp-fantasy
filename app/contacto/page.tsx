"use client";

import Navbar from "@/components/Navbar";

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold text-red-500 mb-4">
          Contacto
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-10">
          Si tienes cualquier duda, sugerencia o has encontrado algún problema
          en <strong>RayonGrid</strong>, puedes ponerte en contacto con nosotros
          a través del siguiente correo electrónico.
        </p>

        <div className="bg-zinc-900 border border-zinc-700/40 rounded-2xl p-8 text-center mb-10">
          <a
            href="mailto:rayongrid.app@gmail.com"
            className="text-2xl md:text-3xl font-bold text-orange-400 hover:text-orange-300 transition-colors"
          >
            rayongrid.app@gmail.com
          </a>
        </div>

        <p className="text-zinc-300 leading-7">
          Intentaremos responder a tu consulta lo antes posible.
        </p>

        <p className="text-zinc-300 leading-7 mt-6">
          Si tu mensaje está relacionado con una liga o con un error de la
          aplicación, incluye toda la información que consideres relevante para
          que podamos ayudarte de la forma más rápida posible.
        </p>

        <p className="text-zinc-300 mt-10">
          <strong>Un saludo,</strong>
          <br />
          El equipo de RayonGrid
        </p>

      </div>
    </main>
  );
}
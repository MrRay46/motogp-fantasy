"use client";

import { useEffect, useState } from "react";

export default function Navbar() {

  const [usuario, setUsuario] =
    useState("");

  useEffect(() => {

    const usuarioLogueado =
      localStorage.getItem(
        "usuarioLogueado"
      );

    if (usuarioLogueado) {
      setUsuario(
        usuarioLogueado
      );
    }

  }, []);

  const cerrarSesion = () => {

    localStorage.removeItem(
      "usuarioLogueado"
    );

    window.location.href =
      "/login";

  };

  return (

    <nav className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-4 flex flex-wrap gap-4 justify-center items-center mb-10 text-base md:text-xl font-semibold">

      <a
        href="/"
        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition"
      >
        Inicio
      </a>

      <a
        href="/equipo"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Mi Equipo
      </a>

      <a
        href="/mercado"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Mercado
      </a>

      <a
        href="/clasificacion"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Clasificaciones
      </a>

      <a
        href="/reglas"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Reglas
      </a>

      <a
        href="/perfil"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Perfil
      </a>

      <div className="flex items-center gap-3 ml-2">

        <span className="text-zinc-300 text-sm md:text-base">
          {usuario}
        </span>

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl text-white transition"
        >
          Salir
        </button>

      </div>

    </nav>

  );

}
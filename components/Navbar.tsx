"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const [esAdmin, setEsAdmin] = useState(false);

  useEffect(() => {
    async function comprobarAdmin() {
      const usuario = localStorage.getItem("usuarioLogueado");

      if (!usuario) return;

      // Buscar el usuario
      const {
        data: usuarioDB,
        error: errorUsuario,
      } = await supabase
        .from("usuarios")
        .select("id, liga_actual_id")
        .eq("usuario", usuario)
        .single();

      if (errorUsuario || !usuarioDB) {
        console.error(errorUsuario);
        return;
      }

      if (!usuarioDB.liga_actual_id) {
        setEsAdmin(false);
        return;
      }

      // Buscar la relación usuario-liga
      const {
        data: relacion,
        error: errorRelacion,
      } = await supabase
        .from("usuarios_ligas")
        .select("admin_liga")
        .eq("usuario_id", usuarioDB.id)
        .eq("liga_id", usuarioDB.liga_actual_id)
        .single();

      if (errorRelacion) {
        console.error(errorRelacion);
        return;
      }

      setEsAdmin(relacion?.admin_liga ?? false);
    }

    comprobarAdmin();
  }, []);

  function cerrarSesion() {
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "/";
  }

  return (
    <nav className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-4 flex flex-wrap gap-4 justify-center items-center mb-10 text-base md:text-xl font-semibold">

      <a
        href="/dashboard"
        className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-400 transition"
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

      {esAdmin && (
        <a
          href="/admin"
          className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl transition"
        >
          ⚙️ Admin
        </a>
      )}

      <button
        onClick={cerrarSesion}
        className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition"
      >
        Salir
      </button>

    </nav>
  );
}
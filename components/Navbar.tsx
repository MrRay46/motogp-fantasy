"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu } from "lucide-react";
import SideMenu from "./SideMenu";

export default function Navbar() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    async function comprobarAdmin() {
      const sesion = JSON.parse(localStorage.getItem("usuario") || "{}");

      if (!sesion.id) return;

      if (!sesion.liga_actual_id) {
        setEsAdmin(false);
        return;
      }

      const { data: relacion, error: errorRelacion } = await supabase
        .from("usuarios_ligas")
        .select("admin_liga")
        .eq("usuario_id", sesion.id)
        .eq("liga_id", sesion.liga_actual_id)
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
    localStorage.removeItem("usuario");
    window.location.href = "/";
  }

  return (
    <>
      <nav className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-4 flex flex-wrap gap-4 justify-center items-center mb-10 text-base md:text-xl font-semibold">

        <button
          onClick={() => setMenuAbierto(true)}
          className="bg-zinc-800 text-white p-3 rounded-xl hover:bg-zinc-700 transition"
        >
          <Menu size={22} />
        </button>

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
          Equipo
        </a>

        <a
          href="/mercado"
          className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
        >
          Mercado
        </a>

        <a
          href="/liga"
          className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
        >
          Liga
        </a>

        {esAdmin && (
          <a
            href="/admin"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl transition"
          >
            Administración
          </a>
        )}

        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition"
        >
          Salir
        </button>
      </nav>

      <SideMenu
        abierto={menuAbierto}
        onClose={() => setMenuAbierto(false)}
      />
    </>
  );
}
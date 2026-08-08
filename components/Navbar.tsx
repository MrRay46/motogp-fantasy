"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu } from "lucide-react";
import SideMenu from "./SideMenu";
import { esSuperAdmin } from "@/lib/auth/esSuperAdmin";

export default function Navbar() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [esSuper, setEsSuper] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    async function comprobarPermisos() {
      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.id) {
        return;
      }

      // -----------------------------------------
      // SUPERADMIN
      // -----------------------------------------
      // Es independiente de la liga actual.
      setEsSuper(esSuperAdmin());

      // -----------------------------------------
      // ADMINISTRADOR DE LIGA
      // -----------------------------------------
      if (!sesion.liga_actual_id) {
        setEsAdmin(false);
        return;
      }

      const {
        data: relacion,
        error: errorRelacion,
      } = await supabase
        .from("usuarios_ligas")
        .select("admin_liga")
        .eq("usuario_id", sesion.id)
        .eq("liga_id", sesion.liga_actual_id)
        .single();

      if (errorRelacion) {
        console.error(
          "Error comprobando administrador de liga:",
          errorRelacion
        );

        setEsAdmin(false);
        return;
      }

      setEsAdmin(
        relacion?.admin_liga ?? false
      );
    }

    comprobarPermisos();
  }, []);

  function cerrarSesion() {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  }

  return (
    <>
      <nav className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-4 flex flex-wrap gap-4 justify-center items-center mb-10 text-base md:text-xl font-semibold">

        {/* MENÚ */}
        <button
          onClick={() =>
            setMenuAbierto(true)
          }
          className="bg-zinc-800 text-white p-3 rounded-xl hover:bg-zinc-700 transition"
        >
          <Menu size={22} />
        </button>

        {/* INICIO */}
        <a
          href="/dashboard"
          className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-400 transition"
        >
          Inicio
        </a>

        {/* EQUIPO */}
        <a
          href="/equipo"
          className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
        >
          Equipo
        </a>

        {/* MERCADO */}
        <a
          href="/mercado"
          className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
        >
          Mercado
        </a>

        {/* LIGA */}
        <a
          href="/liga"
          className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
        >
          Liga
        </a>

        {/* ADMINISTRACIÓN DE LIGA */}
        {esAdmin && (
          <a
            href="/admin"
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-4 py-2 rounded-xl transition"
          >
            Administración
          </a>
        )}

        {/* SUPERADMIN */}
        {esSuper && (
          <a
            href="/superadmin"
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            SuperAdmin
          </a>
        )}

        {/* SALIR */}
        <button
          onClick={cerrarSesion}
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-xl transition"
        >
          Salir
        </button>
      </nav>

      <SideMenu
        abierto={menuAbierto}
        onClose={() =>
          setMenuAbierto(false)
        }
      />
    </>
  );
}
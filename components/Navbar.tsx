"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Menu } from "lucide-react";
import SideMenu from "./SideMenu";

export default function Navbar() {
  const [esAdmin, setEsAdmin] = useState(false);
  const [esSuper, setEsSuper] = useState(false);
  const [tieneLiga, setTieneLiga] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    async function cargarContexto() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          setTieneLiga(false);
          setEsAdmin(false);
          setEsSuper(false);
          return;
        }

        const respuesta = await fetch("/api/usuario/contexto", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const resultado = await respuesta.json().catch(() => null);

        if (!respuesta.ok) {
          setTieneLiga(false);
          setEsAdmin(false);
          setEsSuper(false);
          return;
        }

        setTieneLiga(Boolean(resultado.ligaActual));
        setEsAdmin(Boolean(resultado.ligaActual?.admin_liga));
        setEsSuper(resultado.usuario?.super_admin === true);
      } catch (error) {
        console.error("Error obteniendo el contexto del menú:", error);
        setTieneLiga(false);
        setEsAdmin(false);
        setEsSuper(false);
      }
    }

    void cargarContexto();
  }, []);

  async function cerrarSesion() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Error cerrando sesión:", error);
      alert("No se pudo cerrar la sesión correctamente.");
      return;
    }

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

        {tieneLiga && (
          <a
            href="/equipo"
            className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
          >
            Equipo
          </a>
        )}

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

        {esSuper && (
          <a
            href="/superadmin"
            className="bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-xl transition"
          >
            SuperAdmin
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
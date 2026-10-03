"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import UserCard from "./sidemenu/UserCard";
import LeagueCard from "./sidemenu/LeagueCard";
import HelpCard from "./sidemenu/HelpCard";

type SideMenuProps = {
  abierto: boolean;
  onClose: () => void;
};

export default function SideMenu({
  abierto,
  onClose,
}: SideMenuProps) {
  const [esAdmin, setEsAdmin] = useState(false);
  const [esSuper, setEsSuper] = useState(false);

  useEffect(() => {
    async function cargarContexto() {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
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
          setEsAdmin(false);
          setEsSuper(false);
          return;
        }

        setEsAdmin(Boolean(resultado.ligaActual?.admin_liga));
        setEsSuper(resultado.usuario?.super_admin === true);
      } catch (error) {
        console.error("Error obteniendo permisos del menú:", error);
        setEsAdmin(false);
        setEsSuper(false);
      }
    }

    void cargarContexto();
  }, []);

  return (
    <>
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${
            abierto
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[75%] max-w-[360px]
          bg-zinc-950 border-r border-zinc-800
          transition-transform duration-300
          ${abierto ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-6">
            <UserCard />

            <LeagueCard />

            <a
              href="/ligas"
              onClick={onClose}
              className="
                block
                w-full
                rounded-2xl
                bg-zinc-800
                hover:bg-zinc-700
                border
                border-zinc-700
                hover:border-orange-500
                text-white
                px-5
                py-4
                font-bold
                text-lg
                transition
              "
            >
              🏁 Mis ligas
            </a>

            {esAdmin && (
              <a
                href="/admin"
                onClick={onClose}
                className="
                  block
                  w-full
                  rounded-2xl
                  bg-yellow-600
                  hover:bg-yellow-500
                  text-white
                  px-5
                  py-4
                  font-bold
                  text-lg
                  transition
                "
              >
                ⚙️ Administración
              </a>
            )}

            {esSuper && (
              <a
                href="/superadmin"
                onClick={onClose}
                className="
                  block
                  w-full
                  rounded-2xl
                  bg-red-700
                  hover:bg-red-600
                  text-white
                  px-5
                  py-4
                  font-bold
                  text-lg
                  transition
                "
              >
                🛠️ SuperAdmin
              </a>
            )}

            <HelpCard />
          </div>
        </div>
      </aside>
    </>
  );
}
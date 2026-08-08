"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import UserCard from "./sidemenu/UserCard";
import LeagueCard from "./sidemenu/LeagueCard";
import HelpCard from "./sidemenu/HelpCard";

import { esSuperAdmin } from "@/lib/auth/esSuperAdmin";

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

      setEsSuper(esSuperAdmin());

      // -----------------------------------------
      // ADMINISTRADOR DE LA LIGA ACTUAL
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
        .eq(
          "liga_id",
          sesion.liga_actual_id
        )
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

  return (
    <>
      {/* Overlay */}
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

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[75%] max-w-[360px]
          bg-zinc-950 border-r border-zinc-800
          transition-transform duration-300
          ${
            abierto
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-6">

            <UserCard />

            <LeagueCard />

            {/* -------------------------------- */}
            {/* ADMINISTRACIÓN DE LIGA */}
            {/* -------------------------------- */}

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

            {/* -------------------------------- */}
            {/* SUPERADMIN */}
            {/* -------------------------------- */}

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
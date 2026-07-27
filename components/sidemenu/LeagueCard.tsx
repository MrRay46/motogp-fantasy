"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Flag } from "lucide-react";

type LigaInfo = {
  nombre: string;
  admin: boolean;
};

export default function LeagueCard() {
  const [liga, setLiga] = useState<LigaInfo | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarLiga() {
      try {
        const sesion = JSON.parse(localStorage.getItem("usuario") || "{}");

        if (!sesion.id) {
          setCargando(false);
          return;
        }

        // Obtener liga activa
        const { data: usuario, error: errorUsuario } = await supabase
          .from("usuarios")
          .select("liga_actual_id")
          .eq("id", sesion.id)
          .single();

        if (errorUsuario || !usuario?.liga_actual_id) {
          setCargando(false);
          return;
        }

        // Ejecutar ambas consultas en paralelo
        const [ligaRes, relacionRes] = await Promise.all([
          supabase
            .from("ligas")
            .select("nombre")
            .eq("id", usuario.liga_actual_id)
            .single(),

          supabase
            .from("usuarios_ligas")
            .select("admin_liga")
            .eq("usuario_id", sesion.id)
            .eq("liga_id", usuario.liga_actual_id)
            .single(),
        ]);

        if (ligaRes.error || relacionRes.error) {
          console.error(ligaRes.error || relacionRes.error);
          setCargando(false);
          return;
        }

        setLiga({
          nombre: ligaRes.data.nombre,
          admin: relacionRes.data.admin_liga,
        });
      } finally {
        setCargando(false);
      }
    }

    cargarLiga();
  }, []);

  if (cargando) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5 animate-pulse">
        <div className="h-5 w-24 bg-zinc-700 rounded mb-4" />
        <div className="h-6 w-40 bg-zinc-700 rounded" />
      </div>
    );
  }

  if (!liga) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-5 text-center text-zinc-400">
        No hay liga activa
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-5 shadow-lg">

      <p className="text-sm text-zinc-500 mb-4">
        Liga activa
      </p>

      <div className="flex items-center gap-3 mb-4">

        <Flag className="text-orange-500" size={20} />

        <span className="font-semibold text-lg">
          {liga.nombre}
        </span>

      </div>

      <span
        className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
          liga.admin
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-blue-500/20 text-blue-400"
        }`}
      >
        {liga.admin ? "Administrador" : "Jugador"}
      </span>

    </div>
  );
}
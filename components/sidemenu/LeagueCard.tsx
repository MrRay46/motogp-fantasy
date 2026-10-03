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
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session?.access_token) {
          return;
        }

        const respuesta = await fetch("/api/usuario/contexto", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        const resultado = await respuesta.json().catch(() => null);

        if (!respuesta.ok || !resultado?.ligaActual) {
          return;
        }

        setLiga({
          nombre: resultado.ligaActual.nombre,
          admin: resultado.ligaActual.admin_liga,
        });
      } catch (error) {
        console.error("Error cargando la liga activa:", error);
      } finally {
        setCargando(false);
      }
    }

    void cargarLiga();
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
      <p className="text-sm text-zinc-500 mb-4">Liga activa</p>

      <div className="flex items-center gap-3 mb-4">
        <Flag className="text-orange-500" size={20} />
        <span className="font-semibold text-lg">{liga.nombre}</span>
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
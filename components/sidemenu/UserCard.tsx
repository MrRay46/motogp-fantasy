"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Usuario = {
  usuario: string;
  avatar: string;
};

export default function UserCard() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function cargarUsuario() {
      try {
        const sesion = JSON.parse(localStorage.getItem("usuario") || "{}");

        if (!sesion.id) {
          setCargando(false);
          return;
        }

        const { data, error } = await supabase
          .from("usuarios")
          .select("usuario, avatar")
          .eq("id", sesion.id)
          .single();

        if (error) {
          console.error(error);
          setCargando(false);
          return;
        }

        setUsuario(data);
      } finally {
        setCargando(false);
      }
    }

    cargarUsuario();
  }, []);

  if (cargando) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-6 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-zinc-700 mx-auto mb-4" />
        <div className="h-5 w-32 bg-zinc-700 rounded mx-auto" />
      </div>
    );
  }

  if (!usuario) {
    return (
      <div className="bg-zinc-900 rounded-2xl p-6 text-center text-zinc-400">
        Usuario no encontrado
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">

      <div className="flex justify-center mb-5">
        <img
          src={`/avatars/${usuario.avatar}`}
          alt={usuario.usuario}
          className="w-24 h-24 rounded-full object-cover border-4 border-orange-500"
        />
      </div>

      <h2 className="text-center text-xl font-bold text-white">
        {usuario.usuario}
      </h2>

    </div>
  );
}
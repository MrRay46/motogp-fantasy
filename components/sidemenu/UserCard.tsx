"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarSelectorModal from "@/components/modals/AvatarSelectorModal";

type Usuario = {
  usuario: string;
  avatar: string;
};

export default function UserCard() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

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
          return;
        }

        setUsuario(data);
      } finally {
        setCargando(false);
      }
    }

    cargarUsuario();
  }, []);

  async function guardarAvatar(nuevoAvatar: string) {
    if (!usuario) return;

    setGuardando(true);

    try {
      const sesion = JSON.parse(localStorage.getItem("usuario") || "{}");

      const { error } = await supabase
        .from("usuarios")
        .update({
          avatar: nuevoAvatar,
        })
        .eq("id", sesion.id);

      if (error) {
        console.error(error);
        return;
      }

      setUsuario({
        ...usuario,
        avatar: nuevoAvatar,
      });

      setModalAbierto(false);
    } finally {
      setGuardando(false);
    }
  }

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
    <>
      <div className="bg-zinc-900 rounded-2xl p-6 shadow-lg">
        <div className="flex justify-center mb-5">
          <button
            onClick={() => setModalAbierto(true)}
            className="group"
          >
            <img
              src={`/avatars/${usuario.avatar}`}
              alt={usuario.usuario}
              className="w-24 h-24 rounded-full object-cover border-4 border-orange-500 transition-transform duration-200 group-hover:scale-105"
            />
          </button>
        </div>

        <h2 className="text-center text-xl font-bold text-white">
          {usuario.usuario}
        </h2>

        <p className="text-center text-sm text-zinc-500 mt-2">
          Pulsa el avatar para cambiarlo
        </p>
      </div>

      <AvatarSelectorModal
    open={modalAbierto}
    avatarActual={usuario.avatar}
    saving={guardando}
    onClose={() => setModalAbierto(false)}
    onSave={guardarAvatar}
/>
    </>
  );
}
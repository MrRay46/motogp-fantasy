"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarSelectorModal from "@/components/modals/AvatarSelectorModal";

type Usuario = {
  id: number;
  usuario: string;
  avatar: string;
  email: string;
  liga_actual_id: number | null;
  super_admin: boolean;
};

export default function UserCard() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    async function cargarUsuario() {
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

        if (!respuesta.ok || !resultado?.usuario) {
          console.error(
            "Error cargando usuario:",
            resultado?.error ?? respuesta.statusText
          );
          return;
        }

        setUsuario(resultado.usuario);
      } catch (error) {
        console.error("Error cargando usuario:", error);
      } finally {
        setCargando(false);
      }
    }

    void cargarUsuario();
  }, []);

  async function guardarAvatar(nuevoAvatar: string) {
    if (!usuario || guardando) return;

    setGuardando(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        console.error("No hay una sesión autenticada.", sessionError);
        return;
      }

      const respuesta = await fetch("/api/perfil/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ avatar: nuevoAvatar }),
      });

      const resultado = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        console.error(
          "Error guardando avatar:",
          resultado?.error ?? respuesta.statusText
        );
        return;
      }

      const usuarioActualizado = {
        ...usuario,
        avatar: resultado.avatar ?? nuevoAvatar,
      };

      setUsuario(usuarioActualizado);
      setModalAbierto(false);

      try {
        const sesionLocal = JSON.parse(
          localStorage.getItem("usuario") || "{}"
        );

        localStorage.setItem(
          "usuario",
          JSON.stringify({
            ...sesionLocal,
            avatar: usuarioActualizado.avatar,
          })
        );
      } catch (error) {
        console.error(
          "Error actualizando el avatar local:",
          error
        );
      }
    } catch (error) {
      console.error("Error guardando avatar:", error);
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
            disabled={guardando}
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
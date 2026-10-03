"use client";

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";

const avatars = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
  "avatar11.png",
  "avatar12.png",
  "avatar13.png",
];

export default function PerfilPage() {
  const [avatarSeleccionado, setAvatarSeleccionado] =
    useState("avatar1.png");

  const [jugadorActual, setJugadorActual] =
    useState("");

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  useEffect(() => {
    try {
      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (typeof sesion.usuario === "string") {
        setJugadorActual(sesion.usuario);
      }

      if (
        typeof sesion.avatar === "string" &&
        avatars.includes(sesion.avatar)
      ) {
        setAvatarSeleccionado(sesion.avatar);
      }
    } catch (error) {
      console.error("Error leyendo la sesión local:", error);
    }
  }, []);

  async function seleccionarAvatar(avatar: string) {
    if (guardando || !avatars.includes(avatar)) {
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        setMensaje("Tu sesión ha caducado. Inicia sesión de nuevo.");
        return;
      }

      const respuesta = await fetch("/api/perfil/avatar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ avatar }),
      });

      const resultado = await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        setMensaje(
          resultado?.error ?? "No se pudo guardar el avatar."
        );
        return;
      }

      setAvatarSeleccionado(avatar);
      localStorage.setItem("avatarSeleccionado", avatar);

      try {
        const sesionLocal = JSON.parse(
          localStorage.getItem("usuario") || "{}"
        );

        sesionLocal.avatar = avatar;

        localStorage.setItem(
          "usuario",
          JSON.stringify(sesionLocal)
        );
      } catch (error) {
        console.error(
          "Error actualizando el avatar de la sesión local:",
          error
        );
      }

      setMensaje("Avatar guardado correctamente.");
    } catch (error) {
      console.error("Error guardando el avatar:", error);
      setMensaje("No se pudo guardar el avatar. Inténtalo de nuevo.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <AppLayout>
      <h1 className="mb-4 text-5xl font-bold text-red-500">
        Mi Perfil
      </h1>

      {jugadorActual && (
        <p className="mb-2 text-xl text-zinc-300">
          {jugadorActual}
        </p>
      )}

      <p className="mb-8 text-xl text-zinc-400">
        Selecciona tu avatar
      </p>

      {mensaje && (
        <p
          role="status"
          className="mb-6 text-zinc-300"
        >
          {mensaje}
        </p>
      )}

      <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
        {avatars.map((avatar) => (
          <button
            key={avatar}
            type="button"
            onClick={() => seleccionarAvatar(avatar)}
            disabled={guardando}
            aria-pressed={avatarSeleccionado === avatar}
            className={`
              rounded-3xl
              border
              p-4
              transition-all
              duration-300
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                avatarSeleccionado === avatar
                  ? "scale-105 border-red-500 bg-red-500/20 shadow-lg shadow-red-500/40"
                  : "border-zinc-700 bg-black/20 hover:border-red-400"
              }
            `}
          >
            <img
              src={`/avatars/${avatar}`}
              alt={`Avatar ${avatar}`}
              className="mx-auto h-28 w-28 object-contain"
            />
          </button>
        ))}
      </div>
    </AppLayout>
  );
}
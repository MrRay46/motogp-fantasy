"use client";

import { useState, useEffect } from "react";
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

  const [
    avatarSeleccionado,
    setAvatarSeleccionado,
  ] = useState("avatar1.png");

  const [
    jugadorActual,
    setJugadorActual,
  ] = useState("");

  useEffect(() => {

  const sesion = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

if (sesion.usuario) {
  setJugadorActual(sesion.usuario);
}

    if (sesion.avatar) {
  setAvatarSeleccionado(sesion.avatar);
}

  }, []);

  const seleccionarAvatar =
    async (
      avatar: string
    ) => {

      setAvatarSeleccionado(
        avatar
      );

      localStorage.setItem(
        "avatarSeleccionado",
        avatar
      );

const sesion = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

sesion.avatar = avatar;

localStorage.setItem(
  "usuario",
  JSON.stringify(sesion)
);

      if (!jugadorActual)
        return;

      const { error } =
  await supabase
    .from("equipos")
    .update({
      avatar:
        avatar,
    })
    .eq(
      "usuario",
      jugadorActual
    );

     if (error) {
  console.log("ERROR SUPABASE:");
  console.log(error);
}

    };

  return (

    <AppLayout>

      <h1 className="text-5xl font-bold text-red-500 mb-4">
        Mi Perfil
      </h1>

      <p className="text-zinc-400 mb-8 text-xl">
        Selecciona tu avatar
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">

        {avatars.map((avatar) => (

          <button
            key={avatar}
            onClick={() =>
              seleccionarAvatar(
                avatar
              )
            }
            className={`
              p-4
              rounded-3xl
              border
              transition-all
              duration-300
              ${
                avatarSeleccionado === avatar
                  ? "border-red-500 bg-red-500/20 scale-105 shadow-lg shadow-red-500/40"
                  : "border-zinc-700 bg-black/20 hover:border-red-400"
              }
            `}
          >

            <img
              src={`/avatars/${avatar}`}
              alt={avatar}
              className="w-28 h-28 object-contain mx-auto"
            />

          </button>

        ))}

      </div>

    </AppLayout>

  );

}
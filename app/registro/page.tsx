"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RegistroPage() {

  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [avatar, setAvatar] =
    useState("avatar1.png");

const [modo, setModo] =
  useState<
    "crear" | "unirse" | null
  >(null);

  const registrarUsuario =
    async () => {

      const params =
        new URLSearchParams(
          window.location.search
        );

      const token =
        params.get("token");

      if (!token) {

        alert(
          "Invitación no válida"
        );

        return;

      }

      const {
        data: invitacion,
        error: errorInvitacion,
      } = await supabase
        .from("invitaciones")
        .select("*")
        .eq("token", token)
        .single();

      if (
        errorInvitacion ||
        !invitacion
      ) {

        alert(
          "Invitación no encontrada"
        );

        return;

      }

      if (
        invitacion.usado
      ) {

        alert(
          "Esta invitación ya ha sido utilizada"
        );

        return;

      }

      const {
        data: usuarioExistente,
      } = await supabase
        .from("usuarios")
        .select("id")
        .eq(
          "usuario",
          usuario
        )
        .maybeSingle();

      if (
        usuarioExistente
      ) {

        alert(
          "Ese usuario ya existe"
        );

        return;

      }

      const {
        error,
      } = await supabase
        .from("usuarios")
        .insert([
          {
            usuario,
            password,
            avatar,
            admin: false,
            activo: true,
          },
        ]);

      if (error) {

        console.error(error);

        alert(
          "Error creando usuario"
        );

        return;

      }

      await supabase
        .from("invitaciones")
        .update({
          usado: true,
        })
        .eq(
          "token",
          token
        );

      localStorage.setItem(
        "usuarioLogueado",
        usuario
      );

      window.location.href =
        "/";

    };

  return (

  <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-lg">

      <h1 className="text-4xl font-bold mb-8 text-center">
        MotoGP Fantasy
      </h1>

      {modo === null && (

        <div className="space-y-6">

          <button
            onClick={() => setModo("crear")}
            className="
              w-full
              bg-yellow-500
              hover:bg-yellow-400
              text-black
              font-bold
              py-4
              rounded-2xl
              text-xl
            "
          >
            🏆 Crear una liga
          </button>

          <button
            onClick={() => setModo("unirse")}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-500
              text-white
              font-bold
              py-4
              rounded-2xl
              text-xl
            "
          >
            🤝 Unirme a una liga
          </button>

        </div>

      )}

      {modo === "crear" && (

        <div className="space-y-6 text-center">

          <h2 className="text-2xl font-bold">
            Crear una liga
          </h2>

          <p className="text-zinc-400">
            Esta opción estará disponible en el siguiente paso.
          </p>

          <button
            onClick={() => setModo(null)}
            className="bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-xl"
          >
            ← Volver
          </button>

        </div>

      )}

      {modo === "unirse" && (

        <>

          <input
            type="text"
            placeholder="Nombre de usuario"
            value={usuario}
            onChange={(e) =>
              setUsuario(
                e.target.value
              )
            }
            className="w-full mb-4 p-3 rounded-xl bg-zinc-800"
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="w-full mb-4 p-3 rounded-xl bg-zinc-800"
          />

          <select
            value={avatar}
            onChange={(e) =>
              setAvatar(
                e.target.value
              )
            }
            className="w-full mb-6 p-3 rounded-xl bg-zinc-800"
          >
            <option value="avatar1.png">Avatar 1</option>
            <option value="avatar2.png">Avatar 2</option>
            <option value="avatar3.png">Avatar 3</option>
            <option value="avatar4.png">Avatar 4</option>
            <option value="avatar5.png">Avatar 5</option>
            <option value="avatar6.png">Avatar 6</option>
            <option value="avatar7.png">Avatar 7</option>
            <option value="avatar8.png">Avatar 8</option>
            <option value="avatar9.png">Avatar 9</option>
            <option value="avatar10.png">Avatar 10</option>
            <option value="avatar11.png">Avatar 11</option>
            <option value="avatar12.png">Avatar 12</option>
            <option value="avatar13.png">Avatar 13</option>
          </select>

          <button
            onClick={registrarUsuario}
            className="
              w-full
              bg-green-600
              hover:bg-green-500
              p-3
              rounded-xl
              font-bold
              mb-4
            "
          >
            Crear cuenta
          </button>

          <button
            onClick={() => setModo(null)}
            className="
              w-full
              bg-zinc-700
              hover:bg-zinc-600
              p-3
              rounded-xl
            "
          >
            ← Volver
          </button>

        </>

      )}

    </div>

  </main>

);

}
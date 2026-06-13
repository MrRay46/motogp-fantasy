"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {

  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const iniciarSesion =
    async () => {

      const {
        data,
        error,
      } = await supabase
        .from("usuarios")
        .select("*")
        .eq("usuario", usuario)
        .eq("password", password)
        .eq("activo", true)
        .single();

      if (error || !data) {

        alert(
          "Usuario o contraseña incorrectos"
        );

        return;
      }

      localStorage.setItem(
        "usuarioLogueado",
        data.usuario
      );

      window.location.href = "/";
    };

  return (

    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8">

      <h1 className="text-5xl font-bold text-red-500 mb-12">
        MotoGP Fantasy
      </h1>

      <div className="w-full max-w-md space-y-4">

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) =>
            setUsuario(
              e.target.value
            )
          }
          className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
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
          className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
        />

        <button
          onClick={iniciarSesion}
          className="w-full bg-red-600 hover:bg-red-500 p-4 rounded-2xl font-bold"
        >
          Iniciar sesión
        </button>

      </div>

    </main>

  );
}
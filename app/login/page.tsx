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

      <h1 className="text-5xl font-bold text-red-500">
        MotoGP Fantasy
      </h1>

      <p className="text-zinc-400 text-center mt-4 mb-10 leading-relaxed">
        Tu equipo.<br />
        Tus decisiones.<br />
        Tu campeonato.
      </p>

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
          className="w-full bg-red-600 hover:bg-red-500 transition-colors p-4 rounded-2xl font-bold"
        >
          Iniciar sesión
        </button>

        <div className="text-center pt-6 border-t border-zinc-800">

          <p className="text-zinc-500 text-sm">
            ¿No tienes cuenta?
          </p>

          <button
            onClick={() =>
              window.location.href = "/registro"
            }
            className="mt-2 text-red-500 hover:text-red-400 font-semibold transition-colors"
          >
            Crear cuenta
          </button>

        </div>

      </div>

      <p className="mt-12 text-xs text-zinc-600">
        v0.9 Alpha
      </p>

    </main>

  );
}
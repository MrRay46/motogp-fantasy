"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function LoginPage() {

  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {

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

      alert("Usuario o contraseña incorrectos");
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

      <div className="mb-8 flex justify-center">

        <Image
          src="/images/raygrid-logo.png"
          alt="RayGrid"
          width={340}
          height={340}
          priority
        />

      </div>

      <p className="text-zinc-400 text-center text-lg tracking-wide mb-10">
        Tu equipo. Tus decisiones. Tu campeonato.
      </p>

      <div className="w-full max-w-md space-y-4">

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          className="
            w-full
            p-4
            rounded-2xl
            bg-zinc-900
            border
            border-zinc-700
            focus:border-orange-500
            focus:outline-none
            transition-colors
          "
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="
            w-full
            p-4
            rounded-2xl
            bg-zinc-900
            border
            border-zinc-700
            focus:border-orange-500
            focus:outline-none
            transition-colors
          "
        />

        <button
          onClick={iniciarSesion}
          className="
            w-full
            bg-gradient-to-r
            from-orange-500
            to-red-600
            hover:from-orange-400
            hover:to-red-500
            transition-all
            duration-300
            p-4
            rounded-2xl
            font-bold
            shadow-lg
            shadow-red-900/30
          "
        >
          Iniciar sesión
        </button>

        <div className="text-center pt-6 border-t border-zinc-800">

          <p className="text-zinc-500 text-sm">
            ¿No tienes cuenta?
          </p>

          <button
            onClick={() => window.location.href = "/registro"}
            className="
              mt-2
              text-orange-400
              hover:text-orange-300
              font-semibold
              transition-colors
            "
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
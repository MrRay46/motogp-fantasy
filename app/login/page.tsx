"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";

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

    window.location.href = "/dashboard";

  };

  return (

    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

      <Logo size={280} />

      <p
        className="
          mt-8
          text-center
          text-base
          md:text-lg
          text-zinc-400
          tracking-wide
          max-w-xl
        "
      >
        Tu equipo · Tus decisiones · Tu campeonato
      </p>

      <div className="w-full max-w-md mt-12 space-y-4">

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

        <Button onClick={iniciarSesion}>
          Iniciar sesión →
        </Button>

      </div>

      <Divider />

      <div className="text-center">

        <p className="text-zinc-500">
          ¿No tienes cuenta?
        </p>

        <button
          onClick={() => (window.location.href = "/registro")}
          className="
            mt-3
            text-orange-400
            hover:text-orange-300
            transition-colors
            font-semibold
          "
        >
          Crear cuenta
        </button>

      </div>

      <p className="mt-10 text-xs text-zinc-600">
        v0.9 Alpha
      </p>

    </main>

  );

}
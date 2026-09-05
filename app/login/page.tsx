"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";

export default function LoginPage() {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario,
          password,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        alert(
          resultado.error ||
            "Error al iniciar sesión"
        );
        return;
      }

      localStorage.setItem(
        "usuario",
        JSON.stringify(resultado.usuario)
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);

      alert(
        "No se ha podido iniciar sesión. Inténtalo de nuevo."
      );
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <PageHeader />

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
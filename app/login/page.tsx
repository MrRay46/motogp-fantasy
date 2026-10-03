"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const iniciarSesion = async () => {
    try {
      if (!email || !password) {
        alert("Introduce tu email y contraseña.");
        return;
      }

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

      if (error) {
        console.error("Error de Supabase Auth:", error);
        alert("Email o contraseña incorrectos.");
        return;
      }

      if (!data.session?.access_token) {
        alert("No se ha podido obtener la sesión autenticada.");
        return;
      }

      const respuesta = await fetch("/api/usuario/contexto", {
        headers: {
          Authorization: `Bearer ${data.session.access_token}`,
        },
      });

      const resultado = await respuesta.json().catch(() => null);

      if (!respuesta.ok || !resultado?.usuario) {
        console.error(
          "Error obteniendo el perfil Rayongrid:",
          resultado
        );

        await supabase.auth.signOut();

        alert(
          resultado?.error ??
            "La cuenta no está vinculada a un usuario de Rayongrid."
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
      alert("No se ha podido iniciar sesión. Inténtalo de nuevo.");
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <PageHeader />

      <div className="w-full max-w-md mt-12 space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          onChange={(event) => setPassword(event.target.value)}
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
        <p className="text-zinc-500">¿No tienes cuenta?</p>

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

      <p className="mt-10 text-xs text-zinc-600">v0.9 Alpha</p>
    </main>
  );
}
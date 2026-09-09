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

        alert(
          "Email o contraseña incorrectos."
        );

        return;
      }

      if (!data.user) {
        alert(
          "No se ha podido obtener el usuario autenticado."
        );

        return;
      }

      // Buscamos el usuario Rayongrid asociado
      // al usuario de Supabase Auth.
      const { data: usuarioRayongrid, error: errorUsuario } =
        await supabase
          .from("usuarios")
          .select(
            "id, usuario, avatar, liga_actual_id, super_admin"
          )
          .eq("auth_user_id", data.user.id)
          .eq("activo", true)
          .single();

      if (errorUsuario || !usuarioRayongrid) {
        console.error(
          "Error obteniendo usuario Rayongrid:",
          errorUsuario
        );

        // Cerramos la sesión Auth porque no existe
        // un perfil Rayongrid asociado.
        await supabase.auth.signOut();

        alert(
          "La cuenta está autenticada, pero no está vinculada a un usuario de Rayongrid."
        );

        return;
      }

      // Mantenemos temporalmente este dato porque
      // el resto de Rayongrid todavía lo utiliza.
      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioRayongrid)
      );

      window.location.href = "/dashboard";
    } catch (error) {
      console.error(
        "Error al iniciar sesión:",
        error
      );

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
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
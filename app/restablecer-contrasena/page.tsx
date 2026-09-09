"use client";

import { useState } from "react";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";

export default function RestablecerContrasenaPage() {
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cambiarContrasena = async () => {
    setError("");
    setMensaje("");

    if (!password || !password2) {
      setError("Introduce la nueva contraseña en los dos campos.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        console.error(
          "Error al actualizar la contraseña:",
          error
        );

        setError(
          "No se ha podido cambiar la contraseña. Inténtalo de nuevo."
        );

        return;
      }

      setMensaje(
        "Contraseña actualizada correctamente. Ya puedes iniciar sesión con tu nueva contraseña."
      );

      setPassword("");
      setPassword2("");
    } catch (error) {
      console.error(
        "Error al cambiar la contraseña:",
        error
      );

      setError(
        "No se ha podido cambiar la contraseña. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">
      <PageHeader />

      <div className="w-full max-w-md mt-12 space-y-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">
            Restablecer contraseña
          </h1>

          <p className="mt-3 text-zinc-500">
            Introduce tu nueva contraseña.
          </p>
        </div>

        <input
          type="password"
          placeholder="Nueva contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
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
            disabled:opacity-50
          "
        />

        <input
          type="password"
          placeholder="Repetir nueva contraseña"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          disabled={loading}
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
            disabled:opacity-50
          "
        />

        {error && (
          <div className="rounded-2xl border border-red-900 bg-red-950/40 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="rounded-2xl border border-green-900 bg-green-950/40 p-4 text-sm text-green-300">
            {mensaje}
          </div>
        )}

        <Button onClick={cambiarContrasena}>
  {loading
    ? "Guardando..."
    : "Guardar nueva contraseña →"}
</Button>

        <button
          onClick={() => (window.location.href = "/login")}
          className="
            w-full
            mt-3
            text-zinc-500
            hover:text-zinc-300
            transition-colors
            text-sm
          "
        >
          Volver al inicio de sesión
        </button>
      </div>

      <p className="mt-10 text-xs text-zinc-600">
        v0.9 Alpha
      </p>
    </main>
  );
}
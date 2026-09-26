
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

interface Usuario {
  id: number;
  usuario: string;
  email: string;
  avatar: string;
  liga_actual_id: number | null;
}

interface Props {
  usuario: Usuario;
}

export default function CreateLeagueForm({
  usuario,
}: Props) {
  const router = useRouter();

  const [nombreLiga, setNombreLiga] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function crearLiga() {
    setError("");

    if (loading) return;

    const nombre = nombreLiga.trim();

    if (!nombre) {
      setError("Introduce un nombre para la liga.");
      return;
    }

    if (nombre.length > 60) {
      setError("El nombre no puede superar 60 caracteres.");
      return;
    }

    setLoading(true);

    try {
      //----------------------------------------
      // 1. OBTENER SESIÓN DE SUPABASE AUTH
      //----------------------------------------

      const {
        data: { session },
        error: errorSesion,
      } = await supabase.auth.getSession();

      if (errorSesion || !session?.access_token) {
        setError(
          "Tu sesión ha caducado. Inicia sesión de nuevo."
        );

        router.push("/login");
        return;
      }

      //----------------------------------------
      // 2. LLAMAR A LA API SEGURA
      //----------------------------------------

      const respuesta = await fetch("/api/ligas/crear", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          nombre,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          resultado?.error ??
            "No se pudo crear la liga."
        );

        return;
      }

      //----------------------------------------
      // 3. ACTUALIZAR LOCALSTORAGE
      //----------------------------------------

      const nuevaLiga = resultado.liga;

      if (!nuevaLiga?.id) {
        setError(
          "La liga se ha creado, pero no se recibió su información."
        );

        return;
      }

      const usuarioActualizado = {
        ...usuario,
        liga_actual_id: nuevaLiga.id,
      };

      localStorage.setItem(
        "usuario",
        JSON.stringify(usuarioActualizado)
      );

      //----------------------------------------
      // 4. REDIRIGIR AL DASHBOARD
      //----------------------------------------

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      console.error("Error creando liga:", err);

      setError(
        "No se pudo conectar con el servidor. Inténtalo de nuevo."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-zinc-400 mb-2">
          Nombre de la liga
        </label>

        <input
          type="text"
          placeholder="Ej. Los Rueda Pinchada"
          value={nombreLiga}
          onChange={(e) =>
            setNombreLiga(e.target.value)
          }
          maxLength={60}
          disabled={loading}
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
        />
      </div>

      {error && (
        <div
          className="
            bg-red-900/30
            border
            border-red-700
            rounded-xl
            p-4
            text-red-400
          "
        >
          {error}
        </div>
      )}

      <button
        onClick={crearLiga}
        disabled={loading}
        className="
          w-full
          bg-orange-500
          hover:bg-orange-600
          transition
          rounded-xl
          py-4
          font-bold
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading
          ? "Creando liga..."
          : "Crear Liga"}
      </button>

      <button
        onClick={() => router.push("/registro")}
        disabled={loading}
        className="
          w-full
          bg-zinc-700
          text-white
          hover:bg-zinc-600
          transition
          rounded-xl
          py-4
          font-bold
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        ← Volver
      </button>
    </div>
  );
}

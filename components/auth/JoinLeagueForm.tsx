
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

export default function JoinLeagueForm({
  usuario,
}: Props) {
  const router = useRouter();

  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function unirseLiga() {
    setError("");

    if (loading) return;

    const codigoNormalizado = codigo.trim().toUpperCase();

    if (!codigoNormalizado) {
      setError("Introduce un código de liga.");
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

      const respuesta = await fetch("/api/ligas/unirse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          codigo: codigoNormalizado,
        }),
      });

      const resultado = await respuesta.json();

      if (!respuesta.ok) {
        setError(
          resultado?.error ??
            "No se pudo completar la inscripción."
        );

        return;
      }

      //----------------------------------------
      // 3. ACTUALIZAR LOCALSTORAGE
      //----------------------------------------

      const liga = resultado.liga;

      if (!liga?.id) {
        setError(
          "Te has unido a la liga, pero no se recibió su información."
        );

        return;
      }

      const usuarioActualizado = {
        ...usuario,
        liga_actual_id: liga.id,
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
      console.error("Error uniéndose a liga:", err);

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
          Código de invitación
        </label>

        <input
          type="text"
          placeholder="RG-XXXXXX"
          value={codigo}
          onChange={(e) =>
            setCodigo(e.target.value.toUpperCase())
          }
          maxLength={9}
          disabled={loading}
          className="
            w-full
            rounded-xl
            border
            border-orange-500
            bg-zinc-900
            px-4
            py-3
            text-white
            caret-orange-500
            placeholder:text-zinc-500
            focus:outline-none
            focus:ring-2
            focus:ring-orange-500
          "
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
        onClick={unirseLiga}
        disabled={loading}
        className="
          w-full
          bg-blue-600
          hover:bg-blue-500
          transition
          rounded-xl
          py-4
          font-bold
          text-white
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        {loading
          ? "Uniéndome..."
          : "Entrar en la liga"}
      </button>

      <button
        onClick={() => router.push("/bienvenida")}
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-zinc-700
          py-3
          font-semibold
          text-white
          hover:bg-zinc-600
          transition
          disabled:opacity-50
        "
      >
        ← Volver
      </button>
    </div>
  );
}

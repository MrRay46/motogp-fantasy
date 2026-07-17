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

  function generarCodigoLiga() {

    const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const numeros = "23456789";

    let codigo = "RG-";

    for (let i = 0; i < 6; i++) {

      if (Math.random() > 0.5) {

        codigo += letras[
          Math.floor(Math.random() * letras.length)
        ];

      } else {

        codigo += numeros[
          Math.floor(Math.random() * numeros.length)
        ];

      }

    }

    return codigo;

  }

  async function crearLiga() {

    setError("");

    if (loading) return;

    if (!nombreLiga.trim()) {

      setError("Introduce un nombre para la liga.");

      return;

    }

    setLoading(true);

    const codigo = generarCodigoLiga();

    //----------------------------------------
    // CREAR LIGA
    //----------------------------------------

    const {
      data: nuevaLiga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .insert([
        {
          nombre: nombreLiga,
          codigo,
          activa: true,
          creador_id: usuario.id,
        },
      ])
      .select()
      .single();

    if (errorLiga || !nuevaLiga) {

      console.error(errorLiga);

      setLoading(false);

      setError(
        errorLiga?.message ??
          "No se pudo crear la liga."
      );

      return;

    }

    //----------------------------------------
    // CREAR RELACIÓN USUARIO-LIGA
    //----------------------------------------

    const {
      error: errorRelacion,
    } = await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: usuario.id,
          liga_id: nuevaLiga.id,
          admin_liga: true,
          codigo,
        },
      ]);

    if (errorRelacion) {

      console.error(errorRelacion);

      setLoading(false);

      setError(
        errorRelacion.message ??
          "No se pudo crear la relación."
      );

      return;

    }

    //----------------------------------------
    // ACTUALIZAR LIGA ACTUAL
    //----------------------------------------

    const {
      error: errorUpdate,
    } = await supabase
      .from("usuarios")
      .update({
        liga_actual_id: nuevaLiga.id,
      })
      .eq("id", usuario.id);

    if (errorUpdate) {

      console.error(errorUpdate);

      setLoading(false);

      setError(
        errorUpdate.message ??
          "No se pudo actualizar el usuario."
      );

      return;

    }

      //----------------------------------------
    // ACTUALIZAR LOCALSTORAGE
    //----------------------------------------

    const usuarioActualizado = {
      ...usuario,
      liga_actual_id: nuevaLiga.id,
    };

    localStorage.setItem(
      "usuario",
      JSON.stringify(usuarioActualizado)
    );

    setLoading(false);

    router.push("/dashboard");

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
        "
      >
        {loading
          ? "Creando liga..."
          : "Crear Liga"}
      </button>

      <button
        onClick={() => router.push("/registro")}
        className="
          w-full
          bg-zinc-700
          text-white
          hover:bg-zinc-600
          transition
          rounded-xl
          py-4
          font-bold
        "
      >
        ← Volver
      </button>

    </div>
  );

}
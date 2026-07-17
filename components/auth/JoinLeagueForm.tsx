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

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function unirseLiga() {

    setError("");

    if (loading) return;

    if (!codigo.trim()) {

      setError(
        "Introduce un código de liga."
      );

      return;

    }

    setLoading(true);

    //----------------------------------------
    // BUSCAR LIGA
    //----------------------------------------

    const {
      data: liga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .select("*")
      .eq(
        "codigo",
        codigo.toUpperCase()
      )
      .single();

    if (errorLiga || !liga) {

      console.error(errorLiga);

      setLoading(false);

      setError(
        "Ese código no existe."
      );

      return;

    }

    //----------------------------------------
    // ¿YA PERTENECE?
    //----------------------------------------

    const {
      data: existente,
      error: errorExistente,
    } = await supabase
      .from("usuarios_ligas")
      .select("id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", liga.id)
      .maybeSingle();

    if (errorExistente) {

      console.error(errorExistente);

      setLoading(false);

      setError(
        "No se pudo comprobar la liga."
      );

      return;

    }

    if (existente) {

      setLoading(false);

      setError(
        "Ya perteneces a esta liga."
      );

      return;

    }

    //----------------------------------------
    // INSERTAR RELACIÓN
    //----------------------------------------

    const {
      error: errorRelacion,
    } = await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: usuario.id,
          liga_id: liga.id,
          admin_liga: false,
          codigo: liga.codigo,
        },
      ]);

    if (errorRelacion) {

      console.error(errorRelacion);

      setLoading(false);

      setError(
        errorRelacion.message
      );

      return;

    }

    //----------------------------------------
    // ACTUALIZAR USUARIO
    //----------------------------------------

    const {
      error: errorUpdate,
    } = await supabase
      .from("usuarios")
      .update({
        liga_actual_id: liga.id,
      })
      .eq("id", usuario.id);

    if (errorUpdate) {

      console.error(errorUpdate);

      setLoading(false);

      setError(
        errorUpdate.message
      );

      return;

    }

       //----------------------------------------
    // ACTUALIZAR LOCALSTORAGE
    //----------------------------------------

    const usuarioActualizado = {
      ...usuario,
      liga_actual_id: liga.id,
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
          Código de invitación
        </label>

        <input
  type="text"
  placeholder="RG-XXXXXX"
  value={codigo}
  onChange={(e) =>
    setCodigo(e.target.value.toUpperCase())
  }
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
  "
>
  {loading
    ? "Uniéndome..."
    : "Entrar en la liga"}
</button>

<button
  onClick={() => router.push("/bienvenida")}
  className="
    w-full
    rounded-xl
    bg-zinc-700
    py-3
    font-semibold
    text-zinc-100
    hover:bg-zinc-600
    transition
  "
>
  ← Volver
</button>
</div> 
); 
}
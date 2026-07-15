"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CreateLeagueForm() {

  const [nombreLiga, setNombreLiga] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function generarCodigoLiga() {

    const caracteres =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let codigo = "RG-";

    for (let i = 0; i < 6; i++) {

      codigo += caracteres.charAt(
        Math.floor(
          Math.random() *
          caracteres.length
        )
      );

    }

    return codigo;

  }

  async function crearLiga() {

    setError("");

    if (!nombreLiga.trim()) {

      setError(
        "Introduce un nombre para la liga."
      );

      return;

    }

    const sesion =
      localStorage.getItem(
        "rayongrid_session"
      );

    if (!sesion) {

      setError(
        "No hay sesión iniciada."
      );

      return;

    }

    const usuario =
      JSON.parse(sesion);

    setLoading(true);

    // Obtener usuario actualizado

    const {
      data: usuarioDB,
      error: errorUsuario,
    } = await supabase
      .from("usuarios")
      .select("*")
      .eq("id", usuario.id)
      .single();

    if (errorUsuario || !usuarioDB) {

      setLoading(false);

      setError(
        "No se pudo cargar el usuario."
      );

      return;

    }

    // Crear código

    const codigo =
      generarCodigoLiga();

    // Crear liga

    const {
      data: nuevaLiga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .insert([
        {
          nombre: nombreLiga,
          codigo: codigo,
          activa: true,
          creador_id: usuarioDB.id,
        },
      ])
      .select()
      .single();

    if (errorLiga || !nuevaLiga) {

      console.error(errorLiga);

      setLoading(false);

      setError(
        "No se pudo crear la liga."
      );

      return;

    }

    // Relación usuario-liga

    const {
      error: errorRelacion,
    } = await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: usuarioDB.id,
          liga_id: nuevaLiga.id,
          admin_liga: true,
          codigo: codigo,
        },
      ]);

    if (errorRelacion) {

      console.error(errorRelacion);

      setLoading(false);

      setError(
        "No se pudo crear la relación."
      );

      return;

    }

    // Actualizar liga actual

    

    // Crear equipo

    const {
      error: errorEquipo,
    } = await supabase
      .from("equipos")
      .insert([
        {
          usuario_id: usuarioDB.id,
          liga_id: nuevaLiga.id,

          usuario: usuarioDB.usuario,
          avatar: usuarioDB.avatar,

          puntos: 0,

          posicion_anterior: 0,

          diferencia_lider_anterior: 0,

          admin: true,
        },
      ]);

    if (errorEquipo) {

      console.error(errorEquipo);

    }

    // Actualizar sesión

    usuario.liga_actual_id =
      nuevaLiga.id;

    localStorage.setItem(
      "rayongrid_session",
      JSON.stringify(usuario)
    );

    setLoading(false);

    window.location.href =
      "/dashboard";

  }

  return (

    <div className="space-y-6">

      <h2 className="text-3xl font-bold text-center">
        Crear una liga
      </h2>

      <p className="text-zinc-400 text-center">
        Dale un nombre a tu nueva liga.
      </p>

      <input
        type="text"
        placeholder="Nombre de la liga"
        value={nombreLiga}
        onChange={(e) =>
          setNombreLiga(
            e.target.value
          )
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          outline-none
          focus:border-orange-500
        "
      />

      {error && (

        <div
          className="
            rounded-xl
            bg-red-500/10
            border
            border-red-500/30
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
          bg-yellow-500
          hover:bg-yellow-400
          text-black
          font-bold
          py-4
          rounded-2xl
          transition
          disabled:opacity-50
        "
      >

        {loading
          ? "Creando..."
          : "Crear Liga"}

      </button>

    </div>

  );

}
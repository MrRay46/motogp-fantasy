"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function JoinLeagueForm() {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

async function unirseLiga() {

  setError("");

  if (!codigo.trim()) {
    setError("Introduce un código de liga.");
    return;
  }

  setLoading(true);

  // Leer sesión

  const sesion = localStorage.getItem("rayongrid_session");

  if (!sesion) {
    setError("No hay sesión iniciada.");
    setLoading(false);
    return;
  }

  const usuario = JSON.parse(sesion);

  // Buscar la liga

  const {
    data: liga,
    error: errorLiga,
  } = await supabase
    .from("ligas")
    .select("*")
    .eq("codigo", codigo.toUpperCase())
    .single();

  if (errorLiga || !liga) {
    setError("Ese código no existe.");
    setLoading(false);
    return;
  }

  // Comprobar que no esté ya dentro

  const {
    data: existente,
  } = await supabase
    .from("usuarios_ligas")
    .select("id")
    .eq("usuario_id", usuario.id)
    .eq("liga_id", liga.id)
    .maybeSingle();

  if (existente) {
    setError("Ya perteneces a esa liga.");
    setLoading(false);
    return;
  }

  // Añadir a usuarios_ligas

  const { error: errorUnion } =
    await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: usuario.id,
          liga_id: liga.id,
          admin_liga: false,
          codigo: liga.codigo,
        },
      ]);

  if (errorUnion) {
    console.error(errorUnion);
    setError("No se pudo unir a la liga.");
    setLoading(false);
    return;
  }

  // Actualizar usuario

  await supabase
    .from("usuarios")
    .update({
      liga_id: liga.id,
    })
    .eq("id", usuario.id);

  // Crear equipo

  const { error: errorEquipo } =
    await supabase
      .from("equipos")
      .insert([
        {
          usuario_id: usuario.id,
          liga_id: liga.id,

          usuario: usuario.usuario,
          avatar: usuario.avatar,

          puntos: 0,
          posicion_anterior: 0,
          diferencia_lider_anterior: 0,

          admin: false,

          fichados: [],
          reserva: "",
          motor: "",

          prediccion_piloto: "",
          prediccion_motor: "",

          prediccion_piloto_original: "",
          prediccion_motor_original: "",

          prediccion_piloto_modificada: false,
          prediccion_motor_modificada: false,

          bonus_temporada: 0,
          bonus_temporada_aplicado: false,
        },
      ]);

  if (errorEquipo) {
    console.error(errorEquipo);
  }

  // Actualizar sesión

  usuario.liga_id = liga.id;

  localStorage.setItem(
    "rayongrid_session",
    JSON.stringify(usuario)
  );
setLoading(false);
  window.location.href = "/dashboard";
}
  return (
  <div>

    <h2 className="text-2xl font-bold text-center mb-6">
      Unirme a una liga
    </h2>

    <input
      type="text"
      placeholder="Código de invitación"
      value={codigo}
      onChange={(e) =>
        setCodigo(e.target.value.toUpperCase())
      }
      className="
        w-full
        p-4
        rounded-xl
        bg-zinc-800
        border
        border-zinc-700
        mb-6
        outline-none
        focus:border-orange-500
      "
    />

    {error && (
      <div
        className="
          mb-6
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
      onClick={unirseLiga}
      disabled={loading}
      className="
        w-full
        bg-blue-600
        hover:bg-blue-500
        rounded-xl
        py-4
        font-bold
        transition-colors
      "
    >
      {loading
        ? "Uniéndome..."
        : "Entrar en la liga"}
    </button>

    <button
      onClick={() => window.location.reload()}
      className="
        w-full
        mt-4
        rounded-xl
        py-4
        bg-zinc-700
        hover:bg-zinc-600
      "
    >
      ← Volver
    </button>

  </div>
);
}
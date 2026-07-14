"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarPicker from "./AvatarPicker";

export default function CreateLeagueForm() {

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [nombreLiga, setNombreLiga] = useState("");
  const [codigoLiga, setCodigoLiga] = useState("");

  const [avatar, setAvatar] =
    useState("avatar1.png");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function crearLiga() {

    setError("");

    if (
      !usuario ||
      !email ||
      !password ||
      !confirmarPassword ||
      !nombreLiga ||
      !codigoLiga
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    // Usuario existente

    const { data: usuarioExiste } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("usuario", usuario)
        .maybeSingle();

    if (usuarioExiste) {
      setError("Ese usuario ya existe.");
      setLoading(false);
      return;
    }

    // Email existente

    const { data: emailExiste } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (emailExiste) {
      setError("Ese correo ya está registrado.");
      setLoading(false);
      return;
    }

    // Código repetido

    const { data: ligaExiste } =
      await supabase
        .from("ligas")
        .select("id")
        .eq("codigo", codigoLiga)
        .maybeSingle();

    if (ligaExiste) {
      setError("Ese código ya existe.");
      setLoading(false);
      return;
    }

    // Crear usuario

    const {
      data: nuevoUsuario,
      error: errorUsuario,
    } = await supabase
      .from("usuarios")
      .insert([
        {
          usuario,
          email,
          password,
          avatar,
          activo: true,
          
          super_admin: false,
        },
      ])
      .select()
      .single();

    if (errorUsuario) {

      console.error(errorUsuario);

      setError("Error creando usuario.");

      setLoading(false);

      return;

    }

    // Crear liga

    const {
      data: nuevaLiga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .insert([
        {
          nombre: nombreLiga,
          codigo: codigoLiga.toUpperCase(),
          activa: true,
          creador_id: nuevoUsuario.id,
        },
      ])
      .select()
      .single();

    if (errorLiga) {

      console.error(errorLiga);

      setError("Error creando liga.");

      setLoading(false);

      return;

    }

    // Actualizar usuario

    await supabase
      .from("usuarios")
      .update({
        liga_id: nuevaLiga.id,
      })
      .eq("id", nuevoUsuario.id);

    // Relación usuario-liga

    await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: nuevoUsuario.id,
          liga_id: nuevaLiga.id,
          admin_liga: true,
          codigo: codigoLiga.toUpperCase(),
        },
      ]);

    // Guardar sesión

    localStorage.setItem(
      "rayongrid_session",
      JSON.stringify({
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
      })
    );

    window.location.href = "/dashboard";
  }

  return (

    <div className="space-y-4">

      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e)=>setUsuario(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        type="password"
        placeholder="Repetir contraseña"
        value={confirmarPassword}
        onChange={(e)=>setConfirmarPassword(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        placeholder="Nombre de la liga"
        value={nombreLiga}
        onChange={(e)=>setNombreLiga(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        placeholder="Código de la liga"
        value={codigoLiga}
        onChange={(e)=>setCodigoLiga(e.target.value.toUpperCase())}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <AvatarPicker
        value={avatar}
        onChange={setAvatar}
      />

      {error && (

        <div className="text-red-500">

          {error}

        </div>

      )}

      <button
        disabled={loading}
        onClick={crearLiga}
        className="
          w-full
          bg-yellow-500
          hover:bg-yellow-400
          text-black
          font-bold
          rounded-xl
          py-4
        "
      >
        {loading
          ? "Creando..."
          : "Crear Liga"}
      </button>

    </div>

  );

}
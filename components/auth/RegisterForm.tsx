"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarPicker from "./AvatarPicker";

export default function RegisterForm() {

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [avatar, setAvatar] = useState("avatar1.png");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function registrarUsuario() {

    setError("");

    if (
      !usuario.trim() ||
      !email.trim() ||
      !password ||
      !confirmarPassword
    ) {
      setError("Debes completar todos los campos.");
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

    const { data: usuarioExistente } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("usuario", usuario)
        .maybeSingle();

    if (usuarioExistente) {

      setLoading(false);

      setError("Ese usuario ya existe.");

      return;

    }

    // Email existente

    const { data: emailExistente } =
      await supabase
        .from("usuarios")
        .select("id")
        .eq("email", email)
        .maybeSingle();

    if (emailExistente) {

      setLoading(false);

      setError("Ese correo ya está registrado.");

      return;

    }

    // Crear usuario

    const {
      data: nuevoUsuario,
      error: errorInsert,
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

   if (errorInsert || !nuevoUsuario) {

  console.error(errorInsert);

  if (errorInsert) {
    setError(errorInsert.message);
  } else {
    setError("No se pudo crear la cuenta.");
  }

  setLoading(false);

  return;

}

    // Guardar sesión COMPLETA

    localStorage.setItem(
      "rayongrid_session",
      JSON.stringify(nuevoUsuario)
    );

    setLoading(false);

    window.location.href =
      "/bienvenida";

  }

  return (

    <div className="space-y-5">

      <h1 className="text-4xl font-black text-center">
        RayonGrid
      </h1>

      <p className="text-center text-zinc-400">
        Crea tu cuenta
      </p>

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e)=>setUsuario(e.target.value)}
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
      />

      <input
        type="password"
        placeholder="Repetir contraseña"
        value={confirmarPassword}
        onChange={(e)=>setConfirmarPassword(e.target.value)}
        className="w-full p-4 rounded-2xl bg-zinc-900 border border-zinc-700"
      />

      <AvatarPicker
        value={avatar}
        onChange={setAvatar}
      />

      {error && (

        <div className="rounded-xl bg-red-500/10 border border-red-500/30 p-4 text-red-400">

          {error}

        </div>

      )}

      <button
        onClick={registrarUsuario}
        disabled={loading}
        className="w-full bg-orange-500 hover:bg-orange-400 rounded-2xl py-4 font-bold disabled:opacity-50"
      >

        {loading
          ? "Creando cuenta..."
          : "Crear cuenta"}

      </button>

    </div>

  );

}
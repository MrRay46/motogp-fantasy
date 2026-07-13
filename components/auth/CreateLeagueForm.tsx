"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarPicker from "./AvatarPicker";

export default function CreateLeagueForm() {

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("avatar1.png");
  const [nombreLiga, setNombreLiga] = useState("");

  const crearLiga = async () => {

  if (
    !usuario ||
    !email ||
    !password ||
    !nombreLiga
  ) {
    alert("Completa todos los campos.");
    return;
  }

  // Comprobar email

  const { data: emailExiste } =
    await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();

  if (emailExiste) {
    alert("Ya existe una cuenta con ese correo.");
    return;
  }

  // Comprobar usuario

  const { data: usuarioExiste } =
    await supabase
      .from("usuarios")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle();

  if (usuarioExiste) {
    alert("Ese nombre de usuario ya existe.");
    return;
  }

  // Comprobar liga

  const { data: ligaExiste } =
    await supabase
      .from("ligas")
      .select("id")
      .eq("nombre", nombreLiga)
      .maybeSingle();

  if (ligaExiste) {
    alert("Ese nombre de liga ya existe.");
    return;
  }

  // Crear usuario

  const {
    data: nuevoUsuario,
    error: errorUsuario,
  } = await supabase
    .from("usuarios")
    .insert({
      usuario,
      email,
      password,
      avatar,
      activo: true,
      super_admin: false,
    })
    .select()
    .single();

  if (errorUsuario || !nuevoUsuario) {
    console.error(errorUsuario);
    alert("Error creando usuario.");
    return;
  }

  // Crear liga

  const {
    data: nuevaLiga,
    error: errorLiga,
  } = await supabase
    .from("ligas")
    .insert({
      nombre: nombreLiga,
    })
    .select()
    .single();

  if (errorLiga || !nuevaLiga) {
    console.error(errorLiga);
    alert("Error creando la liga.");
    return;
  }
// Relacionar usuario con la liga

const { error: errorRelacion } = await supabase
  .from("usuarios_ligas")
  .insert({
    usuario_id: nuevoUsuario.id,
    liga_id: nuevaLiga.id,
    admin_liga: true,
  });

if (errorRelacion) {
  console.error(errorRelacion);
  alert("Error asociando el usuario a la liga.");
  return;
}
// Crear equipo

const { error: errorEquipo } = await supabase
  .from("equipos")
  .insert({
    usuario_id: nuevoUsuario.id,
    liga_id: nuevaLiga.id,
  });

if (errorEquipo) {
  console.error(errorEquipo);
  alert("Error creando el equipo.");
  return;
}
};

  return (

    <div className="space-y-4">

      <h2 className="text-2xl font-bold text-center">
        Crear una liga
      </h2>

      <input
        type="text"
        placeholder="Nombre de usuario"
        value={usuario}
        onChange={(e)=>setUsuario(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <input
        type="email"
        placeholder="Correo electrónico"
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
        type="text"
        placeholder="Nombre de la liga"
        value={nombreLiga}
        onChange={(e)=>setNombreLiga(e.target.value)}
        className="w-full p-3 rounded-xl bg-zinc-800"
      />

      <AvatarPicker
  value={avatar}
  onChange={setAvatar}
/>

      <button
        onClick={crearLiga}
        className="
          w-full
          bg-yellow-500
          hover:bg-yellow-400
          text-black
          font-bold
          py-3
          rounded-xl
        "
      >
        Crear Liga
      </button>

    </div>

  );

}
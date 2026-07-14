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

  const [avatar, setAvatar] =
    useState("avatar1.png");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  function generarCodigoLiga() {

    const caracteres =
      "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    let codigo = "";

    for (let i = 0; i < 8; i++) {

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

    if (
      !usuario ||
      !email ||
      !password ||
      !confirmarPassword ||
      !nombreLiga
    ) {

      setError(
        "Debes completar todos los campos."
      );

      return;

    }

    if (
      password !== confirmarPassword
    ) {

      setError(
        "Las contraseñas no coinciden."
      );

      return;

    }

    if (password.length < 6) {

      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );

      return;

    }

    setLoading(true);

    // Comprobar usuario

    const {
      data: usuarioExistente,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle();

    if (usuarioExistente) {

      setLoading(false);

      setError(
        "Ese nombre de usuario ya existe."
      );

      return;

    }

    // Comprobar email

    const {
      data: emailExistente,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (emailExistente) {

      setLoading(false);

      setError(
        "Ese correo electrónico ya está registrado."
      );

      return;

    }

        // =====================================
    // Crear usuario
    // =====================================

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

    if (errorUsuario || !nuevoUsuario) {

      setLoading(false);

      setError(
        "No se pudo crear el usuario."
      );

      return;

    }

    // =====================================
    // Generar código de liga
    // =====================================

    const codigoLiga =
      generarCodigoLiga();

    // =====================================
    // Crear liga
    // =====================================

    const {
      data: nuevaLiga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .insert([
        {
          nombre: nombreLiga,
          codigo: codigoLiga,
          activa: true,
          creador_id: nuevoUsuario.id,
        },
      ])
      .select()
      .single();

    if (errorLiga || !nuevaLiga) {

      setLoading(false);

      setError(
        "No se pudo crear la liga."
      );

      return;

    }

    // =====================================
    // Relacionar usuario con liga
    // =====================================

    const {
      error: errorRelacion,
    } = await supabase
      .from("usuarios_ligas")
      .insert([
        {
          usuario_id: nuevoUsuario.id,
          liga_id: nuevaLiga.id,
          admin_liga: true,
          codigo: codigoLiga,
        },
      ]);

    if (errorRelacion) {

      setLoading(false);

      setError(
        "No se pudo vincular el usuario con la liga."
      );

      return;

    }

    // =====================================
    // Actualizar liga actual
    // =====================================

    const {
      error: errorLigaActual,
    } = await supabase
      .from("usuarios")
      .update({
        liga_actual_id: nuevaLiga.id,
      })
      .eq("id", nuevoUsuario.id);

    if (errorLigaActual) {

      setLoading(false);

      setError(
        "No se pudo actualizar la liga actual."
      );

      return;

    }

    // =====================================
    // Crear equipo
    // =====================================

    const {
      error: errorEquipo,
    } = await supabase
      .from("equipos")
      .insert([
        {
          usuario_id: nuevoUsuario.id,
          liga_id: nuevaLiga.id,
          usuario: usuario,
          avatar: avatar,
          puntos: 0,
        },
      ]);

    if (errorEquipo) {

      setLoading(false);

      setError(
        "No se pudo crear el equipo."
      );

      return;

    }

    // =====================================
    // Guardar sesión
    // =====================================

    localStorage.setItem(
      "rayongrid_session",
      JSON.stringify({
        id: nuevoUsuario.id,
        usuario: nuevoUsuario.usuario,
        email: nuevoUsuario.email,
        avatar: nuevoUsuario.avatar,
        super_admin:
          nuevoUsuario.super_admin,
        liga_actual_id:
          nuevaLiga.id,
      })
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
        Crea tu usuario y conviértete en el administrador de una nueva liga.
      </p>

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) =>
          setUsuario(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
        "
      />

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
        "
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
        "
      />

      <input
        type="password"
        placeholder="Repetir contraseña"
        value={confirmarPassword}
        onChange={(e) =>
          setConfirmarPassword(
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
        "
      />

      <input
        type="text"
        placeholder="Nombre de la liga"
        value={nombreLiga}
        onChange={(e) =>
          setNombreLiga(e.target.value)
        }
        className="
          w-full
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
        "
      />

      <AvatarPicker
        value={avatar}
        onChange={setAvatar}
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
          disabled:opacity-50
          text-black
          font-bold
          py-4
          rounded-2xl
          transition
        "
      >

        {loading
          ? "Creando liga..."
          : "Crear Liga"}

      </button>

    </div>

  );

}

"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import AvatarPicker from "./AvatarPicker";

export default function RegisterForm() {

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [avatar, setAvatar] =
    useState("avatar1.png");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function registrarUsuario() {

  setError("");

  if (
    !usuario ||
    !email ||
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

  // Comprobar usuario

  const {
    data: usuarioExistente,
  } = await supabase
    .from("usuarios")
    .select("id")
    .eq("usuario", usuario)
    .maybeSingle();

  if (usuarioExistente) {

    setError("Ese nombre de usuario ya existe.");
    setLoading(false);
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

    setError("Ese correo electrónico ya está registrado.");
    setLoading(false);
    return;

  }

  // Crear usuario

  const { error } = await supabase
    .from("usuarios")
    .insert([
      {
        usuario,
        email,
        password,
        avatar,

        activo: true,

        admin_liga: false,

        super_admin: false,

        liga_id: null,
      },
    ]);

  if (error) {

    console.error(error);

    setError("Ha ocurrido un error creando la cuenta.");

    setLoading(false);

    return;

  }

  localStorage.setItem(
  "rayongrid_user",
  JSON.stringify({
    usuario,
    email,
    avatar,
  })
);

window.location.href = "/bienvenida";

}

  return (

    <div className="w-full max-w-md mx-auto">

      <h1 className="text-4xl font-black text-center mb-2">

        RayonGrid

      </h1>

      <p className="text-zinc-400 text-center mb-8">

        Crea tu cuenta

      </p>

      {/* Usuario */}

      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) =>
          setUsuario(e.target.value)
        }
        className="
          w-full
          mb-4
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          focus:border-orange-500
          outline-none
        "
      />

      {/* Email */}

      <input
        type="email"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) =>
          setEmail(e.target.value)
        }
        className="
          w-full
          mb-4
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          focus:border-orange-500
          outline-none
        "
      />

      {/* Contraseña */}

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        className="
          w-full
          mb-4
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          focus:border-orange-500
          outline-none
        "
      />

      {/* Confirmar */}

      <input
        type="password"
        placeholder="Repetir contraseña"
        value={confirmarPassword}
        onChange={(e) =>
          setConfirmarPassword(e.target.value)
        }
        className="
          w-full
          mb-8
          p-4
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          focus:border-orange-500
          outline-none
        "
      />

      <AvatarPicker
        value={avatar}
        onChange={setAvatar}
      />

      {error && (

        <div
          className="
            mt-6
            rounded-xl
            bg-red-500/10
            border
            border-red-500/30
            p-4
            text-red-400
            text-sm
          "
        >

          {error}

        </div>

      )}

      <button
        onClick={registrarUsuario}
        disabled={loading}
        className="
          w-full
          mt-8
          bg-orange-500
          hover:bg-orange-400
          rounded-2xl
          py-4
          font-bold
          transition-colors
        "
      >

        {loading
          ? "Creando cuenta..."
          : "Crear cuenta"}

      </button>

    </div>

  );

}
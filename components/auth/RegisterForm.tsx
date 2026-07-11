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

    // La lógica irá aquí en el siguiente paso

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
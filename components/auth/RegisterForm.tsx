"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AvatarPicker from "./AvatarPicker";
import { supabase } from "@/lib/supabase";

export default function RegisterForm() {
  const router = useRouter();

  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [avatar, setAvatar] = useState("avatar1.png");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function registrarUsuario() {
    setError("");

    if (loading) return;

    if (
      !usuario.trim() ||
      !email.trim() ||
      !password ||
      !password2
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (password !== password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 4) {
      setError(
        "La contraseña debe tener al menos 4 caracteres."
      );
      return;
    }

    setLoading(true);

    // Comprobar usuario repetido

    const {
      data: existeUsuario,
      error: errorUsuario,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("usuario", usuario)
      .maybeSingle();

    if (errorUsuario) {
      console.error(errorUsuario);

      setLoading(false);

      setError("Error comprobando usuario.");

      return;
    }

    if (existeUsuario) {
      setLoading(false);

      setError("Ese nombre de usuario ya existe.");

      return;
    }

    // Comprobar email repetido

    const {
      data: existeEmail,
      error: errorEmail,
    } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (errorEmail) {
      console.error(errorEmail);

      setLoading(false);

      setError("Error comprobando email.");

      return;
    }

    if (existeEmail) {
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
          liga_actual_id: null,
        },
      ])
      .select()
      .single();

    if (errorInsert || !nuevoUsuario) {
      console.error(errorInsert);

      setLoading(false);

      setError(
        errorInsert?.message ??
          "No se pudo crear la cuenta."
      );

      return;
    }

    // Guardar sesión temporal

    localStorage.setItem(
      "usuario",
      JSON.stringify(nuevoUsuario)
    );

    router.push("/bienvenida");
  }

  return (
    <div className="w-full max-w-md bg-zinc-900 rounded-3xl p-8 border border-zinc-800">

      <h1 className="text-5xl font-black text-center mb-3">
        RayonGrid
      </h1>

      <p className="text-center text-zinc-400 mb-8">
        Crea tu cuenta
      </p>

      <div className="space-y-4">

        <input
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) =>
            setUsuario(e.target.value)
          }
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
        />

        <input
          type="email"
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
        />

        <input
          type="password"
          placeholder="Repetir contraseña"
          value={password2}
          onChange={(e) =>
            setPassword2(e.target.value)
          }
          className="w-full rounded-xl bg-zinc-900 border border-zinc-700 px-4 py-3 text-white placeholder:text-zinc-400 focus:outline-none focus:border-orange-500"
        />

       <AvatarPicker
  value={avatar}
  onChange={setAvatar}
/>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-400 rounded-xl p-4">
            {error}
          </div>
        )}

        <button
          onClick={registrarUsuario}
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 rounded-xl py-4 font-bold transition"
        >
          {loading
            ? "Creando cuenta..."
            : "Crear cuenta"}
        </button>

      </div>
    </div>
  );
}
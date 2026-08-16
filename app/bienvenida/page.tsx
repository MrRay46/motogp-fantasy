"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Usuario {
  id: number;
  usuario: string;
  email: string;
  avatar: string;
  liga_actual_id: number | null;
}

export default function BienvenidaPage() {
  const router = useRouter();

  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");

    if (!guardado) {
      router.replace("/registro");
      return;
    }

    try {
      const datos = JSON.parse(guardado);

      setUsuario(datos);
    } catch (error) {
      console.error(
        "Error leyendo la sesión:",
        error
      );

      localStorage.removeItem("usuario");

      router.replace("/registro");
    }
  }, [router]);

  if (!usuario) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="w-full max-w-lg">

        <div
          className="
            bg-zinc-900
            rounded-3xl
            border
            border-zinc-800
            p-8
            text-center
          "
        >

          <div className="text-6xl mb-6">
            🏁
          </div>

          <h1 className="text-4xl font-black mb-3">
            Bienvenido a Rayongrid
          </h1>

          <p className="text-xl text-white mb-3">
            Hola{" "}
            <span className="font-bold text-orange-400">
              {usuario.usuario}
            </span>
          </p>

          <p className="text-zinc-400 leading-relaxed mb-8">
            Tu cuenta se ha creado correctamente.
            <br />
            Ya puedes explorar Rayongrid y,
            cuando quieras competir, podrás
            crear una liga o unirte a una existente.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="
              w-full
              bg-orange-500
              hover:bg-orange-600
              text-white
              rounded-xl
              py-4
              font-bold
              text-lg
              transition
            "
          >
            🚀 Entrar en Rayongrid
          </button>

        </div>

      </div>
    </main>
  );
}
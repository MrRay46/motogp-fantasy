"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import CreateLeagueForm from "@/components/auth/CreateLeagueForm";
import JoinLeagueForm from "@/components/auth/JoinLeagueForm";

export default function BienvenidaPage() {
  const router = useRouter();

  const [modo, setModo] = useState<"crear" | "unirse">("crear");
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");

    if (!guardado) {
      router.replace("/registro");
      return;
    }

    const datos = JSON.parse(guardado);

    // Si ya pertenece a una liga, ir al dashboard
    if (datos.liga_actual_id) {
      router.replace("/dashboard");
      return;
    }

    setUsuario(datos);
  }, [router]);

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6">

      <div className="w-full max-w-lg">

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">

          <h1 className="text-4xl font-black text-center mb-2">
            Bienvenido
          </h1>

          <p className="text-center text-zinc-400 mb-8">
            Hola <span className="font-bold">{usuario.usuario}</span>.
            Ahora debes elegir cómo quieres comenzar.
          </p>

          <div className="grid grid-cols-2 gap-3 mb-8">

            <button
              onClick={() => setModo("crear")}
              className={`rounded-xl py-3 font-bold transition ${
                modo === "crear"
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              Crear liga
            </button>

            <button
              onClick={() => setModo("unirse")}
              className={`rounded-xl py-3 font-bold transition ${
                modo === "unirse"
                  ? "bg-orange-500 text-white"
                  : "bg-zinc-800 hover:bg-zinc-700"
              }`}
            >
              Unirme
            </button>

          </div>

          {modo === "crear" ? (
            <CreateLeagueForm usuario={usuario} />
          ) : (
            <JoinLeagueForm usuario={usuario} />
          )}

        </div>

      </div>

    </main>
  );
}
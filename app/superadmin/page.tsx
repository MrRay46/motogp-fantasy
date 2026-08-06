"use client";

import { useState } from "react";

import AppLayout from "@/components/layout/AppLayout";

import { procesarGranPremio } from "@/lib/fantasy/procesarGranPremio";

import { esSuperAdmin } from "@/lib/auth/esSuperAdmin";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SuperAdminPage() {
  const [procesando, setProcesando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

    


useEffect(() => {
  async function comprobar() {
    console.log(
      "¿Es SuperAdmin?",
      await esSuperAdmin()
    );
  }

  comprobar();
}, []);
const router = useRouter();

useEffect(() => {
  async function comprobar() {
    const permitido = await esSuperAdmin();

    if (!permitido) {
      router.replace("/dashboard");
    }
  }

  comprobar();
}, []);

  async function procesar() {
    try {
      setProcesando(true);
      setMensaje("");

      // Temporalmente usamos el usuario 1
      const resultado =
        await procesarGranPremio(1);

      setMensaje(
        `✅ ${resultado.granPremio.nombre} procesado correctamente.
        
Equipos procesados: ${resultado.equiposProcesados}`
      );
    } catch (error: any) {
      setMensaje(
        `❌ ${error.message}`
      );
    } finally {
      setProcesando(false);
    }
  }

  return (
    <AppLayout>
      <section className="max-w-4xl mx-auto py-16 px-6">

        <h1 className="text-5xl font-black mb-10">

          🛠 SUPERADMIN

        </h1>

        <button
          onClick={procesar}
          disabled={procesando}
          className="
            bg-red-600
            hover:bg-red-500
            px-8
            py-4
            rounded-2xl
            text-xl
            font-bold
            transition
            disabled:opacity-50
          "
        >
          {procesando
            ? "Procesando..."
            : "🏁 Procesar GP"}
        </button>

        {mensaje && (

          <div className="
            mt-10
            rounded-2xl
            bg-zinc-900
            border
            border-zinc-700
            p-6
            whitespace-pre-line
          ">

            {mensaje}

          </div>

        )}

      </section>
    </AppLayout>
  );
}
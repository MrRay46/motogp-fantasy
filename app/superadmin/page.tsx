"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import AppLayout from "@/components/layout/AppLayout";
import ConstructorsResults from "@/components/superadmin/ConstructorsResults";
import { procesarGranPremio } from "@/lib/fantasy/procesarGranPremio";
import { esSuperAdmin } from "@/lib/auth/esSuperAdmin";

import PilotsResults from "@/components/superadmin/PilotsResults";

export default function SuperAdminPage() {
  const router = useRouter();

  const [comprobandoPermiso, setComprobandoPermiso] =
    useState(true);

  const [autorizado, setAutorizado] =
    useState(false);

  const [procesando, setProcesando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // COMPROBAR SUPERADMIN
  // -----------------------------------------

  useEffect(() => {
    const permitido = esSuperAdmin();

    if (!permitido) {
      router.replace("/dashboard");
      return;
    }

    setAutorizado(true);
    setComprobandoPermiso(false);
  }, [router]);

  // -----------------------------------------
  // PROCESAR GP
  // -----------------------------------------

  async function procesar() {
    try {
      setProcesando(true);
      setMensaje("");

      // Temporalmente usamos el usuario 1.
      // Lo sustituiremos por el usuario real
      // cuando terminemos el panel SuperAdmin.

      const resultado =
        await procesarGranPremio(1);

      setMensaje(
        `✅ ${resultado.granPremio.nombre} procesado correctamente.

Equipos procesados: ${resultado.equiposProcesados}`
      );
    } catch (error) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error desconocido.";

      setMensaje(`❌ ${mensajeError}`);
    } finally {
      setProcesando(false);
    }
  }

  // -----------------------------------------
  // COMPROBANDO PERMISO
  // -----------------------------------------

  if (comprobandoPermiso) {
    return (
      <AppLayout>
        <section className="max-w-6xl mx-auto py-16 px-6">
          <div className="rounded-3xl bg-zinc-900 border border-zinc-700 p-8 text-center">
            <p className="text-zinc-400">
              Comprobando permisos...
            </p>
          </div>
        </section>
      </AppLayout>
    );
  }

  // -----------------------------------------
  // NO AUTORIZADO
  // -----------------------------------------

  if (!autorizado) {
    return null;
  }

  // -----------------------------------------
  // SUPERADMIN
  // -----------------------------------------

  return (
    <AppLayout>
      <section className="max-w-6xl mx-auto py-16 px-6">

        <h1 className="text-5xl font-black mb-10">
          🛠️ SUPERADMIN
        </h1>

        {/* ---------------------------------- */}
        {/* RESULTADOS DE PILOTOS */}
        {/* ---------------------------------- */}

        <PilotsResults />

        {/* ---------------------------------- */}
        {/* PROCESAMIENTO DEL GP */}
        {/* ---------------------------------- */}
<ConstructorsResults />
        <div className="mt-12 bg-zinc-900 border border-zinc-700 rounded-3xl p-8">

          <h2 className="text-2xl font-bold mb-3">
            🏁 Procesamiento de Gran Premio
          </h2>

          <p className="text-zinc-400 mb-8">
            Cuando hayas introducido y comprobado
            todos los puntos, podrás procesar el
            Gran Premio y actualizar automáticamente
            las Fantasy.
          </p>

          <button
            type="button"
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
              disabled:cursor-not-allowed
            "
          >
            {procesando
              ? "Procesando..."
              : "🏁 Procesar GP"}
          </button>

          {mensaje && (
            <div
              className="
                mt-10
                rounded-2xl
                bg-zinc-950
                border
                border-zinc-700
                p-6
                whitespace-pre-line
              "
            >
              {mensaje}
            </div>
          )}

        </div>

      </section>
    </AppLayout>
  );
}
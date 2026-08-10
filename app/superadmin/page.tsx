"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import AppLayout from "@/components/layout/AppLayout";

import PilotsResults from "@/components/superadmin/PilotsResults";
import ConstructorsResults from "@/components/superadmin/ConstructorsResults";
import GrandPrixData from "@/components/superadmin/GrandPrixData";

import {
  SuperAdminGPProvider,
  useSuperAdminGP,
} from "@/context/SuperAdminGPContext";

import { procesarGranPremio } from "@/lib/fantasy/procesarGranPremio";
import { esSuperAdmin } from "@/lib/auth/esSuperAdmin";

type GranPremio = {
  id: number;
  codigo: string;
  nombre: string;
  temporada: number;
  orden: number;
  estado: string;
};

function SuperAdminContenido() {
  const router = useRouter();

  const {
    granPremioId,
    setGranPremioId,
  } = useSuperAdminGP();

  const [granPremios, setGranPremios] =
    useState<GranPremio[]>([]);

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
    async function comprobar() {
      const permitido =
        await esSuperAdmin();

      if (!permitido) {
        router.replace("/dashboard");
        return;
      }

      setAutorizado(true);
      setComprobandoPermiso(false);
    }

    comprobar();
  }, [router]);

  // -----------------------------------------
  // CARGAR GRANDES PREMIOS
  // -----------------------------------------

  useEffect(() => {
    if (!autorizado) return;

    async function cargarGranPremios() {
      const { data, error } = await supabase
        .from("grandes_premios")
        .select(`
          id,
          codigo,
          nombre,
          temporada,
          orden,
          estado
        `)
        .eq("temporada", 2026)
        .order("orden", {
          ascending: true,
        });

      if (error) {
        console.error(error);

        setMensaje(
          `❌ Error cargando Grandes Premios: ${error.message}`
        );

        return;
      }

      const gps = data || [];

      setGranPremios(gps);

      // ---------------------------------------
      // GP INICIAL
      // ---------------------------------------

      if (granPremioId) {
        return;
      }

      const gpInicial =
        gps.find(
          (gp) => gp.estado === "en_curso"
        ) ??
        gps.find(
          (gp) => gp.estado === "finalizado"
        ) ??
        gps[0];

      if (gpInicial) {
        setGranPremioId(
          gpInicial.id
        );
      }
    }

    cargarGranPremios();
  }, [
    autorizado,
    granPremioId,
    setGranPremioId,
  ]);

  // -----------------------------------------
  // PROCESAR GP
  // -----------------------------------------

  async function procesar() {
    if (!granPremioId) {
      setMensaje(
        "❌ Selecciona primero un Gran Premio."
      );

      return;
    }

    try {
      setProcesando(true);
      setMensaje("");

      // ---------------------------------------
      // OBTENER USUARIO REAL
      // ---------------------------------------

      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.id) {
        throw new Error(
          "No se ha encontrado la sesión del usuario."
        );
      }

      // ---------------------------------------
      // PROCESAR GP SELECCIONADO
      // ---------------------------------------

      const resultado =
        await procesarGranPremio(
          granPremioId,
          sesion.id
        );

      setMensaje(
        `✅ ${resultado.granPremio.nombre} procesado correctamente.

Equipos procesados: ${resultado.equiposProcesados}`
      );
    } catch (error) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Ha ocurrido un error desconocido.";

      setMensaje(
        `❌ ${mensajeError}`
      );
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
        <section className="text-white">
          <p className="text-zinc-400">
            Comprobando permisos...
          </p>
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

  const gpActual =
    granPremios.find(
      (gp) => gp.id === granPremioId
    );

  // -----------------------------------------
  // SUPERADMIN
  // -----------------------------------------

  return (
    <AppLayout>
      <section className="text-white">

        <h1 className="text-5xl font-black mb-10">
          🛠️ SUPERADMIN
        </h1>

        {/* ---------------------------------- */}
        {/* SELECTOR ÚNICO DE GP */}
        {/* ---------------------------------- */}

        <div
          className="
            bg-zinc-900
            border
            border-zinc-700
            rounded-3xl
            p-6
            mb-8
          "
        >

          <h2 className="text-2xl font-bold mb-5">
            🏁 Gran Premio
          </h2>

          <select
            value={granPremioId ?? ""}
            onChange={(e) => {
              const valor =
                e.target.value;

              setGranPremioId(
                valor
                  ? Number(valor)
                  : null
              );
            }}
            className="
              w-full
              bg-zinc-950
              border
              border-zinc-700
              rounded-xl
              px-4
              py-3
              text-white
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar Gran Premio
            </option>

            {granPremios.map(
              (gp) => (
                <option
                  key={gp.id}
                  value={gp.id}
                >
                  GP {gp.orden} — {gp.nombre}
                  {" "}({gp.estado})
                </option>
              )
            )}

          </select>

          {gpActual && (
            <div className="mt-4 text-zinc-400">
              GP seleccionado:{" "}
              <span className="text-white font-semibold">
                {gpActual.nombre}
              </span>
            </div>
          )}

        </div>

        {/* ---------------------------------- */}
        {/* PILOTOS */}
        {/* ---------------------------------- */}

        <PilotsResults />

        {/* ---------------------------------- */}
        {/* CONSTRUCTORES */}
        {/* ---------------------------------- */}

        <div className="mt-8">
          <ConstructorsResults />
        </div>

        {/* ---------------------------------- */}
        {/* DATOS DEL GP */}
        {/* ---------------------------------- */}

        <div className="mt-8">
          <GrandPrixData />
        </div>

        {/* ---------------------------------- */}
        {/* PROCESAMIENTO */}
        {/* ---------------------------------- */}

        <div
          className="
            mt-8
            bg-zinc-900
            border
            border-zinc-700
            rounded-3xl
            p-8
          "
        >

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
            disabled={
              procesando ||
              !granPremioId
            }
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

// -----------------------------------------
// PÁGINA
// -----------------------------------------

export default function SuperAdminPage() {
  return (
    <SuperAdminGPProvider>
      <SuperAdminContenido />
    </SuperAdminGPProvider>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import PaddockNews from "@/components/superadmin/PaddockNews";
import AppLayout from "@/components/layout/AppLayout";
import PilotsResults from "@/components/superadmin/PilotsResults";
import ConstructorsResults from "@/components/superadmin/ConstructorsResults";
import GrandPrixData from "@/components/superadmin/GrandPrixData";
import SeasonChampions from "@/components/superadmin/SeasonChampions";

import {
  SuperAdminGPProvider,
  useSuperAdminGP,
} from "@/context/SuperAdminGPContext";

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

  const { granPremioId, setGranPremioId } = useSuperAdminGP();

  const [granPremios, setGranPremios] = useState<GranPremio[]>([]);
  const [comprobandoPermiso, setComprobandoPermiso] = useState(true);
  const [autorizado, setAutorizado] = useState(false);
  const [procesando, setProcesando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    async function comprobar() {
      const permitido = await esSuperAdmin();

      if (!permitido) {
        router.replace("/dashboard");
        return;
      }

      setAutorizado(true);
      setComprobandoPermiso(false);
    }

    void comprobar();
  }, [router]);

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

      const gpInicial =
        gps.find((gp) => gp.estado === "en_curso") ??
        gps.find((gp) => gp.estado === "finalizado") ??
        gps[0];

      if (gpInicial) {
        setGranPremioId(gpInicial.id);
      }
    }

    void cargarGranPremios();
  }, [autorizado, setGranPremioId]);

  async function procesar() {
    if (!granPremioId) {
      setMensaje("❌ Selecciona primero un Gran Premio.");
      return;
    }

    try {
      setProcesando(true);
      setMensaje("");

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) {
        throw new Error(
          `Error obteniendo la sesión: ${sessionError.message}`
        );
      }

      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        throw new Error(
          "No se ha encontrado una sesión válida de Supabase."
        );
      }

      const response = await fetch("/api/superadmin/procesar-gp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          granPremioId,
        }),
      });

      const resultado = await response.json();

      if (!response.ok) {
        throw new Error(
          resultado?.error ??
            "No se ha podido procesar el Gran Premio."
        );
      }

      setMensaje(
        `✅ ${resultado.granPremio.nombre} procesado correctamente.\n\n` +
          `Equipos procesados: ${resultado.equiposProcesados}`
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

  if (comprobandoPermiso) {
    return (
      <AppLayout>
        <section className="p-8">
          <p className="text-zinc-400">Comprobando permisos...</p>
        </section>
      </AppLayout>
    );
  }

  if (!autorizado) {
    return null;
  }

  const gpActual = granPremios.find((gp) => gp.id === granPremioId);

  return (
    <AppLayout>
      <section className="p-8">
        <h1 className="mb-10 text-5xl font-black">🛠️ SUPERADMIN</h1>

        <SeasonChampions />

        <div className="mb-8 rounded-3xl border border-zinc-700 bg-zinc-900 p-6">
          <h2 className="mb-5 text-2xl font-bold">🏁 Gran Premio</h2>

          <select
            value={granPremioId ?? ""}
            onChange={(event) => {
              const valor = event.target.value;
              setGranPremioId(valor ? Number(valor) : null);
            }}
            className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
          >
            <option value="">Seleccionar Gran Premio</option>

            {granPremios.map((gp) => (
              <option key={gp.id} value={gp.id}>
                GP {gp.orden} — {gp.nombre} ({gp.estado})
              </option>
            ))}
          </select>

          {gpActual && (
            <div className="mt-4 text-zinc-400">
              GP seleccionado:{" "}
              <span className="font-semibold text-white">
                {gpActual.nombre}
              </span>
            </div>
          )}
        </div>

        <PilotsResults />

        <div className="mt-8">
          <ConstructorsResults />
        </div>

        <div className="mt-8">
          <GrandPrixData />
        </div>

        <div className="mt-8 rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
          <h2 className="mb-3 text-2xl font-bold">
            🏁 Procesamiento de Gran Premio
          </h2>

          <p className="mb-8 text-zinc-400">
            Cuando hayas introducido y comprobado todos los puntos, podrás
            procesar el Gran Premio y actualizar automáticamente las Fantasy.
          </p>

          <button
            type="button"
            onClick={procesar}
            disabled={procesando || !granPremioId}
            className="rounded-2xl bg-red-600 px-8 py-4 text-xl font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {procesando ? "Procesando..." : "🏁 Procesar GP"}
          </button>

          {mensaje && (
            <div className="mt-10 whitespace-pre-line rounded-2xl border border-zinc-700 bg-zinc-950 p-6">
              {mensaje}
            </div>
          )}
        </div>

        <div className="mt-8">
          <PaddockNews />
        </div>
      </section>
    </AppLayout>
  );
}

export default function SuperAdminPage() {
  return (
    <SuperAdminGPProvider>
      <SuperAdminContenido />
    </SuperAdminGPProvider>
  );
}
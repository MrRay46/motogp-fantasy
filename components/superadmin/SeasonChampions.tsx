"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Opcion = {
  id: number;
  nombre: string;
};

type Campeones = {
  temporada: number;
  piloto_campeon_id: number;
  constructor_campeon_id: number;
  actualizado_en: string | null;
};

type RespuestaAPI = {
  error?: string;
  temporada?: number;
  pilotos?: Opcion[];
  constructores?: Opcion[];
  campeones?: Campeones | null;
  bonificacionesAplicadas?: number;
};

export default function SeasonChampions() {
  const [temporada, setTemporada] = useState(2026);
  const [pilotos, setPilotos] = useState<Opcion[]>([]);
  const [constructores, setConstructores] = useState<Opcion[]>([]);
  const [pilotoId, setPilotoId] = useState("");
  const [constructorId, setConstructorId] = useState("");
  const [bonificacionesAplicadas, setBonificacionesAplicadas] = useState(0);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const bloqueado = bonificacionesAplicadas > 0;

  const obtenerToken = useCallback(async () => {
    const { data, error } = await supabase.auth.getSession();

    if (error) {
      throw new Error(`No se pudo comprobar la sesión: ${error.message}`);
    }

    const token = data.session?.access_token;

    if (!token) {
      throw new Error("No se ha encontrado una sesión válida.");
    }

    return token;
  }, []);

  const cargarDatos = useCallback(async () => {
    try {
      setCargando(true);
      setMensaje("");

      const token = await obtenerToken();
      const response = await fetch(
        "/api/superadmin/campeones-temporada",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const resultado = (await response.json()) as RespuestaAPI;

      if (!response.ok) {
        throw new Error(
          resultado.error ?? "No se pudieron cargar los campeones."
        );
      }

      setTemporada(resultado.temporada ?? 2026);
      setPilotos(resultado.pilotos ?? []);
      setConstructores(resultado.constructores ?? []);
      setBonificacionesAplicadas(
        resultado.bonificacionesAplicadas ?? 0
      );

      if (resultado.campeones) {
        setPilotoId(String(resultado.campeones.piloto_campeon_id));
        setConstructorId(
          String(resultado.campeones.constructor_campeon_id)
        );
      }
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ No se pudieron cargar los datos."
      );
    } finally {
      setCargando(false);
    }
  }, [obtenerToken]);

  useEffect(() => {
    void cargarDatos();
  }, [cargarDatos]);

  async function guardarCampeones() {
    const pilotoSeleccionado = pilotos.find(
      (piloto) => String(piloto.id) === pilotoId
    );
    const constructorSeleccionado = constructores.find(
      (constructor) => String(constructor.id) === constructorId
    );

    if (!pilotoSeleccionado || !constructorSeleccionado) {
      setMensaje("❌ Selecciona el piloto y el constructor campeones.");
      return;
    }

    const confirmado = window.confirm(
      `¿Confirmas estos campeones de ${temporada}?\n\n` +
        `Piloto: ${pilotoSeleccionado.nombre}\n` +
        `Constructor: ${constructorSeleccionado.nombre}\n\n` +
        "Esta selección se utilizará para calcular las bonificaciones de todas las ligas."
    );

    if (!confirmado) {
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const token = await obtenerToken();
      const response = await fetch(
        "/api/superadmin/campeones-temporada",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            piloto_campeon_id: Number(pilotoId),
            constructor_campeon_id: Number(constructorId),
          }),
        }
      );

      const resultado = (await response.json()) as RespuestaAPI;

      if (!response.ok) {
        throw new Error(
          resultado.error ?? "No se pudieron guardar los campeones."
        );
      }

      setMensaje(
        `✅ Campeones de ${temporada} guardados correctamente.`
      );

      await cargarDatos();
    } catch (error) {
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ No se pudieron guardar los campeones."
      );
    } finally {
      setGuardando(false);
    }
  }

  return (
    <section className="mb-8 rounded-3xl border border-zinc-700 bg-zinc-900 p-6">
      <h2 className="mb-3 text-2xl font-bold">
        🏆 Campeones de temporada
      </h2>

      <p className="mb-6 text-zinc-400">
        Registra manualmente los campeones oficiales. La API guardará la
        selección en Supabase y la usará para las bonificaciones de las ligas.
      </p>

      {cargando ? (
        <p className="text-zinc-400">Cargando campeones...</p>
      ) : (
        <>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block">
              <span className="mb-2 block font-semibold">
                Piloto campeón {temporada}
              </span>
              <select
                value={pilotoId}
                onChange={(event) => setPilotoId(event.target.value)}
                disabled={guardando || bloqueado}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Seleccionar piloto</option>
                {pilotos.map((piloto) => (
                  <option key={piloto.id} value={piloto.id}>
                    {piloto.nombre}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block font-semibold">
                Constructor campeón {temporada}
              </span>
              <select
                value={constructorId}
                onChange={(event) => setConstructorId(event.target.value)}
                disabled={guardando || bloqueado}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Seleccionar constructor</option>
                {constructores.map((constructor) => (
                  <option key={constructor.id} value={constructor.id}>
                    {constructor.nombre}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {bloqueado ? (
            <div className="mt-5 rounded-xl border border-amber-700 bg-amber-950/40 p-4 text-amber-200">
              Ya hay bonificaciones aplicadas a {bonificacionesAplicadas} equipo(s).
              La selección queda bloqueada para conservar los resultados.
            </div>
          ) : (
            <p className="mt-5 text-sm text-zinc-400">
              La selección se puede corregir hasta que se aplique la primera
              bonificación. Después quedará bloqueada.
            </p>
          )}

          <button
            type="button"
            onClick={guardarCampeones}
            disabled={
              guardando ||
              bloqueado ||
              !pilotoId ||
              !constructorId ||
              pilotos.length === 0 ||
              constructores.length === 0
            }
            className="mt-6 rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar campeones"}
          </button>
        </>
      )}

      {mensaje && (
        <div className="mt-5 whitespace-pre-line rounded-xl border border-zinc-700 bg-zinc-950 p-4">
          {mensaje}
        </div>
      )}
    </section>
  );
}
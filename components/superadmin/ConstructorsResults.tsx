"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { useSuperAdminGP } from "@/context/SuperAdminGPContext";

type Constructor = {
  id: number;
  nombre: string;
  slug: string;
  puntos: number;
  puntos_gp: number;
  activo: boolean;
  orden: number;
};

type GranPremio = {
  id: number;
  nombre: string;
  estado: string;
};

type ResultadoConstructorGP = {
  constructor_id: number;
  puntos_fantasy: number;
  puntos_oficiales: number;
};

export default function ConstructorsResults() {
  const {
    granPremioId,
  } = useSuperAdminGP();

  const [constructoresBase, setConstructoresBase] =
    useState<Constructor[]>([]);

  const [constructores, setConstructores] =
    useState<Constructor[]>([]);

  const [granPremio, setGranPremio] =
    useState<GranPremio | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // CARGAR CONSTRUCTORES
  // -----------------------------------------

  useEffect(() => {
    cargarConstructores();
  }, []);

  async function cargarConstructores() {
    setCargando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("constructores")
      .select(`
        id,
        nombre,
        slug,
        puntos,
        puntos_gp,
        activo,
        orden
      `)
      .eq("activo", true)
      .order("orden", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMensaje(
        `❌ Error cargando constructores: ${error.message}`
      );

      setCargando(false);
      return;
    }

    const datosConstructores =
      data || [];

    setConstructoresBase(
      datosConstructores
    );

    setConstructores(
      datosConstructores
    );

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR GP SELECCIONADO
  // -----------------------------------------

  useEffect(() => {
    if (
      !granPremioId ||
      constructoresBase.length === 0
    ) {
      return;
    }

    cargarResultadosGP(
      granPremioId
    );
  }, [
    granPremioId,
    constructoresBase,
  ]);

  async function cargarResultadosGP(
    gpId: number
  ) {
    setMensaje("");

    // ---------------------------------------
    // CARGAR DATOS DEL GP
    // ---------------------------------------

    const {
      data: gpData,
      error: gpError,
    } = await supabase
      .from("grandes_premios")
      .select(`
        id,
        nombre,
        estado
      `)
      .eq("id", gpId)
      .single();

    if (gpError) {
      console.error(gpError);

      setMensaje(
        `❌ Error cargando el GP: ${gpError.message}`
      );

      return;
    }

    setGranPremio(
      gpData
    );

    // ---------------------------------------
    // CARGAR HISTÓRICO
    // ---------------------------------------

    const {
      data,
      error,
    } = await supabase
      .from("resultados_constructores_gp")
      .select(`
        constructor_id,
        puntos_fantasy,
        puntos_oficiales
      `)
      .eq(
        "gran_premio_id",
        gpId
      );

    if (error) {
      console.error(error);

      setMensaje(
        `❌ Error cargando resultados del GP: ${error.message}`
      );

      return;
    }

    const resultados =
      (data || []) as ResultadoConstructorGP[];

    // ---------------------------------------
    // EXISTE HISTÓRICO
    // ---------------------------------------

    if (
      resultados.length > 0
    ) {
      setConstructores(
        constructoresBase.map(
          (constructor) => {
            const resultado =
              resultados.find(
                (item) =>
                  item.constructor_id ===
                  constructor.id
              );

            if (!resultado) {
              return {
                ...constructor,
                puntos_gp: 0,
                puntos: 0,
              };
            }

            return {
              ...constructor,

              puntos_gp:
                resultado.puntos_fantasy,

              puntos:
                resultado.puntos_oficiales,
            };
          }
        )
      );

      return;
    }

    // ---------------------------------------
    // NO EXISTE HISTÓRICO
    // ---------------------------------------

    /*
      Si el GP está en curso y todavía no
      existe histórico, utilizamos los valores
      actuales de la tabla principal.

      Si es un GP antiguo sin histórico,
      mostramos 0 para evitar inventar datos.
    */

    if (
      gpData.estado === "en_curso"
    ) {
      setConstructores(
        constructoresBase
      );

      return;
    }

    setConstructores(
      constructoresBase.map(
        (constructor) => ({
          ...constructor,
          puntos_gp: 0,
          puntos: 0,
        })
      )
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS FANTASY
  // -----------------------------------------

  function cambiarPuntosGP(
    constructorId: number,
    valor: string
  ) {
    const numero =
      valor === ""
        ? 0
        : Number(valor);

    if (
      Number.isNaN(numero)
    ) {
      return;
    }

    setConstructores(
      (prev) =>
        prev.map(
          (constructor) =>
            constructor.id ===
            constructorId
              ? {
                  ...constructor,
                  puntos_gp:
                    numero,
                }
              : constructor
        )
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS OFICIALES
  // -----------------------------------------

  function cambiarPuntosOficiales(
    constructorId: number,
    valor: string
  ) {
    const numero =
      valor === ""
        ? 0
        : Number(valor);

    if (
      Number.isNaN(numero)
    ) {
      return;
    }

    setConstructores(
      (prev) =>
        prev.map(
          (constructor) =>
            constructor.id ===
            constructorId
              ? {
                  ...constructor,
                  puntos:
                    numero,
                }
              : constructor
        )
    );
  }

  // -----------------------------------------
  // GUARDAR
  // -----------------------------------------

  async function guardarPuntos() {
    if (!granPremioId) {
      setMensaje(
        "❌ Selecciona primero un Gran Premio."
      );

      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      // ---------------------------------------
      // 1. GUARDAR HISTÓRICO DEL GP
      // ---------------------------------------

      for (
        const constructor of constructores
      ) {
        const {
          error,
        } = await supabase
          .from(
            "resultados_constructores_gp"
          )
          .upsert(
            {
              gran_premio_id:
                granPremioId,

              constructor_id:
                constructor.id,

              puntos_fantasy:
                constructor.puntos_gp,

              puntos_oficiales:
                constructor.puntos,
            },
            {
              onConflict:
                "gran_premio_id,constructor_id",
            }
          );

        if (error) {
          throw new Error(
            `Error guardando histórico de ${constructor.nombre}: ${error.message}`
          );
        }
      }

      // ---------------------------------------
      // 2. ACTUALIZAR TABLA PRINCIPAL
      // ---------------------------------------

      for (
        const constructor of constructores
      ) {
        const {
          error,
        } = await supabase
          .from("constructores")
          .update({
            puntos_gp:
              constructor.puntos_gp,

            puntos:
              constructor.puntos,
          })
          .eq(
            "id",
            constructor.id
          );

        if (error) {
          throw new Error(
            `Error actualizando ${constructor.nombre}: ${error.message}`
          );
        }
      }

      setMensaje(
        "✅ Resultados de constructores guardados correctamente."
      );
    } catch (error) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Error desconocido.";

      setMensaje(
        `❌ ${mensajeError}`
      );
    } finally {
      setGuardando(false);
    }
  }

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (cargando) {
    return (
      <div className="text-zinc-400">
        Cargando constructores...
      </div>
    );
  }

  // -----------------------------------------
  // SIN GP
  // -----------------------------------------

  if (!granPremioId) {
    return (
      <section
        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-3xl
          p-6
        "
      >
        <h2 className="text-2xl font-bold">
          🏎️ Puntos de constructores
        </h2>

        <p className="mt-4 text-zinc-400">
          Selecciona un Gran Premio
          para introducir los resultados.
        </p>
      </section>
    );
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <section
      className="
        bg-zinc-900
        border
        border-zinc-700
        rounded-3xl
        overflow-hidden
      "
    >

      {/* ---------------------------------- */}
      {/* CABECERA */}
      {/* ---------------------------------- */}

      <div
        className="
          p-6
          border-b
          border-zinc-700
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-4
        "
      >

        <div>

          <h2 className="text-2xl font-bold">
            🏎️ Puntos de constructores
          </h2>

          <p className="text-zinc-400 mt-1">
            {granPremio
              ? `GP ${granPremio.nombre}`
              : "Gran Premio seleccionado"}
          </p>

          <p className="text-zinc-500 text-sm mt-1">
            Introduce los puntos Fantasy
            y los puntos oficiales.
          </p>

        </div>

        <button
          type="button"
          onClick={
            guardarPuntos
          }
          disabled={
            guardando ||
            !granPremioId
          }
          className="
            bg-green-600
            hover:bg-green-500
            disabled:opacity-50
            disabled:cursor-not-allowed
            px-6
            py-3
            rounded-xl
            font-bold
            transition
          "
        >
          {guardando
            ? "Guardando..."
            : "💾 Guardar puntos"}
        </button>

      </div>

      {/* ---------------------------------- */}
      {/* TABLA */}
      {/* ---------------------------------- */}

      <div className="overflow-x-auto">

        <table className="w-full">

          <thead className="bg-zinc-950">

            <tr className="text-left text-zinc-400">

              <th className="px-6 py-4">
                Constructor
              </th>

              <th className="px-6 py-4 text-center">
                Puntos Fantasy GP
              </th>

              <th className="px-6 py-4 text-center">
                Puntos oficiales
              </th>

            </tr>

          </thead>

          <tbody>

            {constructores.map(
              (constructor) => (
                <tr
                  key={constructor.id}
                  className="
                    border-t
                    border-zinc-800
                    hover:bg-zinc-800/50
                    transition
                  "
                >

                  <td
                    className="
                      px-6
                      py-4
                      font-bold
                    "
                  >
                    {constructor.nombre}
                  </td>

                  {/* FANTASY */}

                  <td className="px-6 py-4">

                    <input
                      type="number"
                      min="0"
                      value={
                        constructor.puntos_gp
                      }
                      onChange={(e) =>
                        cambiarPuntosGP(
                          constructor.id,
                          e.target.value
                        )
                      }
                      className="
                        w-28
                        mx-auto
                        block
                        bg-zinc-950
                        border
                        border-zinc-700
                        rounded-xl
                        px-3
                        py-2
                        text-center
                        font-bold
                        focus:outline-none
                        focus:border-red-500
                      "
                    />

                  </td>

                  {/* OFICIALES */}

                  <td className="px-6 py-4">

                    <input
                      type="number"
                      min="0"
                      value={
                        constructor.puntos
                      }
                      onChange={(e) =>
                        cambiarPuntosOficiales(
                          constructor.id,
                          e.target.value
                        )
                      }
                      className="
                        w-28
                        mx-auto
                        block
                        bg-zinc-950
                        border
                        border-zinc-700
                        rounded-xl
                        px-3
                        py-2
                        text-center
                        font-bold
                        focus:outline-none
                        focus:border-red-500
                      "
                    />

                  </td>

                </tr>
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ---------------------------------- */}
      {/* MENSAJE */}
      {/* ---------------------------------- */}

      {mensaje && (
        <div
          className="
            m-6
            bg-zinc-950
            border
            border-zinc-700
            rounded-2xl
            p-5
            whitespace-pre-line
          "
        >
          {mensaje}
        </div>
      )}

    </section>
  );
}
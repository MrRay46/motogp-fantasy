"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  codigo: string;
  nombre: string;
  temporada: number;
  orden: number;
  estado: string;
};

type ResultadoConstructorGP = {
  constructor_id: number;
  puntos_fantasy: number;
  puntos_oficiales: number;
};

export default function ConstructorsResults() {
  const [constructores, setConstructores] =
    useState<Constructor[]>([]);

  const [granPremios, setGranPremios] =
    useState<GranPremio[]>([]);

  const [granPremioSeleccionado, setGranPremioSeleccionado] =
    useState<number | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // CARGAR GRANDES PREMIOS Y CONSTRUCTORES
  // -----------------------------------------

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  async function cargarDatosIniciales() {
    setCargando(true);
    setMensaje("");

    const [gpResponse, constructoresResponse] =
      await Promise.all([
        supabase
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
          }),

        supabase
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
          }),
      ]);

    if (gpResponse.error) {
      console.error(gpResponse.error);

      setMensaje(
        `❌ Error cargando Grandes Premios: ${gpResponse.error.message}`
      );

      setCargando(false);
      return;
    }

    if (constructoresResponse.error) {
      console.error(
        constructoresResponse.error
      );

      setMensaje(
        `❌ Error cargando constructores: ${constructoresResponse.error.message}`
      );

      setCargando(false);
      return;
    }

    const gps = gpResponse.data || [];

    const datosConstructores =
      constructoresResponse.data || [];

    setGranPremios(gps);
    setConstructores(
      datosConstructores
    );

    // Primero buscamos un GP en curso.
    // Si no existe, uno finalizado.
    // Si tampoco existe, el primero.
    const gpInicial =
      gps.find(
        (gp) => gp.estado === "en_curso"
      ) ??
      gps.find(
        (gp) => gp.estado === "finalizado"
      ) ??
      gps[0];

    if (gpInicial) {
      setGranPremioSeleccionado(
        gpInicial.id
      );

      await cargarResultadosGP(
        gpInicial.id,
        datosConstructores
      );
    }

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR RESULTADOS DEL GP
  // -----------------------------------------

  async function cargarResultadosGP(
    gpId: number,
    constructoresBase: Constructor[] = constructores
  ) {
    setMensaje("");

    const { data, error } = await supabase
      .from("resultados_constructores_gp")
      .select(`
        constructor_id,
        puntos_fantasy,
        puntos_oficiales
      `)
      .eq("gran_premio_id", gpId);

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
    // SI EXISTEN RESULTADOS HISTÓRICOS
    // ---------------------------------------

    if (resultados.length > 0) {
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
    // NO HAY HISTÓRICO
    // ---------------------------------------

    /*
      Si todavía no existe un registro histórico
      para ese GP, no inventamos datos.

      Para el GP actual usamos los valores
      actuales de la tabla constructores.

      Para un GP antiguo sin histórico,
      mostramos 0 hasta que el SuperAdmin
      introduzca sus resultados.
    */

    const gpSeleccionado =
      granPremios.find(
        (gp) => gp.id === gpId
      );

    const esGPActual =
      gpSeleccionado?.estado ===
        "en_curso";

    if (esGPActual) {
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
  // CAMBIAR GP
  // -----------------------------------------

  async function cambiarGP(
    gpId: number
  ) {
    setGranPremioSeleccionado(
      gpId
    );

    await cargarResultadosGP(
      gpId,
      constructores
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

    if (Number.isNaN(numero)) {
      return;
    }

    setConstructores((prev) =>
      prev.map(
        (constructor) =>
          constructor.id ===
          constructorId
            ? {
                ...constructor,
                puntos_gp: numero,
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

    if (Number.isNaN(numero)) {
      return;
    }

    setConstructores((prev) =>
      prev.map(
        (constructor) =>
          constructor.id ===
          constructorId
            ? {
                ...constructor,
                puntos: numero,
              }
            : constructor
      )
    );
  }

  // -----------------------------------------
  // GUARDAR
  // -----------------------------------------

  async function guardarPuntos() {
    if (!granPremioSeleccionado) {
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

      for (const constructor of constructores) {
        const { error } = await supabase
          .from(
            "resultados_constructores_gp"
          )
          .upsert(
            {
              gran_premio_id:
                granPremioSeleccionado,

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

      for (const constructor of constructores) {
        const { error } = await supabase
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
      {/* SELECTOR GP */}
      {/* ---------------------------------- */}

      <div className="
        p-6
        border-b
        border-zinc-700
      ">

        <h2 className="text-2xl font-bold mb-5">
          🏁 Gran Premio
        </h2>

        <select
          value={
            granPremioSeleccionado ?? ""
          }
          onChange={(e) =>
            cambiarGP(
              Number(e.target.value)
            )
          }
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

      </div>

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
            Introduce los puntos Fantasy y
            los puntos oficiales del GP.
          </p>

        </div>

        <button
          type="button"
          onClick={guardarPuntos}
          disabled={
            guardando ||
            !granPremioSeleccionado
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
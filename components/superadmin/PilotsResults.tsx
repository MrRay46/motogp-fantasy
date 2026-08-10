"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { useSuperAdminGP } from "@/context/SuperAdminGPContext";

type Piloto = {
  id: number;
  nombre: string;
  equipo: string;
  constructor: string;
  puntos_gp: number;
  puntos_totales: number;
  foto: string | null;
  activo: boolean;
  orden: number;
};

type GranPremio = {
  id: number;
  nombre: string;
  estado: string;
};

type ResultadoPilotoGP = {
  piloto_id: number;
  puntos_fantasy: number;
  puntos_oficiales: number;
};

export default function PilotsResults() {
  const {
    granPremioId,
  } = useSuperAdminGP();

  const [pilotosBase, setPilotosBase] =
    useState<Piloto[]>([]);

  const [pilotos, setPilotos] =
    useState<Piloto[]>([]);

  const [granPremio, setGranPremio] =
    useState<GranPremio | null>(null);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // CARGAR PILOTOS
  // -----------------------------------------

  useEffect(() => {
    cargarPilotos();
  }, []);

  async function cargarPilotos() {
    setCargando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("pilotos")
      .select(`
        id,
        nombre,
        equipo,
        constructor,
        puntos_gp,
        puntos_totales,
        foto,
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
        `❌ Error cargando pilotos: ${error.message}`
      );

      setCargando(false);
      return;
    }

    const pilotosCargados =
      data || [];

    setPilotosBase(
      pilotosCargados
    );

    setPilotos(
      pilotosCargados
    );

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR GP SELECCIONADO
  // -----------------------------------------

  useEffect(() => {
    if (
      !granPremioId ||
      pilotosBase.length === 0
    ) {
      return;
    }

    cargarResultadosGP(
      granPremioId
    );
  }, [
    granPremioId,
    pilotosBase,
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
      .from("resultados_pilotos_gp")
      .select(`
        piloto_id,
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
      (data || []) as ResultadoPilotoGP[];

    // ---------------------------------------
    // EXISTE HISTÓRICO
    // ---------------------------------------

    if (
      resultados.length > 0
    ) {
      setPilotos(
        pilotosBase.map(
          (piloto) => {
            const resultado =
              resultados.find(
                (item) =>
                  item.piloto_id ===
                  piloto.id
              );

            if (!resultado) {
              return {
                ...piloto,
                puntos_gp: 0,
                puntos_totales: 0,
              };
            }

            return {
              ...piloto,

              puntos_gp:
                resultado.puntos_fantasy,

              puntos_totales:
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
      hemos creado su histórico, mostramos
      los valores actuales de la tabla
      principal.

      Si es un GP antiguo sin histórico,
      mostramos 0 para no inventar datos.
    */

    if (
      gpData.estado === "en_curso"
    ) {
      setPilotos(
        pilotosBase
      );

      return;
    }

    setPilotos(
      pilotosBase.map(
        (piloto) => ({
          ...piloto,
          puntos_gp: 0,
          puntos_totales: 0,
        })
      )
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS FANTASY
  // -----------------------------------------

  function cambiarPuntosGP(
    pilotoId: number,
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

    setPilotos(
      (prev) =>
        prev.map(
          (piloto) =>
            piloto.id ===
            pilotoId
              ? {
                  ...piloto,
                  puntos_gp:
                    numero,
                }
              : piloto
        )
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS OFICIALES
  // -----------------------------------------

  function cambiarPuntosTotales(
    pilotoId: number,
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

    setPilotos(
      (prev) =>
        prev.map(
          (piloto) =>
            piloto.id ===
            pilotoId
              ? {
                  ...piloto,
                  puntos_totales:
                    numero,
                }
              : piloto
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
        const piloto of pilotos
      ) {
        const {
          error,
        } = await supabase
          .from(
            "resultados_pilotos_gp"
          )
          .upsert(
            {
              gran_premio_id:
                granPremioId,

              piloto_id:
                piloto.id,

              puntos_fantasy:
                piloto.puntos_gp,

              puntos_oficiales:
                piloto.puntos_totales,
            },
            {
              onConflict:
                "gran_premio_id,piloto_id",
            }
          );

        if (error) {
          throw new Error(
            `Error guardando histórico de ${piloto.nombre}: ${error.message}`
          );
        }
      }

      // ---------------------------------------
      // 2. ACTUALIZAR TABLA PRINCIPAL
      // ---------------------------------------

      for (
        const piloto of pilotos
      ) {
        const {
          error,
        } = await supabase
          .from("pilotos")
          .update({
            puntos_gp:
              piloto.puntos_gp,

            puntos_totales:
              piloto.puntos_totales,
          })
          .eq(
            "id",
            piloto.id
          );

        if (error) {
          throw new Error(
            `Error actualizando ${piloto.nombre}: ${error.message}`
          );
        }
      }

      setMensaje(
        "✅ Resultados de pilotos guardados correctamente."
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
        Cargando pilotos...
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
          🏍️ Puntos de pilotos
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
            🏍️ Puntos de pilotos
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
                Piloto
              </th>

              <th className="px-6 py-4">
                Equipo
              </th>

              <th className="px-6 py-4 text-center">
                Puntos GP
              </th>

              <th className="px-6 py-4 text-center">
                Puntos temporada
              </th>

            </tr>

          </thead>

          <tbody>

            {pilotos.map(
              (piloto) => (
                <tr
                  key={piloto.id}
                  className="
                    border-t
                    border-zinc-800
                    hover:bg-zinc-800/50
                    transition
                  "
                >

                  <td className="px-6 py-4">

                    <div className="flex items-center gap-3">

                      {piloto.foto && (
                        <img
                          src={
                            piloto.foto
                          }
                          alt={
                            piloto.nombre
                          }
                          className="
                            w-12
                            h-12
                            object-contain
                          "
                        />
                      )}

                      <span className="font-bold">
                        {piloto.nombre}
                      </span>

                    </div>

                  </td>

                  <td
                    className="
                      px-6
                      py-4
                      text-zinc-400
                    "
                  >
                    {piloto.equipo}
                  </td>

                  {/* PUNTOS FANTASY */}

                  <td className="px-6 py-4">

                    <input
                      type="number"
                      min="0"
                      value={
                        piloto.puntos_gp
                      }
                      onChange={(e) =>
                        cambiarPuntosGP(
                          piloto.id,
                          e.target.value
                        )
                      }
                      className="
                        w-24
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

                  {/* PUNTOS OFICIALES */}

                  <td className="px-6 py-4">

                    <input
                      type="number"
                      min="0"
                      value={
                        piloto.puntos_totales
                      }
                      onChange={(e) =>
                        cambiarPuntosTotales(
                          piloto.id,
                          e.target.value
                        )
                      }
                      className="
                        w-24
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
                        text-white
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
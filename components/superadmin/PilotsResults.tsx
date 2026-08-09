"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  codigo: string;
  nombre: string;
  temporada: number;
  orden: number;
  estado: string;
};

type ResultadoPilotoGP = {
  piloto_id: number;
  puntos_fantasy: number;
  puntos_oficiales: number;
};

export default function PilotsResults() {
  const [granPremios, setGranPremios] =
    useState<GranPremio[]>([]);

  const [granPremioSeleccionado, setGranPremioSeleccionado] =
    useState<number | null>(null);

  const [pilotos, setPilotos] =
    useState<Piloto[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // CARGAR GP Y PILOTOS
  // -----------------------------------------

  useEffect(() => {
    cargarDatosIniciales();
  }, []);

  async function cargarDatosIniciales() {
    setCargando(true);
    setMensaje("");

    const [gpResponse, pilotosResponse] =
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

    if (pilotosResponse.error) {
      console.error(pilotosResponse.error);

      setMensaje(
        `❌ Error cargando pilotos: ${pilotosResponse.error.message}`
      );

      setCargando(false);
      return;
    }

    const gps = gpResponse.data || [];
    const pilotosBase =
      pilotosResponse.data || [];

    setGranPremios(gps);
    setPilotos(pilotosBase);

    // GP inicial
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
        pilotosBase,
        gps
      );
    }

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR RESULTADOS HISTÓRICOS DEL GP
  // -----------------------------------------

  async function cargarResultadosGP(
    gpId: number,
    pilotosBase: Piloto[] = pilotos,
    gps: GranPremio[] = granPremios
  ) {
    setMensaje("");

    const { data, error } = await supabase
      .from("resultados_pilotos_gp")
      .select(`
        piloto_id,
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
      (data || []) as ResultadoPilotoGP[];

    // ---------------------------------------
    // EXISTE HISTÓRICO
    // ---------------------------------------

    if (resultados.length > 0) {
      setPilotos(
        pilotosBase.map((piloto) => {
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
        })
      );

      return;
    }

    // ---------------------------------------
    // NO EXISTE HISTÓRICO
    // ---------------------------------------

    const gpSeleccionado =
      gps.find(
        (gp) => gp.id === gpId
      );

    const esGPActual =
      gpSeleccionado?.estado ===
        "en_curso";

    /*
      Si es el GP actual y todavía no hemos
      creado el histórico, utilizamos los
      valores actuales de pilotos.

      Si es un GP antiguo sin histórico,
      mostramos 0 para no inventar datos.
    */

    if (esGPActual) {
      return;
    }

    setPilotos(
      pilotosBase.map((piloto) => ({
        ...piloto,
        puntos_gp: 0,
        puntos_totales: 0,
      }))
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
      pilotos,
      granPremios
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS GP
  // -----------------------------------------

  function cambiarPuntosGP(
    pilotoId: number,
    valor: string
  ) {
    const numero =
      valor === ""
        ? 0
        : Number(valor);

    if (Number.isNaN(numero)) {
      return;
    }

    setPilotos((prev) =>
      prev.map((piloto) =>
        piloto.id === pilotoId
          ? {
              ...piloto,
              puntos_gp: numero,
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

    if (Number.isNaN(numero)) {
      return;
    }

    setPilotos((prev) =>
      prev.map((piloto) =>
        piloto.id === pilotoId
          ? {
              ...piloto,
              puntos_totales: numero,
            }
          : piloto
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

      for (const piloto of pilotos) {
        const { error } = await supabase
          .from("resultados_pilotos_gp")
          .upsert(
            {
              gran_premio_id:
                granPremioSeleccionado,

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

      for (const piloto of pilotos) {
        const { error } = await supabase
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

  const gpActual =
    granPremios.find(
      (gp) =>
        gp.id ===
        granPremioSeleccionado
    );

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (
    cargando &&
    granPremios.length === 0
  ) {
    return (
      <div className="text-zinc-400">
        Cargando Grandes Premios...
      </div>
    );
  }

  // -----------------------------------------
  // RENDER
  // -----------------------------------------

  return (
    <section className="space-y-8">

      {/* ---------------------------------- */}
      {/* SELECTOR DE GP */}
      {/* ---------------------------------- */}

      <div
        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-3xl
          p-6
        "
      >

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

        {gpActual && (
          <div className="mt-4 text-zinc-400">
            Estado:{" "}
            <span className="text-white font-semibold">
              {gpActual.estado}
            </span>
          </div>
        )}

      </div>

      {/* ---------------------------------- */}
      {/* PILOTOS */}
      {/* ---------------------------------- */}

      <div
        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-3xl
          overflow-hidden
        "
      >

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
              Introduce los puntos obtenidos
              en este Gran Premio y los puntos
              oficiales de la temporada.
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
                            src={piloto.foto}
                            alt={piloto.nombre}
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
                          border-zinc-700
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

      </div>

      {mensaje && (
        <div
          className="
            bg-zinc-900
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
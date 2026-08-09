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
  // CARGAR GP
  // -----------------------------------------

  useEffect(() => {
    cargarGranPremios();
  }, []);

  async function cargarGranPremios() {
    setCargando(true);
    setMensaje("");

    const { data, error } = await supabase
      .from("grandes_premios")
      .select(
        "id, codigo, nombre, temporada, orden, estado"
      )
      .eq("temporada", 2026)
      .order("orden", {
        ascending: true,
      });

    if (error) {
      console.error(error);

      setMensaje(
        `❌ Error cargando Grandes Premios: ${error.message}`
      );

      setCargando(false);
      return;
    }

    setGranPremios(data || []);

    // Buscar primero un GP finalizado.
    const gpInicial =
      data?.find(
        (gp) => gp.estado === "finalizado"
      ) ?? data?.[0];

    if (gpInicial) {
      setGranPremioSeleccionado(
        gpInicial.id
      );
    }

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR PILOTOS
  // -----------------------------------------

  useEffect(() => {
    if (!granPremioSeleccionado) {
      return;
    }

    cargarPilotos();
  }, [granPremioSeleccionado]);

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

    setPilotos(data || []);

    setCargando(false);
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS GP
  // -----------------------------------------

  function cambiarPuntosGP(
    pilotoId: number,
    puntos: string
  ) {
    const valor =
      puntos === ""
        ? 0
        : Number(puntos);

    if (Number.isNaN(valor)) {
      return;
    }

    setPilotos((prev) =>
      prev.map((piloto) =>
        piloto.id === pilotoId
          ? {
              ...piloto,
              puntos_gp: valor,
            }
          : piloto
      )
    );
  }

  // -----------------------------------------
  // CAMBIAR PUNTOS TOTALES
  // -----------------------------------------

  function cambiarPuntosTotales(
    pilotoId: number,
    puntos: string
  ) {
    const valor =
      puntos === ""
        ? 0
        : Number(puntos);

    if (Number.isNaN(valor)) {
      return;
    }

    setPilotos((prev) =>
      prev.map((piloto) =>
        piloto.id === pilotoId
          ? {
              ...piloto,
              puntos_totales: valor,
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

      for (const piloto of pilotos) {
        const { error } = await supabase
          .from("pilotos")
          .update({
            puntos_gp:
              piloto.puntos_gp,

            puntos_totales:
              piloto.puntos_totales,
          })
          .eq("id", piloto.id);

        if (error) {
          throw new Error(
            `Error guardando ${piloto.nombre}: ${error.message}`
          );
        }
      }

      setMensaje(
        "✅ Puntos GP y puntos de temporada guardados correctamente."
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
            setGranPremioSeleccionado(
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

                    {/* PILOTO */}

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

                    {/* EQUIPO */}

                    <td
                      className="
                        px-6
                        py-4
                        text-zinc-400
                      "
                    >
                      {piloto.equipo}
                    </td>

                    {/* PUNTOS GP */}

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

                    {/* PUNTOS TEMPORADA */}

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

      {/* ---------------------------------- */}
      {/* MENSAJE */}
      {/* ---------------------------------- */}

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
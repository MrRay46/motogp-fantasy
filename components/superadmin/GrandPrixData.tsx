"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

import { useSuperAdminGP } from "@/context/SuperAdminGPContext";

type Piloto = {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
};

type Constructor = {
  id: number;
  nombre: string;
  activo: boolean;
  orden: number;
};

type GranPremio = {
  id: number;
  nombre: string;
  orden: number;
  estado: string;
  piloto_ganador_sprint_id: number | null;
  piloto_ganador_sprint: string | null;
  piloto_ganador_id: number | null;
  piloto_ganador: string | null;
  piloto_forma_id: number | null;
  piloto_forma: string | null;
  constructor_ganador: string | null;
  constructor_forma: string | null;
};

export default function GrandPrixData() {
  const {
    granPremioId,
    setGranPremioId,
  } = useSuperAdminGP();

  const [granPremios, setGranPremios] =
    useState<GranPremio[]>([]);

  const [pilotos, setPilotos] =
    useState<Piloto[]>([]);

  const [constructores, setConstructores] =
    useState<Constructor[]>([]);

  const [ganadorSprint, setGanadorSprint] =
    useState<number | null>(null);

  const [ganadorCarrera, setGanadorCarrera] =
    useState<number | null>(null);

  const [pilotoForma, setPilotoForma] =
    useState<number | null>(null);

  const [constructorGanador, setConstructorGanador] =
    useState("");

  const [constructorForma, setConstructorForma] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [mensaje, setMensaje] =
    useState("");

  // -----------------------------------------
  // CARGAR DATOS
  // -----------------------------------------

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setMensaje("");

    const [
      gpResponse,
      pilotosResponse,
      constructoresResponse,
    ] = await Promise.all([
      supabase
        .from("grandes_premios")
        .select(`
          id,
          nombre,
          orden,
          estado,
          piloto_ganador_sprint_id,
          piloto_ganador_sprint,
          piloto_ganador_id,
          piloto_ganador,
          piloto_forma_id,
          piloto_forma,
          constructor_ganador,
          constructor_forma
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
          activo,
          orden
        `)
        .eq("activo", true)
        .order("orden", {
          ascending: true,
        }),

      supabase
        .from("constructores")
        .select(`
          id,
          nombre,
          activo,
          orden
        `)
        .eq("activo", true)
        .order("orden", {
          ascending: true,
        }),
    ]);

    if (gpResponse.error) {
      setMensaje(
        `❌ Error cargando Grandes Premios: ${gpResponse.error.message}`
      );
      setCargando(false);
      return;
    }

    if (pilotosResponse.error) {
      setMensaje(
        `❌ Error cargando pilotos: ${pilotosResponse.error.message}`
      );
      setCargando(false);
      return;
    }

    if (constructoresResponse.error) {
      setMensaje(
        `❌ Error cargando constructores: ${constructoresResponse.error.message}`
      );
      setCargando(false);
      return;
    }

    const gps = gpResponse.data || [];

    setGranPremios(gps);
    setPilotos(
      pilotosResponse.data || []
    );
    setConstructores(
      constructoresResponse.data || []
    );

    /*
      Si el contexto todavía no tiene GP,
      establecemos uno inicial.
    */

    if (!granPremioId) {
      const gpInicial =
        gps.find(
          (gp) =>
            gp.estado === "en_curso"
        ) ??
        gps.find(
          (gp) =>
            gp.estado === "finalizado"
        ) ??
        gps[0];

      if (gpInicial) {
        setGranPremioId(
          gpInicial.id
        );
      }
    }

    setCargando(false);
  }

  // -----------------------------------------
  // CARGAR DATOS DEL GP SELECCIONADO
  // -----------------------------------------

  useEffect(() => {
    if (!granPremioId) {
      return;
    }

    const gp =
      granPremios.find(
        (item) =>
          item.id === granPremioId
      );

    if (!gp) {
      return;
    }

    cargarDatosGP(gp);
  }, [
    granPremioId,
    granPremios,
  ]);

  function cargarDatosGP(
    gp: GranPremio
  ) {
    setGanadorSprint(
      gp.piloto_ganador_sprint_id
    );

    setGanadorCarrera(
      gp.piloto_ganador_id
    );

    setPilotoForma(
      gp.piloto_forma_id
    );

    setConstructorGanador(
      gp.constructor_ganador || ""
    );

    setConstructorForma(
      gp.constructor_forma || ""
    );

    setMensaje("");
  }

  // -----------------------------------------
  // GUARDAR DATOS
  // -----------------------------------------

  async function guardarDatos() {
    if (!granPremioId) {
      setMensaje(
        "❌ Selecciona un Gran Premio."
      );
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const pilotoSprint =
        pilotos.find(
          (p) =>
            p.id === ganadorSprint
        );

      const pilotoCarrera =
        pilotos.find(
          (p) =>
            p.id === ganadorCarrera
        );

      const pilotoFormaSeleccionado =
        pilotos.find(
          (p) =>
            p.id === pilotoForma
        );

      const { error } =
        await supabase
          .from("grandes_premios")
          .update({
            piloto_ganador_sprint_id:
              ganadorSprint,

            piloto_ganador_sprint:
              pilotoSprint?.nombre ??
              null,

            piloto_ganador_id:
              ganadorCarrera,

            piloto_ganador:
              pilotoCarrera?.nombre ??
              null,

            piloto_forma_id:
              pilotoForma,

            piloto_forma:
              pilotoFormaSeleccionado?.nombre ??
              null,

            constructor_ganador:
              constructorGanador ||
              null,

            constructor_forma:
              constructorForma ||
              null,
          })
          .eq(
            "id",
            granPremioId
          );

      if (error) {
        throw new Error(
          error.message
        );
      }

      setGranPremios((prev) =>
        prev.map((gp) =>
          gp.id === granPremioId
            ? {
                ...gp,

                piloto_ganador_sprint_id:
                  ganadorSprint,

                piloto_ganador_sprint:
                  pilotoSprint?.nombre ??
                  null,

                piloto_ganador_id:
                  ganadorCarrera,

                piloto_ganador:
                  pilotoCarrera?.nombre ??
                  null,

                piloto_forma_id:
                  pilotoForma,

                piloto_forma:
                  pilotoFormaSeleccionado?.nombre ??
                  null,

                constructor_ganador:
                  constructorGanador ||
                  null,

                constructor_forma:
                  constructorForma ||
                  null,
              }
            : gp
        )
      );

      setMensaje(
        "✅ Datos destacados del GP guardados correctamente."
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
        Cargando datos del GP...
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
        p-6
      "
    >

      <div className="mb-8">

        <h2 className="text-2xl font-bold">
          🏆 Datos destacados del GP
        </h2>

        <p className="text-zinc-400 mt-1">
          Selecciona los resultados y destacados
          que aparecerán en RayonGrid.
        </p>

      </div>

      {/* ---------------------------------- */}
      {/* GP SELECCIONADO */}
      {/* ---------------------------------- */}

      <div className="
        mb-8
        rounded-xl
        bg-zinc-950
        border
        border-zinc-800
        px-4
        py-3
      ">

        {granPremioId
          ? (() => {
              const gp =
                granPremios.find(
                  (item) =>
                    item.id ===
                    granPremioId
                );

              return gp ? (
                <span className="text-white font-semibold">
                  🏁 GP {gp.orden} —{" "}
                  {gp.nombre}
                </span>
              ) : (
                <span className="text-zinc-400">
                  GP seleccionado
                </span>
              );
            })()
          : (
            <span className="text-zinc-400">
              No hay Gran Premio seleccionado
            </span>
          )}

      </div>

      {/* ---------------------------------- */}
      {/* DESTACADOS */}
      {/* ---------------------------------- */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-6
      ">

        {/* GANADOR SPRINT */}

        <div>
          <label className="
            block
            text-sm
            text-zinc-400
            mb-2
          ">
            🏁 Ganador Sprint
          </label>

          <select
            value={
              ganadorSprint ?? ""
            }
            onChange={(e) =>
              setGanadorSprint(
                e.target.value
                  ? Number(
                      e.target.value
                    )
                  : null
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
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar piloto
            </option>

            {pilotos.map(
              (piloto) => (
                <option
                  key={piloto.id}
                  value={piloto.id}
                >
                  {piloto.nombre}
                </option>
              )
            )}

          </select>
        </div>

        {/* GANADOR CARRERA */}

        <div>
          <label className="
            block
            text-sm
            text-zinc-400
            mb-2
          ">
            🏆 Ganador Carrera
          </label>

          <select
            value={
              ganadorCarrera ?? ""
            }
            onChange={(e) =>
              setGanadorCarrera(
                e.target.value
                  ? Number(
                      e.target.value
                    )
                  : null
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
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar piloto
            </option>

            {pilotos.map(
              (piloto) => (
                <option
                  key={piloto.id}
                  value={piloto.id}
                >
                  {piloto.nombre}
                </option>
              )
            )}

          </select>
        </div>

        {/* LÍDER DEL MUNDIAL */}

        <div>
          <label className="
            block
            text-sm
            text-zinc-400
            mb-2
          ">
            👑 Líder del Mundial
          </label>

          <select
            value={
              pilotoForma ?? ""
            }
            onChange={(e) =>
              setPilotoForma(
                e.target.value
                  ? Number(
                      e.target.value
                    )
                  : null
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
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar piloto
            </option>

            {pilotos.map(
              (piloto) => (
                <option
                  key={piloto.id}
                  value={piloto.id}
                >
                  {piloto.nombre}
                </option>
              )
            )}

          </select>
        </div>

        {/* CONSTRUCTOR GANADOR */}

        <div>
          <label className="
            block
            text-sm
            text-zinc-400
            mb-2
          ">
            🏎️ Constructor ganador
          </label>

          <select
            value={
              constructorGanador
            }
            onChange={(e) =>
              setConstructorGanador(
                e.target.value
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
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar constructor
            </option>

            {constructores.map(
              (constructor) => (
                <option
                  key={constructor.id}
                  value={
                    constructor.nombre
                  }
                >
                  {constructor.nombre}
                </option>
              )
            )}

          </select>
        </div>

        {/* CONSTRUCTOR EN FORMA */}

        <div>
          <label className="
            block
            text-sm
            text-zinc-400
            mb-2
          ">
            🔥 Constructor en forma
          </label>

          <select
            value={
              constructorForma
            }
            onChange={(e) =>
              setConstructorForma(
                e.target.value
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
              focus:outline-none
              focus:border-red-500
            "
          >

            <option value="">
              Seleccionar constructor
            </option>

            {constructores.map(
              (constructor) => (
                <option
                  key={constructor.id}
                  value={
                    constructor.nombre
                  }
                >
                  {constructor.nombre}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ---------------------------------- */}
      {/* GUARDAR */}
      {/* ---------------------------------- */}

      <div className="mt-8">

        <button
          type="button"
          onClick={guardarDatos}
          disabled={
            guardando ||
            !granPremioId
          }
          className="
            bg-green-600
            hover:bg-green-500
            disabled:opacity-50
            disabled:cursor-not-allowed
            px-8
            py-4
            rounded-xl
            font-bold
            transition
          "
        >
          {guardando
            ? "Guardando..."
            : "💾 Guardar datos del GP"}
        </button>

      </div>

      {mensaje && (
        <div
          className="
            mt-6
            bg-zinc-950
            border
            border-zinc-700
            rounded-2xl
            p-5
          "
        >
          {mensaje}
        </div>
      )}

    </section>
  );
}
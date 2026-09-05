"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Piloto = {
  id: number;
  nombre: string;
  miniatura: string | null;
  activo: boolean;
  orden: number;
};

type Noticia = {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string | null;
  fecha: string | null;
  visible: boolean | null;
  piloto_id: number | null;
  piloto: {
    id: number;
    nombre: string;
    miniatura: string | null;
  } | null;
};

const TIPOS_NOTICIA = [
  {
    valor: "motogp",
    nombre: "🏁 MotoGP",
  },
  {
    valor: "mercado",
    nombre: "💰 Mercado",
  },
  {
    valor: "fantasy",
    nombre: "⭐ Fantasy",
  },
  {
    valor: "lesión",
    nombre: "🩺 Lesión",
  },
  {
    valor: "calendario",
    nombre: "📅 Calendario",
  },
  {
    valor: "rumor",
    nombre: "💬 Rumor",
  },
];

export default function PaddockNews() {
  const [noticias, setNoticias] =
    useState<Noticia[]>([]);

  const [pilotos, setPilotos] =
    useState<Piloto[]>([]);

  const [tipo, setTipo] =
    useState("motogp");

  const [pilotoId, setPilotoId] =
    useState<number | null>(null);

  const [titulo, setTitulo] =
    useState("");

  const [contenido, setContenido] =
    useState("");

  const [visible, setVisible] =
    useState(true);

  const [editandoId, setEditandoId] =
    useState<number | null>(null);

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
      noticiasResponse,
      pilotosResponse,
    ] = await Promise.all([
      supabase
        .from("noticias")
        .select(`
          id,
          tipo,
          titulo,
          contenido,
          fecha,
          visible,
          piloto_id,
          piloto:pilotos (
            id,
            nombre,
            miniatura
          )
        `)
        .order("fecha", {
          ascending: false,
        }),

      supabase
        .from("pilotos")
        .select(`
          id,
          nombre,
          miniatura,
          activo,
          orden
        `)
        .eq("activo", true)
        .order("orden", {
          ascending: true,
        }),
    ]);

    if (noticiasResponse.error) {
      console.error(
        noticiasResponse.error
      );

      setMensaje(
        `❌ Error cargando noticias: ${noticiasResponse.error.message}`
      );

      setCargando(false);
      return;
    }

    if (pilotosResponse.error) {
      console.error(
        pilotosResponse.error
      );

      setMensaje(
        `❌ Error cargando pilotos: ${pilotosResponse.error.message}`
      );

      setCargando(false);
      return;
    }

    const noticiasCargadas: Noticia[] =
      (noticiasResponse.data || []).map(
        (noticia: any) => ({
          id: noticia.id,
          tipo: noticia.tipo,
          titulo: noticia.titulo,
          contenido: noticia.contenido,
          fecha: noticia.fecha,
          visible: noticia.visible,
          piloto_id: noticia.piloto_id,
          piloto: Array.isArray(
            noticia.piloto
          )
            ? noticia.piloto[0] ?? null
            : noticia.piloto ?? null,
        })
      );

    setNoticias(
      noticiasCargadas
    );

    setPilotos(
      pilotosResponse.data || []
    );

    setCargando(false);
  }

  // -----------------------------------------
  // LIMPIAR FORMULARIO
  // -----------------------------------------

  function limpiarFormulario() {
    setTipo("motogp");
    setPilotoId(null);
    setTitulo("");
    setContenido("");
    setVisible(true);
    setEditandoId(null);
  }

  // -----------------------------------------
  // CREAR / EDITAR
  // -----------------------------------------

  async function guardarNoticia() {
    if (!titulo.trim()) {
      setMensaje(
        "❌ Escribe un título para la noticia."
      );
      return;
    }

    if (!contenido.trim()) {
      setMensaje(
        "❌ Escribe el contenido de la noticia."
      );
      return;
    }

    try {
      setGuardando(true);
      setMensaje("");

      const datos = {
        tipo,
        titulo: titulo.trim(),
        contenido: contenido.trim(),
        visible,
        piloto_id: pilotoId,
      };

      // ---------------------------------------
      // EDITAR
      // ---------------------------------------

      if (editandoId !== null) {
        const response = await fetch(
          "/api/superadmin/noticias",
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              id: editandoId,
              ...datos,
            }),
          }
        );

        const resultado =
          await response.json();

        if (!response.ok) {
          throw new Error(
            resultado.error ||
              "Error actualizando noticia."
          );
        }

        setMensaje(
          "✅ Noticia actualizada correctamente."
        );

        limpiarFormulario();
        await cargarDatos();

        return;
      }

      // ---------------------------------------
      // CREAR
      // ---------------------------------------

      const response = await fetch(
        "/api/superadmin/noticias",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(datos),
        }
      );

      const resultado =
        await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error ||
            "Error creando noticia."
        );
      }

      setMensaje(
        "✅ Noticia publicada correctamente."
      );

      limpiarFormulario();
      await cargarDatos();

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
  // EDITAR NOTICIA
  // -----------------------------------------

  function editarNoticia(
    noticia: Noticia
  ) {
    setEditandoId(noticia.id);
    setTipo(noticia.tipo);
    setPilotoId(noticia.piloto_id);
    setTitulo(noticia.titulo);
    setContenido(
      noticia.contenido || ""
    );
    setVisible(
      noticia.visible ?? true
    );

    setMensaje("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // -----------------------------------------
  // MOSTRAR / OCULTAR
  // -----------------------------------------

  async function cambiarVisibilidad(
    noticia: Noticia
  ) {
    const nuevaVisibilidad =
      !(noticia.visible ?? false);

    try {
      const response = await fetch(
        "/api/superadmin/noticias",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noticia.id,
            visible: nuevaVisibilidad,
          }),
        }
      );

      const resultado =
        await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error ||
            "Error cambiando visibilidad."
        );
      }

      setNoticias((prev) =>
        prev.map((item) =>
          item.id === noticia.id
            ? {
                ...item,
                visible:
                  nuevaVisibilidad,
              }
            : item
        )
      );

      setMensaje(
        nuevaVisibilidad
          ? "✅ Noticia publicada."
          : "✅ Noticia ocultada."
      );

    } catch (error) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Error desconocido.";

      console.error(error);

      setMensaje(
        `❌ ${mensajeError}`
      );
    }
  }

  // -----------------------------------------
  // ELIMINAR
  // -----------------------------------------

  async function eliminarNoticia(
    noticia: Noticia
  ) {
    const confirmado =
      window.confirm(
        `¿Seguro que quieres eliminar la noticia "${noticia.titulo}"?`
      );

    if (!confirmado) {
      return;
    }

    try {
      const response = await fetch(
        "/api/superadmin/noticias",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: noticia.id,
          }),
        }
      );

      const resultado =
        await response.json();

      if (!response.ok) {
        throw new Error(
          resultado.error ||
            "Error eliminando noticia."
        );
      }

      setNoticias((prev) =>
        prev.filter(
          (item) =>
            item.id !== noticia.id
        )
      );

      if (
        editandoId === noticia.id
      ) {
        limpiarFormulario();
      }

      setMensaje(
        "✅ Noticia eliminada correctamente."
      );

    } catch (error) {
      const mensajeError =
        error instanceof Error
          ? error.message
          : "Error desconocido.";

      console.error(error);

      setMensaje(
        `❌ ${mensajeError}`
      );
    }
  }

  // -----------------------------------------
  // FECHA
  // -----------------------------------------

  function formatearFecha(
    fecha: string | null
  ) {
    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(
      fecha
    ).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (cargando) {
    return (
      <section
        className="
          bg-zinc-900
          border
          border-zinc-700
          rounded-3xl
          p-8
        "
      >
        <p className="text-zinc-400">
          Cargando noticias...
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
          p-8
          border-b
          border-zinc-700
        "
      >
        <h2 className="text-2xl font-bold">
          📰 Gestión del Paddock
        </h2>

        <p className="text-zinc-400 mt-2">
          Crea y gestiona las noticias que
          aparecerán en el Paddock.
        </p>
      </div>

      {/* ---------------------------------- */}
      {/* FORMULARIO */}
      {/* ---------------------------------- */}

      <div className="p-8">

        <div
          className="
            bg-zinc-950
            border
            border-zinc-800
            rounded-3xl
            p-6
          "
        >

          <h3 className="text-xl font-bold mb-6">
            {editandoId !== null
              ? "✏️ Editar noticia"
              : "✍️ Nueva noticia"}
          </h3>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
            "
          >

            {/* TIPO */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-zinc-400
                  mb-2
                "
              >
                Tipo de noticia
              </label>

              <select
                value={tipo}
                onChange={(e) =>
                  setTipo(e.target.value)
                }
                className="
                  w-full
                  bg-zinc-900
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
                {TIPOS_NOTICIA.map(
                  (item) => (
                    <option
                      key={item.valor}
                      value={item.valor}
                    >
                      {item.nombre}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* PILOTO */}

            <div>
              <label
                className="
                  block
                  text-sm
                  text-zinc-400
                  mb-2
                "
              >
                Piloto relacionado
              </label>

              <select
                value={
                  pilotoId ?? ""
                }
                onChange={(e) =>
                  setPilotoId(
                    e.target.value
                      ? Number(
                          e.target.value
                        )
                      : null
                  )
                }
                className="
                  w-full
                  bg-zinc-900
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
                  Sin piloto relacionado
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

          </div>

          {/* TÍTULO */}

          <div className="mt-6">

            <label
              className="
                block
                text-sm
                text-zinc-400
                mb-2
              "
            >
              Título
            </label>

            <input
              type="text"
              value={titulo}
              onChange={(e) =>
                setTitulo(e.target.value)
              }
              placeholder="Ej: Fermín Aldeguer ficha por VR46"
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                placeholder:text-zinc-600
                focus:outline-none
                focus:border-red-500
              "
            />

          </div>

          {/* CONTENIDO */}

          <div className="mt-6">

            <label
              className="
                block
                text-sm
                text-zinc-400
                mb-2
              "
            >
              Contenido
            </label>

            <textarea
              value={contenido}
              onChange={(e) =>
                setContenido(
                  e.target.value
                )
              }
              rows={5}
              placeholder="Escribe aquí el contenido de la noticia..."
              className="
                w-full
                bg-zinc-900
                border
                border-zinc-700
                rounded-xl
                px-4
                py-3
                text-white
                placeholder:text-zinc-600
                resize-y
                focus:outline-none
                focus:border-red-500
              "
            />

          </div>

          {/* VISIBLE */}

          <div className="mt-6">

            <label
              className="
                flex
                items-center
                gap-3
                cursor-pointer
              "
            >
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) =>
                  setVisible(
                    e.target.checked
                  )
                }
                className="
                  w-5
                  h-5
                  accent-red-600
                "
              />

              <span className="text-white">
                Publicar noticia
              </span>
            </label>

          </div>

          {/* BOTONES */}

          <div className="
            mt-8
            flex
            flex-wrap
            gap-3
          ">

            <button
              type="button"
              onClick={
                guardarNoticia
              }
              disabled={guardando}
              className="
                bg-red-600
                hover:bg-red-500
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
                : editandoId !== null
                ? "💾 Guardar cambios"
                : "📰 Publicar noticia"}
            </button>

            {editandoId !== null && (
              <button
                type="button"
                onClick={
                  limpiarFormulario
                }
                className="
                  bg-zinc-800
                  hover:bg-zinc-700
                  px-6
                  py-3
                  rounded-xl
                  font-bold
                  transition
                "
              >
                Cancelar edición
              </button>
            )}

          </div>

        </div>

        {/* -------------------------------- */}
        {/* MENSAJE */}
        {/* -------------------------------- */}

        {mensaje && (
          <div
            className="
              mt-6
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

      </div>

      {/* ---------------------------------- */}
      {/* LISTADO */}
      {/* ---------------------------------- */}

      <div
        className="
          border-t
          border-zinc-700
          p-8
        "
      >

        <h3 className="text-xl font-bold mb-6">
          🗂️ Noticias existentes
        </h3>

        {noticias.length === 0 ? (
          <div
            className="
              bg-zinc-950
              border
              border-zinc-800
              rounded-2xl
              p-6
              text-zinc-400
            "
          >
            No hay noticias creadas.
          </div>
        ) : (
          <div className="space-y-4">

            {noticias.map(
              (noticia) => (
                <article
                  key={noticia.id}
                  className="
                    bg-zinc-950
                    border
                    border-zinc-800
                    rounded-2xl
                    p-5
                  "
                >

                  <div
                    className="
                      flex
                      flex-col
                      lg:flex-row
                      lg:items-center
                      lg:justify-between
                      gap-5
                    "
                  >

                    {/* INFORMACIÓN */}

                    <div className="flex-1">

                      <div className="
                        flex
                        flex-wrap
                        items-center
                        gap-3
                      ">

                        <span
                          className="
                            px-3
                            py-1
                            rounded-full
                            bg-zinc-800
                            text-zinc-300
                            text-sm
                            font-semibold
                          "
                        >
                          {noticia.tipo}
                        </span>

                        <span
                          className={`
                            px-3
                            py-1
                            rounded-full
                            text-sm
                            font-semibold
                            ${
                              noticia.visible
                                ? "bg-green-500/15 text-green-300"
                                : "bg-red-500/15 text-red-300"
                            }
                          `}
                        >
                          {noticia.visible
                            ? "● Publicada"
                            : "● Oculta"}
                        </span>

                        {noticia.piloto && (
                          <span className="
                            px-3
                            py-1
                            rounded-full
                            bg-orange-500/10
                            text-orange-300
                            text-sm
                            font-semibold
                          ">
                            🏍️{" "}
                            {noticia.piloto.nombre}
                          </span>
                        )}

                      </div>

                      <h4 className="
                        text-lg
                        font-bold
                        text-white
                        mt-4
                      ">
                        {noticia.titulo}
                      </h4>

                      <p className="
                        text-zinc-400
                        mt-2
                        line-clamp-2
                      ">
                        {noticia.contenido || ""}
                      </p>

                      <p className="
                        text-zinc-600
                        text-sm
                        mt-3
                      ">
                        {formatearFecha(
                          noticia.fecha
                        )}
                      </p>

                    </div>

                    {/* ACCIONES */}

                    <div className="
                      flex
                      flex-wrap
                      gap-2
                    ">

                      <button
                        type="button"
                        onClick={() =>
                          editarNoticia(
                            noticia
                          )
                        }
                        className="
                          bg-blue-600
                          hover:bg-blue-500
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >
                        ✏️ Editar
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          cambiarVisibilidad(
                            noticia
                          )
                        }
                        className="
                          bg-zinc-800
                          hover:bg-zinc-700
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >
                        {noticia.visible
                          ? "🙈 Ocultar"
                          : "👁️ Publicar"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          eliminarNoticia(
                            noticia
                          )
                        }
                        className="
                          bg-red-600
                          hover:bg-red-500
                          px-4
                          py-2
                          rounded-xl
                          font-semibold
                          transition
                        "
                      >
                        🗑️ Eliminar
                      </button>

                    </div>

                  </div>

                </article>
              )
            )}

          </div>
        )}

      </div>

    </section>
  );
}
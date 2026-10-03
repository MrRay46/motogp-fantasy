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

type PilotoRelacionado = {
  id: number;
  nombre: string;
  miniatura: string | null;
};

type Noticia = {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string | null;
  fecha: string | null;
  visible: boolean | null;
  piloto_id: number | null;
  piloto: PilotoRelacionado | null;
};

const TIPOS_NOTICIA = [
  { valor: "motogp", nombre: "🏁 MotoGP" },
  { valor: "mercado", nombre: "💰 Mercado" },
  { valor: "fantasy", nombre: "⭐ Fantasy" },
  { valor: "lesión", nombre: "🩺 Lesión" },
  { valor: "calendario", nombre: "📅 Calendario" },
  { valor: "rumor", nombre: "💬 Rumor" },
];

const API_NOTICIAS = "/api/superadmin/noticias";

async function obtenerToken(): Promise<string> {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session?.access_token) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  return session.access_token;
}

function normalizarPiloto(valor: unknown): PilotoRelacionado | null {
  if (Array.isArray(valor)) {
    valor = valor[0] ?? null;
  }

  if (
    typeof valor !== "object" ||
    valor === null ||
    !("id" in valor) ||
    !("nombre" in valor)
  ) {
    return null;
  }

  const piloto = valor as Record<string, unknown>;

  return {
    id: Number(piloto.id),
    nombre: String(piloto.nombre),
    miniatura:
      typeof piloto.miniatura === "string"
        ? piloto.miniatura
        : null,
  };
}

export default function PaddockNews() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [pilotos, setPilotos] = useState<Piloto[]>([]);
  const [tipo, setTipo] = useState("motogp");
  const [pilotoId, setPilotoId] = useState<number | null>(null);
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [visible, setVisible] = useState(true);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    void cargarDatos();
  }, []);

  async function cargarDatos() {
    setCargando(true);
    setMensaje("");

    try {
      const token = await obtenerToken();
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [noticiasResponse, pilotosResponse] = await Promise.all([
        fetch(API_NOTICIAS, {
          method: "GET",
          headers,
          cache: "no-store",
        }),
        supabase
          .from("pilotos")
          .select("id, nombre, miniatura, activo, orden")
          .eq("activo", true)
          .order("orden", { ascending: true }),
      ]);

      const resultadoNoticias = await noticiasResponse
        .json()
        .catch(() => null);

      if (!noticiasResponse.ok) {
        throw new Error(
          resultadoNoticias?.error ?? "No se han podido cargar las noticias."
        );
      }

      if (pilotosResponse.error) {
        throw new Error(pilotosResponse.error.message);
      }

      const cargadas = Array.isArray(resultadoNoticias?.noticias)
        ? resultadoNoticias.noticias
        : [];

      setNoticias(
        cargadas.map((noticia: Record<string, unknown>) => ({
          id: Number(noticia.id),
          tipo: String(noticia.tipo ?? ""),
          titulo: String(noticia.titulo ?? ""),
          contenido:
            typeof noticia.contenido === "string"
              ? noticia.contenido
              : null,
          fecha:
            typeof noticia.fecha === "string"
              ? noticia.fecha
              : null,
          visible:
            typeof noticia.visible === "boolean"
              ? noticia.visible
              : null,
          piloto_id:
            noticia.piloto_id === null ||
            noticia.piloto_id === undefined
              ? null
              : Number(noticia.piloto_id),
          piloto: normalizarPiloto(noticia.piloto),
        }))
      );

      setPilotos(pilotosResponse.data ?? []);
    } catch (error) {
      console.error("Error cargando gestión del Paddock:", error);
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Error cargando las noticias."
      );
    } finally {
      setCargando(false);
    }
  }

  function limpiarFormulario() {
    setTipo("motogp");
    setPilotoId(null);
    setTitulo("");
    setContenido("");
    setVisible(true);
    setEditandoId(null);
    setMensaje("");
  }

  async function enviarNoticia(
    method: "POST" | "PATCH" | "DELETE",
    datos: Record<string, unknown>
  ) {
    const token = await obtenerToken();

    const response = await fetch(API_NOTICIAS, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(datos),
    });

    const resultado = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(
        resultado?.error ?? "No se ha podido guardar la noticia."
      );
    }

    return resultado;
  }

  async function guardarNoticia() {
    if (!titulo.trim()) {
      setMensaje("❌ Escribe un título para la noticia.");
      return;
    }

    if (!contenido.trim()) {
      setMensaje("❌ Escribe el contenido de la noticia.");
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

      if (editandoId !== null) {
        await enviarNoticia("PATCH", {
          id: editandoId,
          ...datos,
        });
        setMensaje("✅ Noticia actualizada correctamente.");
      } else {
        await enviarNoticia("POST", datos);
        setMensaje("✅ Noticia publicada correctamente.");
      }

      limpiarFormulario();
      await cargarDatos();
    } catch (error) {
      console.error("Error guardando noticia:", error);
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Error guardando la noticia."
      );
    } finally {
      setGuardando(false);
    }
  }

  function editarNoticia(noticia: Noticia) {
    setEditandoId(noticia.id);
    setTipo(noticia.tipo);
    setPilotoId(noticia.piloto_id);
    setTitulo(noticia.titulo);
    setContenido(noticia.contenido ?? "");
    setVisible(noticia.visible ?? true);
    setMensaje("");

    requestAnimationFrame(() => {
      document
        .getElementById("paddock-news-form")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    });
  }

  async function cambiarVisibilidad(noticia: Noticia) {
    const nuevaVisibilidad = !(noticia.visible ?? false);

    try {
      setMensaje("");
      await enviarNoticia("PATCH", {
        id: noticia.id,
        visible: nuevaVisibilidad,
      });

      setNoticias((actuales) =>
        actuales.map((item) =>
          item.id === noticia.id
            ? { ...item, visible: nuevaVisibilidad }
            : item
        )
      );

      setMensaje(
        nuevaVisibilidad
          ? "✅ Noticia publicada."
          : "✅ Noticia ocultada."
      );
    } catch (error) {
      console.error("Error cambiando visibilidad:", error);
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Error cambiando la visibilidad."
      );
    }
  }

  async function eliminarNoticia(noticia: Noticia) {
    const confirmado = window.confirm(
      `¿Seguro que quieres eliminar la noticia "${noticia.titulo}"?`
    );

    if (!confirmado) {
      return;
    }

    try {
      setMensaje("");
      await enviarNoticia("DELETE", { id: noticia.id });

      setNoticias((actuales) =>
        actuales.filter((item) => item.id !== noticia.id)
      );

      if (editandoId === noticia.id) {
        limpiarFormulario();
      }

      setMensaje("✅ Noticia eliminada correctamente.");
    } catch (error) {
      console.error("Error eliminando noticia:", error);
      setMensaje(
        error instanceof Error
          ? `❌ ${error.message}`
          : "❌ Error eliminando la noticia."
      );
    }
  }

  function formatearFecha(fecha: string | null) {
    if (!fecha) {
      return "Sin fecha";
    }

    return new Date(fecha).toLocaleString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  if (cargando) {
    return (
      <section className="rounded-3xl border border-zinc-700 bg-zinc-900 p-8">
        <p className="text-zinc-400">Cargando noticias...</p>
      </section>
    );
  }

  return (
    <section className="overflow-hidden rounded-3xl border border-zinc-700 bg-zinc-900">
      <div className="border-b border-zinc-700 p-8">
        <h2 className="text-2xl font-bold">📰 Gestión del Paddock</h2>
        <p className="mt-2 text-zinc-400">
          Crea y gestiona las noticias que aparecerán en el Paddock.
        </p>
      </div>

      <div className="p-8">
        <div
          id="paddock-news-form"
          className="scroll-mt-24 rounded-3xl border border-zinc-800 bg-zinc-950 p-6"
        >
          <h3 className="mb-6 text-xl font-bold">
            {editandoId !== null ? "✏️ Editar noticia" : "✍️ Nueva noticia"}
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Tipo de noticia
              </label>
              <select
                value={tipo}
                onChange={(event) => setTipo(event.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              >
                {TIPOS_NOTICIA.map((item) => (
                  <option key={item.valor} value={item.valor}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm text-zinc-400">
                Piloto relacionado
              </label>
              <select
                value={pilotoId ?? ""}
                onChange={(event) =>
                  setPilotoId(
                    event.target.value ? Number(event.target.value) : null
                  )
                }
                className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white focus:border-red-500 focus:outline-none"
              >
                <option value="">Sin piloto relacionado</option>
                {pilotos.map((piloto) => (
                  <option key={piloto.id} value={piloto.id}>
                    {piloto.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-zinc-400">Título</label>
            <input
              type="text"
              value={titulo}
              onChange={(event) => setTitulo(event.target.value)}
              maxLength={160}
              placeholder="Ej: Fermín Aldeguer ficha por VR46"
              className="w-full rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm text-zinc-400">
              Contenido
            </label>
            <textarea
              value={contenido}
              onChange={(event) => setContenido(event.target.value)}
              maxLength={10000}
              rows={5}
              placeholder="Escribe aquí el contenido de la noticia..."
              className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-white placeholder:text-zinc-600 focus:border-red-500 focus:outline-none"
            />
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                checked={visible}
                onChange={(event) => setVisible(event.target.checked)}
                className="h-5 w-5 accent-red-600"
              />
              <span className="text-white">Publicar noticia</span>
            </label>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={guardarNoticia}
              disabled={guardando}
              className="rounded-xl bg-red-600 px-6 py-3 font-bold transition hover:bg-red-500 disabled:cursor-not-allowed disabled:opacity-50"
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
                onClick={limpiarFormulario}
                className="rounded-xl bg-zinc-800 px-6 py-3 font-bold transition hover:bg-zinc-700"
              >
                Cancelar edición
              </button>
            )}
          </div>
        </div>

        {mensaje && (
          <div className="mt-6 whitespace-pre-line rounded-2xl border border-zinc-700 bg-zinc-950 p-5">
            {mensaje}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-700 p-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <h3 className="text-xl font-bold">🗂️ Noticias existentes</h3>
          <button
            type="button"
            onClick={() => void cargarDatos()}
            className="rounded-xl bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700"
          >
            Actualizar
          </button>
        </div>

        {noticias.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 text-zinc-400">
            No hay noticias creadas.
          </div>
        ) : (
          <div className="space-y-4">
            {noticias.map((noticia) => (
              <article
                key={noticia.id}
                className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-zinc-800 px-3 py-1 text-sm font-semibold text-zinc-300">
                        {noticia.tipo}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          noticia.visible
                            ? "bg-green-500/15 text-green-300"
                            : "bg-red-500/15 text-red-300"
                        }`}
                      >
                        {noticia.visible ? "● Publicada" : "● Oculta"}
                      </span>

                      {noticia.piloto && (
                        <span className="rounded-full bg-orange-500/10 px-3 py-1 text-sm font-semibold text-orange-300">
                          🏍️ {noticia.piloto.nombre}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-4 text-lg font-bold text-white">
                      {noticia.titulo}
                    </h4>

                    <p className="mt-2 line-clamp-2 text-zinc-400">
                      {noticia.contenido ?? ""}
                    </p>

                    <p className="mt-3 text-sm text-zinc-600">
                      {formatearFecha(noticia.fecha)}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => editarNoticia(noticia)}
                      className="rounded-xl bg-blue-600 px-4 py-2 font-semibold transition hover:bg-blue-500"
                    >
                      ✏️ Editar
                    </button>

                    <button
                      type="button"
                      onClick={() => void cambiarVisibilidad(noticia)}
                      className="rounded-xl bg-zinc-800 px-4 py-2 font-semibold transition hover:bg-zinc-700"
                    >
                      {noticia.visible ? "🙈 Ocultar" : "👁️ Publicar"}
                    </button>

                    <button
                      type="button"
                      onClick={() => void eliminarNoticia(noticia)}
                      className="rounded-xl bg-red-600 px-4 py-2 font-semibold transition hover:bg-red-500"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
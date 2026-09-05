"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaddockPost from "./PaddockPost";

interface Noticia {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string | null;
  fecha: string;
  piloto_id: number | null;
  piloto: {
    id: number;
    nombre: string;
    miniatura: string | null;
  } | null;
}

export default function PaddockFeed({
  limit = true,
  showButton = true,
}: {
  limit?: boolean;
  showButton?: boolean;
}) {
  const [noticias, setNoticias] =
    useState<Noticia[]>([]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  async function cargarNoticias() {
    let query = supabase
      .from("noticias")
      .select(`
        id,
        tipo,
        titulo,
        contenido,
        fecha,
        piloto_id,
        piloto:pilotos (
          id,
          nombre,
          miniatura
        )
      `)
      .eq("visible", true)
      .order("fecha", {
        ascending: false,
      });

    if (limit) {
      query = query.limit(5);
    }

   const { data, error } = await query;

if (error) {
  console.error(error);
  return;
}

const noticiasCargadas: Noticia[] =
  (data || []).map((noticia: any) => ({
    id: noticia.id,
    tipo: noticia.tipo,
    titulo: noticia.titulo,
    contenido: noticia.contenido,
    fecha: noticia.fecha,
    piloto_id: noticia.piloto_id,
    piloto: Array.isArray(noticia.piloto)
      ? noticia.piloto[0] ?? null
      : noticia.piloto ?? null,
  }));

setNoticias(noticiasCargadas);
  }

  function tiempo(fecha: string) {
    const ahora = new Date();
    const publicada = new Date(fecha);

    const horas = Math.floor(
      (ahora.getTime() -
        publicada.getTime()) /
        3600000
    );

    if (horas < 1) {
      return "Hace unos minutos";
    }

    if (horas < 24) {
      return `Hace ${horas} h`;
    }

    const dias = Math.floor(
      horas / 24
    );

    if (dias === 1) {
      return "Ayer";
    }

    if (dias < 30) {
      return `Hace ${dias} días`;
    }

    return "";
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        🏍 PADDOCK
      </h2>

      <div className="space-y-4">

        {noticias.map(
          (noticia) => (
            <PaddockPost
              key={noticia.id}
              tipo={noticia.tipo}
              titulo={noticia.titulo}
              contenido={
                noticia.contenido || ""
              }
              hora={tiempo(
                noticia.fecha
              )}
              piloto={
                noticia.piloto
                  ? {
                      nombre:
                        noticia.piloto.nombre,
                      miniatura:
                        noticia.piloto.miniatura,
                    }
                  : null
              }
            />
          )
        )}

      </div>

      {showButton && (
        <div className="flex justify-center mt-8">

          <button
            onClick={() =>
              (window.location.href =
                "/paddock")
            }
            className="
              text-orange-400
              hover:text-orange-300
              font-semibold
              transition-colors
            "
          >
            Ver todas las noticias →
          </button>

        </div>
      )}

    </div>
  );
}
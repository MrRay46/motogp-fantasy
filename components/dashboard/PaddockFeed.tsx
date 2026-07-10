"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import PaddockPost from "./PaddockPost";

interface Noticia {
  id: number;
  tipo: string;
  titulo: string;
  contenido: string;
  fecha: string;
}

export default function PaddockFeed() {

  const [noticias, setNoticias] = useState<Noticia[]>([]);

  useEffect(() => {
    cargarNoticias();
  }, []);

  async function cargarNoticias() {

    const { data, error } = await supabase
      .from("noticias")
      .select("*")
      .eq("visible", true)
      .order("fecha", { ascending: false });

    if (error) {
      console.error(error);
      return;
    }

    setNoticias(data || []);
  }

  function tiempo(fecha: string) {

    const ahora = new Date();
    const publicada = new Date(fecha);

    const horas = Math.floor(
      (ahora.getTime() - publicada.getTime()) / 3600000
    );

    if (horas < 1) return "Hace unos minutos";

    if (horas < 24) return `Hace ${horas} h`;

    const dias = Math.floor(horas / 24);

    if (dias === 1) return "Ayer";

    if (dias < 30) return `Hace ${dias} días`;

    return "";
  }

  return (

    <div className="bg-zinc-900 rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        🏍 PADDOCK
      </h2>

      <div className="space-y-4">

        {noticias.slice(0, 5).map((noticia) => (

          <PaddockPost
            key={noticia.id}
            tipo={noticia.tipo}
            titulo={noticia.titulo}
            contenido={noticia.contenido}
            hora={tiempo(noticia.fecha)}
          />

        ))}

      </div>

   
<div className="flex justify-center mt-8">

  <button
    onClick={() => window.location.href = "/paddock"}
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

</div>

);
}
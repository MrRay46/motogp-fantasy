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

    const cargarNoticias = async () => {

      const hace30Dias = new Date();
      hace30Dias.setDate(hace30Dias.getDate() - 30);

      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("visible", true)
        .gte("fecha", hace30Dias.toISOString())
        .order("fecha", { ascending: false })
        .limit(5);

      if (error) {
        console.error(error);
        return;
      }

      setNoticias(data || []);

    };

    cargarNoticias();

  }, []);

  function tiempo(fecha: string) {

    const ahora = new Date();
    const publicada = new Date(fecha);

    const horas =
      (ahora.getTime() - publicada.getTime()) /
      1000 /
      60 /
      60;

    if (horas < 24)
      return "🟢 Hace unas horas";

    if (horas < 48)
      return "🟡 Ayer";

    return "⚪ Hace unos días";

  }

  return (

    <div className="bg-zinc-900 rounded-3xl p-8">

      <h2 className="text-2xl font-bold mb-6">
        🏍 PADDOCK
      </h2>

      <div className="space-y-4">

        {noticias.map((noticia) => (

          <PaddockPost
            key={noticia.id}
            tipo={noticia.tipo}
            titulo={noticia.titulo}
            hora={tiempo(noticia.fecha)}
          />

        ))}

      </div>

    </div>

  );

}
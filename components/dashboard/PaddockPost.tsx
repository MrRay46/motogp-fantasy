"use client";

import { motion } from "framer-motion";

interface Props {
  tipo: string;
  titulo: string;
  contenido: string;
  hora: string;
  piloto?: {
    nombre: string;
    miniatura: string | null;
  } | null;
}

export default function PaddockPost({
  tipo,
  titulo,
  contenido,
  hora,
  piloto = null,
}: Props) {
  function estiloTipo(tipo: string) {
    switch (tipo.toLowerCase()) {
      case "lesión":
      case "lesion":
        return {
          icono: "🩺",
          badge:
            "bg-red-500/15 text-red-300 border-red-500/30",
          card:
            "bg-red-500/5 border-red-500/20",
        };

      case "mercado":
        return {
          icono: "💰",
          badge:
            "bg-orange-500/15 text-orange-300 border-orange-500/30",
          card:
            "bg-orange-500/5 border-orange-500/20",
        };

      case "fantasy":
        return {
          icono: "⭐",
          badge:
            "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
          card:
            "bg-yellow-500/5 border-yellow-500/20",
        };

      case "motogp":
        return {
          icono: "🏁",
          badge:
            "bg-blue-500/15 text-blue-300 border-blue-500/30",
          card:
            "bg-blue-500/5 border-blue-500/20",
        };

      case "calendario":
        return {
          icono: "📅",
          badge:
            "bg-green-500/15 text-green-300 border-green-500/30",
          card:
            "bg-green-500/5 border-green-500/20",
        };

      case "rumor":
        return {
          icono: "💬",
          badge:
            "bg-purple-500/15 text-purple-300 border-purple-500/30",
          card:
            "bg-purple-500/5 border-purple-500/20",
        };

      default:
        return {
          icono: "🏍️",
          badge:
            "bg-zinc-700 text-white border-zinc-600",
          card:
            "bg-zinc-900 border-zinc-800",
        };
    }
  }

  const estilo = estiloTipo(tipo);

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 15,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      whileHover={{
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className={`
        rounded-3xl
        border
        p-6
        transition-all
        ${estilo.card}
      `}
    >
      <div className="flex flex-col sm:flex-row gap-6">

        {/* -------------------------------- */}
        {/* CONTENIDO DE LA NOTICIA */}
        {/* -------------------------------- */}

        <div className="flex-1 min-w-0">

          {/* TIPO */}

          <div
            className={`
              inline-flex
              items-center
              gap-2
              px-3
              py-1
              rounded-full
              border
              text-sm
              font-semibold
              ${estilo.badge}
            `}
          >
            <span>
              {estilo.icono}
            </span>

            <span>
              {tipo}
            </span>
          </div>

          {/* TITULO */}

          <h3 className="text-white text-xl font-bold mt-5">
            {titulo}
          </h3>

          {/* CONTENIDO */}

          <p className="text-zinc-300 leading-relaxed mt-3">
            {contenido}
          </p>

          {/* FECHA */}

          <p className="text-zinc-500 text-sm mt-6">
            {hora}
          </p>

        </div>

        {/* -------------------------------- */}
        {/* MINIATURA DEL PILOTO */}
        {/* -------------------------------- */}

        {piloto?.miniatura && (
          <div className="
            flex
            items-end
            justify-center
            sm:w-32
            shrink-0
          ">
            <img
              src={piloto.miniatura}
              alt={piloto.nombre}
              className="
                w-28
                h-28
                object-contain
                drop-shadow-lg
              "
            />
          </div>
        )}

      </div>

    </motion.article>
  );
}
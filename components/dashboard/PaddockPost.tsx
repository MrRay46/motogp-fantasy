"use client";

import { motion } from "framer-motion";

interface Props {
  tipo: string;
  titulo: string;
  hora: string;
}

export default function PaddockPost({
  tipo,
  titulo,
  hora,
}: Props) {

  return (

    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="
        border
        border-zinc-800
        rounded-2xl
        p-5
        bg-zinc-950
        hover:border-zinc-700
        hover:bg-zinc-900
        transition-all
      "
    >

      <p className="text-sm font-bold text-orange-400">
        {tipo}
      </p>

      <p className="mt-2 text-lg font-semibold">
        {titulo}
      </p>

      <p className="mt-3 text-xs text-zinc-500">
        {hora}
      </p>

    </motion.div>

  );

}
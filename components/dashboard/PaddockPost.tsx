"use client";

import { motion } from "framer-motion";

interface Props {

  tipo: string;
  titulo: string;
  contenido: string;
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

      <p className="text-orange-400 text-sm font-semibold">
  {tipo}
</p>

<h3 className="text-white font-bold mt-2">
  {titulo}
</h3>

<p className="text-zinc-400 text-sm mt-2 leading-relaxed">
  {contenido}
</p>

<p className="text-zinc-600 text-xs mt-4">
  {hora}
</p>

    </motion.div>

  );

}
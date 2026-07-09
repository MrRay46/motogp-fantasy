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

    <div className="border-b border-zinc-800 pb-4">

      <p className="text-sm font-semibold text-orange-400">
        {tipo}
      </p>

      <p className="text-white font-semibold mt-1">
        {titulo}
      </p>

      <p className="text-xs text-zinc-500 mt-2">
        {hora}
      </p>

    </div>

  );

}
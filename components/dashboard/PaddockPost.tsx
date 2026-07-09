"use client";

import { motion } from "framer-motion";

interface Props {
  icon: string;
  category: string;
  title: string;
  time: string;
}

export default function PaddockPost({
  icon,
  category,
  title,
  time,
}: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{
        scale: 1.01,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
        bg-zinc-900/70
        border
        border-zinc-800
        rounded-2xl
        p-5
        hover:border-orange-500/40
        transition-all
      "
    >
      <div className="flex items-center gap-3 mb-3">

        <span className="text-2xl">
          {icon}
        </span>

        <span className="text-orange-400 font-semibold text-sm uppercase tracking-wider">
          {category}
        </span>

      </div>

      <p className="text-lg font-semibold leading-relaxed">
        {title}
      </p>

      <p className="text-zinc-500 text-sm mt-4">
        {time}
      </p>

    </motion.article>
  );
}
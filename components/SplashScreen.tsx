"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 1.2,
          ease: "easeOut",
        }}
      >
        <Image
          src="/images/rayongrid-logo.png"
          alt="RayonGrid"
          width={260}
          height={260}
          priority
        />
      </motion.div>

      <motion.h1
        className="text-5xl font-black mt-8 text-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 0.8,
          duration: 0.6,
        }}
      >
        RAYONGRID
      </motion.h1>

      <motion.p
        className="text-zinc-400 mt-4 text-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          delay: 1.2,
          duration: 0.6,
        }}
      >
        Tu equipo. Tus decisiones. Tu campeonato.
      </motion.p>

      <div className="mt-10 w-72 h-2 bg-zinc-800 rounded-full overflow-hidden">

        <motion.div
          className="h-full bg-orange-500"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
        />

      </div>

    </div>
  );
}
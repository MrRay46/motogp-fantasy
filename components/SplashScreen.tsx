"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center z-50">

      <div className="relative mb-4">

  <motion.div
    className="absolute inset-0 rounded-full bg-orange-500 blur-3xl"
    animate={{
      scale: [1, 1.15, 1],
      opacity: [0.15, 0.35, 0.15],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    }}
  />

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
      className="relative z-10"
    />
  </motion.div>

</div>

     <motion.h1
  className="text-6xl font-black mt-8 tracking-wider"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{
    delay: 0.8,
    duration: 0.6,
  }}
>
  RAYONGRID
</motion.h1>

      <motion.p
  className="text-zinc-400 mt-4 text-xl text-center leading-relaxed"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    delay: 1.2,
    duration: 0.6,
  }}
>
  Tu equipo.<br />
  Tus decisiones.<br />
  Tu campeonato.
</motion.p>

      <div className="mt-12 w-72 h-2 rounded-full bg-zinc-800 overflow-hidden">

  <motion.div
    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-orange-500"
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
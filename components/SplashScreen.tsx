"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function SplashScreen() {
  return (
    <div className="fixed inset-0 overflow-hidden bg-black flex flex-col items-center justify-center z-50">
<div
  className="
    absolute
    inset-0
    bg-[radial-gradient(circle_at_center,#1a1a1a_0%,#000_70%)]
  "
/>

<div
  className="
    absolute
    inset-0
    opacity-[0.04]
    bg-[url('/images/carbon.png')]
    bg-repeat
  "
/>
      {/* Halo animado */}
      <motion.div
        className="absolute w-80 h-80 rounded-full bg-red-600/20 blur-[90px]"
        animate={{
          scale: [0.9, 1.1, 0.9],
          opacity: [0.2, 0.45, 0.2],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Logo */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.6,
          rotate: -8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          rotate: 0,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="relative z-10"
      >
        <Image
          src="/images/rayongrid-logo.png"
          alt="RayonGrid"
          width={300}
          height={300}
          priority
        />
      </motion.div>

      {/* Título */}
      <motion.h1
        className="
  text-4xl
  sm:text-5xl
  md:text-6xl
  font-black
  mt-8
  tracking-wide
  sm:tracking-widest
  bg-gradient-to-r
  from-white
  via-zinc-200
  to-white
  bg-clip-text
  text-transparent
  text-center
"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.8,
          duration: 0.6,
        }}
      >
        
      </motion.h1>

      {/* Eslogan */}
      <motion.p
  className="
    text-zinc-400
    mt-8
    text-base
    md:text-xl
    text-center
    tracking-wide
    px-6
  "
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{
    delay: 1.2,
    duration: 1,
  }}
>
  Tu equipo · Tus decisiones · Tu campeonato
</motion.p>

      {/* Barra */}
      <div className="mt-12 w-72 h-2 rounded-full bg-zinc-800 overflow-hidden">

        <motion.div
          className="
            h-full
            rounded-full
            bg-gradient-to-r
            from-orange-500
            via-red-500
            to-orange-500
            shadow-[0_0_25px_rgba(255,80,0,0.8)]
          "
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
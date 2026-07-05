"use client";

import Image from "next/image";

export default function SplashScreen() {
  return (
    <div
      className="
        fixed
        inset-0
        z-[9999]
        bg-black
        flex
        flex-col
        items-center
        justify-center
      "
    >
      <Image
        src="/images/raygrid-logo.png"
        alt="RayonGrid"
        width={280}
        height={280}
        priority
      />

      <h1 className="mt-6 text-5xl font-black tracking-wide text-white">
        RAYONGRID
      </h1>

      <p className="mt-3 text-zinc-400 text-lg">
        Tu equipo. Tus decisiones. Tu campeonato.
      </p>

      <div className="mt-10 w-64 h-[3px] bg-zinc-800 rounded-full overflow-hidden">
        <div
          className="
            h-full
            bg-gradient-to-r
            from-orange-500
            to-red-600
            animate-loading
          "
        />
      </div>
    </div>
  );
}
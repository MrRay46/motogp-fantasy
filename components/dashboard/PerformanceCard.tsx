"use client";

import StatCard from "./StatCard";

export default function PerformanceCard() {

  // Datos de ejemplo (los conectaremos después a Supabase)
  const posicion = 5;
  const puntos = 645;

  // Diferencia con el líder
  // Negativo = recortas
  // Positivo = te saca más
  // 0 = igual

  const diferencia = -12;

  let color: "success" | "neutral" | "danger" = "neutral";
  let mensaje = "";

  if (diferencia < 0) {

    color = "success";
    mensaje = `Has recortado ${Math.abs(diferencia)} pts al líder`;

  }

  if (diferencia > 0) {

    color = "danger";
    mensaje = `El líder te saca ${diferencia} pts más`;

  }

  return (

    <StatCard
      title="📊 Tu rendimiento"
      color={color}
    >

      <div className="text-center">

        <h2 className="text-6xl font-black">

          #{posicion}

        </h2>

        <p className="text-3xl font-bold text-white mt-3">

          {puntos} pts

        </p>

        <div className="h-8 mt-5">

          {mensaje && (

            <p className="text-sm text-zinc-300">

              {mensaje}

            </p>

          )}

        </div>

      </div>

    </StatCard>

  );

}
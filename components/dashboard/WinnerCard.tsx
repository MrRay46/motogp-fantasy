"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { circuitos } from "@/data/circuitos";
import { resultadosGP } from "@/data/resultadosGP";
import StatCard from "./StatCard";

export default function WinnerCard() {
  const [avatar, setAvatar] = useState("avatar1.png");

  const hoy = new Date();

  const ultimoGP = [...circuitos]
    .reverse()
    .find((gp) => new Date(gp.fechaFin) < hoy);

  if (!ultimoGP) return null;

  const resultado =
    resultadosGP[
      ultimoGP.id as keyof typeof resultadosGP
    ];

  useEffect(() => {
    async function cargarAvatar() {
      if (!resultado) return;

      const { data } = await supabase
        .from("usuarios")
        .select("avatar")
        .eq("usuario", resultado.equipoGP)
        .single();

      if (data?.avatar) {
        setAvatar(data.avatar);
      }
    }

    cargarAvatar();
  }, []);

  if (!resultado) return null;

  return (
    <StatCard color="gold">

      <div className="flex flex-col items-center text-center">

        <h2 className="text-lg font-semibold text-yellow-300">

          🏆 Ganador del GP {ultimoGP.nombre}

        </h2>

        <h3 className="text-4xl font-black mt-8">

          🥇 {resultado.equipoGP}

        </h3>

        <p className="text-2xl text-zinc-300 mt-2">

          {resultado.puntosEquipoGP} pts

        </p>

        <img
          src={`/avatars/${avatar}`}
          className="
            w-24
            h-24
            rounded-full
            border-4
            border-yellow-400
            object-cover
            mt-8
            shadow-lg
          "
        />

      </div>

    </StatCard>
  );
}
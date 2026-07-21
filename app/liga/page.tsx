"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/Navbar";
import FantasyRanking from "@/components/liga/FantasyRanking";
import GPHighlights from "@/components/liga/GPHighlights";
import RidersRanking from "@/components/liga/RidersRanking";
import ConstructorsRanking from "@/components/liga/ConstructorsRanking";

import { getUsuarioActual } from "@/lib/session";
import {
  obtenerDestacadosGP,
  obtenerRankingFantasy,
} from "@/services/liga";

import {
  DestacadosGP,
  RankingJugador,
} from "@/types/liga";

export default function LigaPage() {
  const [ranking, setRanking] = useState<RankingJugador[]>([]);
  const [destacadosGP, setDestacadosGP] =
    useState<DestacadosGP | null>(null);

  useEffect(() => {
    async function cargarDatos() {
      const usuario = getUsuarioActual();

      if (!usuario?.liga_actual_id) return;

      try {
        const [rankingData, destacadosData] =
          await Promise.all([
            obtenerRankingFantasy(usuario.liga_actual_id),
            obtenerDestacadosGP(),
          ]);

        setRanking(rankingData);
        setDestacadosGP(destacadosData);
      } catch (error) {
        console.error(error);
      }
    }

    cargarDatos();
  }, []);

  return (
    <>
      <Navbar />

      <main className="flex flex-col gap-6 pb-8">
        <FantasyRanking ranking={ranking} />

        <GPHighlights destacados={destacadosGP} />

        <RidersRanking />

        <ConstructorsRanking />
      </main>
    </>
  );
}
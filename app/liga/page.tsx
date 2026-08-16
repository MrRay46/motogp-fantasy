"use client";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";

import FantasyRanking from "@/components/liga/FantasyRanking";
import GPHighlights from "@/components/liga/GPHighlights";
import RidersRanking from "@/components/liga/RidersRanking";
import ConstructorsRanking from "@/components/liga/ConstructorsRanking";

export default function LigaPage() {
  const [tieneLiga, setTieneLiga] =
    useState<boolean | null>(null);

  useEffect(() => {
    const guardado =
      localStorage.getItem("usuario");

    if (!guardado) {
      setTieneLiga(false);
      return;
    }

    try {
      const usuario =
        JSON.parse(guardado);

      setTieneLiga(
        usuario.liga_actual_id !== null &&
          usuario.liga_actual_id !== undefined
      );
    } catch (error) {
      console.error(
        "Error leyendo usuario:",
        error
      );

      setTieneLiga(false);
    }
  }, []);

  if (tieneLiga === null) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Cargando clasificación...
        </p>
      </main>
    );
  }

  return (
    <AppLayout>
      <div className="flex flex-col gap-6">

        {/* ---------------------------------- */}
        {/* CLASIFICACIÓN FANTASY */}
        {/* ---------------------------------- */}

        {tieneLiga && (
          <FantasyRanking />
        )}

        {/* ---------------------------------- */}
        {/* DESTACADOS DEL GP */}
        {/* ---------------------------------- */}

        <GPHighlights />

        {/* ---------------------------------- */}
        {/* CLASIFICACIÓN OFICIAL PILOTOS */}
        {/* ---------------------------------- */}

        <RidersRanking />

        {/* ---------------------------------- */}
        {/* CLASIFICACIÓN OFICIAL CONSTRUCTORES */}
        {/* ---------------------------------- */}

        <ConstructorsRanking />

      </div>
    </AppLayout>
  );
}
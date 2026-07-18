"use client";

import Navbar from "@/components/Navbar";
import FantasyRanking from "@/components/liga/FantasyRanking";
import GPHighlights from "@/components/liga/GPHighlights";
import RidersRanking from "@/components/liga/RidersRanking";
import ConstructorsRanking from "@/components/liga/ConstructorsRanking";

export default function LigaPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10 space-y-10">

        {/* Clasificación Fantasy */}
        <FantasyRanking />

        {/* Últimos destacados del Mundial */}
        <GPHighlights />

        {/* Mundial de Pilotos */}
        <RidersRanking />

        {/* Mundial de Constructores */}
        <ConstructorsRanking />

      </section>

    </main>
  );
}
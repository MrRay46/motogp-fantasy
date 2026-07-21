"use client";

import Navbar from "@/components/Navbar";
import FantasyRanking from "@/components/liga/FantasyRanking";
import GPHighlights from "@/components/liga/GPHighlights";
import RidersRanking from "@/components/liga/RidersRanking";
import ConstructorsRanking from "@/components/liga/ConstructorsRanking";

export default function LigaPage() {
  return (
    <>
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4">
        <FantasyRanking />

        

        <RidersRanking />

        <ConstructorsRanking />
      </main>
    </>
  );
}
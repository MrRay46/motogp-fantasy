"use client";

import AppLayout from "@/components/layout/AppLayout";
import FantasyRanking from "@/components/liga/FantasyRanking";
import GPHighlights from "@/components/liga/GPHighlights";
import RidersRanking from "@/components/liga/RidersRanking";
import ConstructorsRanking from "@/components/liga/ConstructorsRanking";

export default function LigaPage() {
return (
  <AppLayout>
    <div className="flex flex-col gap-6">
      <FantasyRanking />

      <GPHighlights />

      <RidersRanking />

      <ConstructorsRanking />
    </div>
  </AppLayout>
);
}
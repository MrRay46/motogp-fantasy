"use client";

import Navbar from "@/components/Navbar";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import NextGPCard from "@/components/dashboard/NextGPCard";
import PaddockFeed from "@/components/dashboard/PaddockFeed";
import WinnerCard from "@/components/dashboard/WinnerCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">

        <GreetingHeader />

        {/* Tarjetas superiores */}
        <section className="grid gap-6 md:grid-cols-3">

          {/* Rendimiento */}
          <PerformanceCard />

          {/* Ganador del GP */}
          <WinnerCard />

          {/* Próximo GP */}
          <NextGPCard />

        </section>

        {/* PADDOCK */}
        <section className="mt-12">

          <PaddockFeed />

        </section>

      </section>

    </main>
  );
}
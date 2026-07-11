"use client";

import Navbar from "@/components/Navbar";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import StatCard from "@/components/dashboard/StatCard";
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
          

          {/* Ganador del GP */}
          <WinnerCard />

          {/* Próximo GP */}
          <StatCard title="🏁 Próximo GP">

            <div className="text-center">

              <img
                src="/circuitos/sachsenring.png"
                alt="Sachsenring"
                className="w-40 mx-auto mb-6"
              />

              <h3 className="text-3xl font-bold">
                Sachsenring
              </h3>

              <p className="text-zinc-400 mt-2">
                Alemania
              </p>

              <p className="text-orange-400 mt-1">
                10 Julio
              </p>

            </div>

          </StatCard>

        </section>

        {/* PADDOCK */}
        <section className="mt-12">

          <PaddockFeed />

        </section>

      </section>

    </main>
  );
}
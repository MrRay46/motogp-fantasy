"use client";

import Navbar from "@/components/Navbar";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import StatCard from "@/components/dashboard/StatCard";
import PaddockFeed from "@/components/dashboard/PaddockFeed";
import WinnerCard from "@/components/dashboard/WinnerCard";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">

        <GreetingHeader />

        {/* Tarjetas superiores */}
        <section className="grid gap-6 md:grid-cols-3">

          {/* Rendimiento */}
          <StatCard
            title="📊 Tu rendimiento"
            color="success"
          >

            <div className="flex justify-between items-center">

              <div>

                <p className="text-zinc-400">
                  Posición
                </p>

                <h3 className="text-5xl font-black">
                  #3
                </h3>

              </div>

              <div>

                <p className="text-zinc-400">
                  Puntos
                </p>

                <h3 className="text-5xl font-black text-green-400">
                  645
                </h3>

              </div>

            </div>

          </StatCard>

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
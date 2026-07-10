"use client";

import Navbar from "@/components/Navbar";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import StatCard from "@/components/dashboard/StatCard";
import PaddockFeed from "@/components/dashboard/PaddockFeed";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-6xl mx-auto px-6 py-14">

        <GreetingHeader />

        {/* Tarjetas superiores */}
        <section className="grid gap-6 md:grid-cols-3">

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

          <StatCard color="gold">

           <div className="flex flex-col items-center justify-center h-full text-center">

  <h3 className="text-lg font-semibold text-yellow-400">
    🏆 Ganador del GP ASSEN
  </h3>

  <div className="mt-8">

    <h2 className="text-4xl font-black">
      🥇 David
    </h2>

    <p className="text-2xl text-zinc-300 mt-2">
      92 pts
    </p>

  </div>

  <img
    src="/avatars/David.png"
    className="
      w-24
      h-24
      rounded-full
      object-cover
      border-4
      border-yellow-500
      mt-8
      shadow-lg
    "
  />

</div>
          </StatCard>

          <StatCard
            title="🏁 Próximo GP"
          >

            <div className="text-center">

              <img
                src="/circuitos/Sachsenring.png"
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
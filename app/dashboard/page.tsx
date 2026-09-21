"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import AppLayout from "@/components/layout/AppLayout";
import GreetingHeader from "@/components/dashboard/GreetingHeader";
import NextGPCard from "@/components/dashboard/NextGPCard";
import PaddockFeed from "@/components/dashboard/PaddockFeed";
import WinnerCard from "@/components/dashboard/WinnerCard";
import PerformanceCard from "@/components/dashboard/PerformanceCard";

export default function DashboardPage() {
  const router = useRouter();

  const [comprobandoSesion, setComprobandoSesion] =
    useState(true);

  useEffect(() => {
    async function comprobarSesion() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        localStorage.removeItem("usuario");
        router.replace("/login");
        return;
      }

      setComprobandoSesion(false);
    }

    comprobarSesion();
  }, [router]);

  if (comprobandoSesion) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">
          Comprobando sesión...
        </p>
      </main>
    );
  }

  return (
    <AppLayout>
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
    </AppLayout>
  );
}
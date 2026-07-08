"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import PageHeader from "@/components/ui/PageHeader";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import FeatureCard from "@/components/ui/FeatureCard";
import SplashScreen from "@/components/SplashScreen";

import {
  Trophy,
  BarChart3,
  Flag,
} from "lucide-react";

export default function Home() {

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);

    return () => clearTimeout(timer);

  }, []);

  if (loading) {
    return <SplashScreen />;
  }

  return (

    <main className="min-h-screen bg-black text-white flex flex-col items-center px-6 py-12">

      <PageHeader logoSize={300} />

      <div className="flex flex-col gap-4 w-full max-w-sm mt-12">

        <Button
          onClick={() => (window.location.href = "/login")}
        >
          Iniciar sesión →
        </Button>

        <Button
          variant="secondary"
          onClick={() => (window.location.href = "/registro")}
        >
          Crear una cuenta
        </Button>

      </div>

      <Divider />

      <section className="w-full max-w-6xl">

        <div className="grid gap-6 md:grid-cols-3">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.15,
            }}
          >
            <FeatureCard
              icon={Trophy}
              title="Compite"
              description="Crea ligas privadas y demuestra quién es el mejor manager."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.30,
            }}
          >
            <FeatureCard
              icon={BarChart3}
              title="Gestiona"
              description="Elige pilotos, controla tu presupuesto y toma las mejores decisiones."
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.45,
            }}
          >
            <FeatureCard
              icon={Flag}
              title="Vive MotoGP"
              description="Sigue toda la temporada y lucha por el campeonato con tus amigos."
            />
          </motion.div>

        </div>

      </section>

      <Divider />

      <p className="text-zinc-600 text-sm mt-10">
        v0.9 Alpha
      </p>

    </main>

  );

}
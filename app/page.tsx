"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import SplashScreen from "@/components/SplashScreen";
import { Trophy, BarChart3, Flag } from "lucide-react";
import FeatureCard from "@/components/ui/FeatureCard";


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

      <Logo size={300} />

      <p
        className="
          text-zinc-400
          text-center
          text-base
          md:text-xl
          mt-8
          max-w-xl
          tracking-wide
        "
      >
        Tu equipo · Tus decisiones · Tu campeonato
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm mt-12">

        <Button onClick={() => (window.location.href = "/login")}>
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

      <div className="max-w-6xl w-full grid md:grid-cols-3 gap-6">

        <Card>

          <div className="max-w-6xl w-full grid md:grid-cols-3 gap-6">

  <FeatureCard
    icon={Trophy}
    title="Compite"
    description="Crea ligas privadas y demuestra quién es el mejor manager."
  />

  <FeatureCard
    icon={BarChart3}
    title="Gestiona"
    description="Elige pilotos, controla tu presupuesto y toma las mejores decisiones."
  />

  <FeatureCard
    icon={Flag}
    title="Vive MotoGP"
    description="Sigue toda la temporada y lucha por el campeonato con tus amigos."
  />

</div>

        </Card>

        <Card>

          <Flag
  size={34}
  className="text-orange-500 mb-4"
/>

          <h3 className="font-bold text-xl mb-2">
            Vive MotoGP
          </h3>

          <p className="text-zinc-400">
            Sigue toda la temporada y lucha por el campeonato con tus amigos.
          </p>

        </Card>

      </div>

      <Divider />

      <p className="text-zinc-600 text-sm">
        v0.9 Alpha
      </p>

    </main>
  );
}
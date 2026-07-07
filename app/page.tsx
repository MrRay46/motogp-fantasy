"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Divider from "@/components/ui/Divider";
import SplashScreen from "@/components/SplashScreen";

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

    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12">

      <Logo size={300} />

      

      <p className="
  text-zinc-400
  text-center
  text-base
  md:text-xl
  mt-8
  max-w-xl
  tracking-wide
">
  Tu equipo · Tus decisiones · Tu campeonato
</p>

      <div className="flex flex-col gap-4 w-full max-w-sm mt-12">

        <Button
  onClick={() => window.location.href = "/login"}
>
  Iniciar sesión →
</Button>

        <Button
  variant="secondary"
  onClick={() => window.location.href = "/registro"}
>
  Crear una cuenta
</Button>

      </div>

      <div className="mt-16 max-w-4xl grid md:grid-cols-3 gap-6">
<Divider />
        <Card>

  <h2 className="text-3xl mb-4">
    🏆
  </h2>

  <h3 className="font-bold text-xl mb-2">
    Compite
  </h3>

  <p className="text-zinc-400">
    Crea ligas privadas y demuestra quién es el mejor manager.
  </p>

</Card>
<Divider />
        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

          <h2 className="text-2xl mb-3">📊</h2>

          <h3 className="font-bold text-xl mb-2">
            Gestiona
          </h3>

          <p className="text-zinc-400">
            Elige pilotos, controla tu presupuesto y toma las mejores decisiones.
          </p>

        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">

          <h2 className="text-2xl mb-3">🏁</h2>

          <h3 className="font-bold text-xl mb-2">
            Vive MotoGP
          </h3>

          <p className="text-zinc-400">
            Sigue toda la temporada y lucha por el campeonato con tus amigos.
          </p>

        </div>

      </div>

      <p className="mt-16 text-zinc-600 text-sm">
        v0.9 Alpha
      </p>

    </main>

  );
}
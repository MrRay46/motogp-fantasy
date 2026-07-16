"use client";

import { useEffect, useState } from "react";
import CreateLeagueForm from "@/components/auth/CreateLeagueForm";

export default function CrearLigaPage() {
  const [usuario, setUsuario] = useState<any>(null);

  useEffect(() => {
    const guardado = localStorage.getItem("usuario");

    if (guardado) {
      setUsuario(JSON.parse(guardado));
    }
  }, []);

  if (!usuario) return null;

  return (
    <main className="min-h-screen bg-black flex items-center justify-center">
      <CreateLeagueForm usuario={usuario} />
    </main>
  );
}
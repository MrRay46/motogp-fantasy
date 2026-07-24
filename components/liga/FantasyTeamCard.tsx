"use client";

import { useEffect, useState } from "react";

import { obtenerEquipoFantasy } from "@/services/liga";
import { EquipoFantasy } from "@/types/liga";

interface Props {
  jugadorId: number;
}

export default function FantasyTeamCard({
  jugadorId,
}: Props) {
  const [equipo, setEquipo] = useState<EquipoFantasy | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarEquipo() {
      try {
        const datos = await obtenerEquipoFantasy(jugadorId);
        setEquipo(datos);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    cargarEquipo();
  }, [jugadorId]);

  if (loading) {
    return (
      <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
        Cargando equipo...
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="mt-2 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-300">
        No se pudo cargar el equipo.
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

      <h3 className="mb-3 font-semibold text-white">
        ⚪ TITULARES
      </h3>

      <div className="space-y-1">
        {equipo.titulares.map((piloto) => (
          <p key={piloto} className="text-zinc-300">
            {piloto}
          </p>
        ))}
      </div>

      <div className="my-4 border-t border-zinc-800" />

      <h3 className="mb-2 font-semibold text-orange-400">
        🟠 RESERVA
      </h3>

      <p className="text-zinc-300">
        {equipo.reserva}
      </p>

      <div className="my-4 border-t border-zinc-800" />

      <h3 className="mb-2 font-semibold text-blue-400">
        🔵 MOTOR
      </h3>

      <p className="text-zinc-300">
        {equipo.motor}
      </p>

      <div className="my-4 border-t border-zinc-800" />

      <h3 className="mb-3 font-semibold text-white">
        🎯 PREDICCIONES
      </h3>

      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">
            Piloto campeón
          </span>

          <span>
            {equipo.pilotoModificada ? "🟡" : "🟢"}
          </span>
        </div>

        <p className="text-zinc-300">
          {equipo.prediccionPiloto}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">
            Constructor
          </span>

          <span>
            {equipo.motorModificada ? "🟡" : "🟢"}
          </span>
        </div>

        <p className="text-zinc-300">
          {equipo.prediccionMotor}
        </p>

      </div>

    </div>
  );
}
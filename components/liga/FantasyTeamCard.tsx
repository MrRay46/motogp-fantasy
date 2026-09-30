"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

import { EquipoFantasy } from "@/types/liga";

interface Props {
  jugadorId: number;
  ligaId: number;
}

export default function FantasyTeamCard({
  jugadorId,
  ligaId,
}: Props) {
  const [equipo, setEquipo] =
    useState<EquipoFantasy | null>(null);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function cargarEquipo() {
      try {
        setLoading(true);

        // --------------------------------------------------
        // OBTENER SESIÓN AUTENTICADA
        // --------------------------------------------------

        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (
          sessionError ||
          !session?.access_token
        ) {
          console.error(
            "No hay una sesión autenticada para cargar el equipo.",
            sessionError
          );

          setEquipo(null);
          return;
        }

        // --------------------------------------------------
        // CARGAR EQUIPO MEDIANTE API SEGURA
        // --------------------------------------------------

        const respuesta = await fetch(
          `/api/equipo/miembro?jugador_id=${encodeURIComponent(
            jugadorId
          )}&liga_id=${encodeURIComponent(
            ligaId
          )}`,
          {
            method: "GET",
            headers: {
              Authorization:
                `Bearer ${session.access_token}`,
            },
          }
        );

        const resultado =
          await respuesta
            .json()
            .catch(() => null);

        if (!respuesta.ok) {
          console.error(
            "Error cargando equipo del jugador:",
            resultado?.error ??
              respuesta.statusText
          );

          setEquipo(null);
          return;
        }

        setEquipo(
          resultado?.equipo ?? null
        );
      } catch (error) {
        console.error(
          "Error cargando equipo del jugador:",
          error
        );

        setEquipo(null);
      } finally {
        setLoading(false);
      }
    }

    cargarEquipo();
  }, [jugadorId, ligaId]);

  if (loading) {
    return (
      <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
        Cargando equipo...
      </div>
    );
  }

  if (!equipo) {
    return (
      <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4 text-zinc-400">
        Este jugador todavía no tiene equipo en esta liga.
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">

      {/* TITULARES */}

      <h3 className="mb-3 font-semibold text-white">
        ⚪ TITULARES
      </h3>

      {equipo.titulares.length > 0 ? (
        <div className="space-y-1">
          {equipo.titulares.map((piloto) => (
            <p
              key={piloto}
              className="text-zinc-300"
            >
              {piloto}
            </p>
          ))}
        </div>
      ) : (
        <p className="text-zinc-500">
          Sin pilotos seleccionados.
        </p>
      )}

      <div className="my-4 border-t border-zinc-800" />

      {/* RESERVA */}

      <h3 className="mb-2 font-semibold text-orange-400">
        🟠 RESERVA
      </h3>

      <p className="text-zinc-300">
        {equipo.reserva || "Sin reserva"}
      </p>

      <div className="my-4 border-t border-zinc-800" />

      {/* MOTOR */}

      <h3 className="mb-2 font-semibold text-blue-400">
        🔵 MOTOR
      </h3>

      <p className="text-zinc-300">
        {equipo.motor || "Sin motor"}
      </p>

      <div className="my-4 border-t border-zinc-800" />

      {/* PREDICCIONES */}

      <h3 className="mb-3 font-semibold text-white">
        🎯 PREDICCIONES
      </h3>

      <div className="space-y-3">

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">
            Piloto campeón
          </span>

          <span>
            {equipo.pilotoModificada
              ? "🟡"
              : "🟢"}
          </span>
        </div>

        <p className="text-zinc-300">
          {equipo.prediccionPiloto ||
            "Sin predicción"}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-zinc-400">
            Constructor
          </span>

          <span>
            {equipo.motorModificada
              ? "🟡"
              : "🟢"}
          </span>
        </div>

        <p className="text-zinc-300">
          {equipo.prediccionMotor ||
            "Sin predicción"}
        </p>

      </div>

    </div>
  );
}
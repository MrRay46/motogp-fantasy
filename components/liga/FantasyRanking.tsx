"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type RankingJugador = {
  id: number;
  usuario: string;
  avatar: string;
  puntos: number;
  posicionAnterior: number;
};

export default function FantasyRanking() {
  const [ranking, setRanking] = useState<RankingJugador[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarRanking();
  }, []);

  async function cargarRanking() {
    setLoading(true);

    const sesion = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    if (!sesion.liga_actual_id) {
      setLoading(false);
      return;
    }

    // Miembros de la liga
    const { data: relaciones, error: errorRelaciones } =
      await supabase
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("liga_id", sesion.liga_actual_id);

    if (errorRelaciones || !relaciones) {
      console.error(errorRelaciones);
      setLoading(false);
      return;
    }

    const ids = relaciones.map((r) => r.usuario_id);

    // Datos de usuarios
    const { data: usuarios, error: errorUsuarios } =
      await supabase
        .from("usuarios")
        .select("id,usuario,avatar")
        .in("id", ids);

    if (errorUsuarios || !usuarios) {
      console.error(errorUsuarios);
      setLoading(false);
      return;
    }

    // Datos de equipos
    const { data: equipos, error: errorEquipos } =
      await supabase
        .from("equipos")
        .select("usuario,puntos,posicion_anterior");

    if (errorEquipos || !equipos) {
      console.error(errorEquipos);
      setLoading(false);
      return;
    }

    const resultado: RankingJugador[] = usuarios.map((u) => {
      const equipo = equipos.find(
        (e) => e.usuario === u.usuario
      );

      return {
        id: u.id,
        usuario: u.usuario,
        avatar: u.avatar,
        puntos: equipo?.puntos ?? 0,
        posicionAnterior:
          equipo?.posicion_anterior ?? 0,
      };
    });

    resultado.sort((a, b) => b.puntos - a.puntos);

    setRanking(resultado);
    setLoading(false);
  }

  const usuarioActual = JSON.parse(
    localStorage.getItem("usuario") || "{}"
  ).usuario;

  return (
    <section className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">
      <h2 className="text-3xl font-black mb-6">
        🏆 Clasificación Fantasy
      </h2>

      {loading ? (
        <p className="text-zinc-400">
          Cargando clasificación...
        </p>
      ) : (
        <div className="space-y-3">
          {ranking.slice(0, 7).map((jugador, index) => {
            const posicion = index + 1;

            let movimiento = "➖";

            if (jugador.posicionAnterior > 0) {
              if (
                posicion < jugador.posicionAnterior
              ) {
                movimiento = "▲";
              } else if (
                posicion > jugador.posicionAnterior
              ) {
                movimiento = "▼";
              }
            }

            return (
              <div
                key={jugador.id}
                className={`flex items-center justify-between rounded-2xl px-5 py-4 transition ${
                  jugador.usuario === usuarioActual
                    ? "bg-orange-500/20 border border-orange-500"
                    : "bg-zinc-800 border border-zinc-700"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="w-10 text-2xl text-center">
                    {posicion === 1 && "🥇"}
                    {posicion === 2 && "🥈"}
                    {posicion === 3 && "🥉"}
                    {posicion > 3 && `#${posicion}`}
                  </span>

                  <img
                    src={`/avatars/${jugador.avatar}`}
                    alt={jugador.usuario}
                    className="w-10 h-10 rounded-full border border-zinc-700"
                  />

                  <span className="font-bold text-lg">
                    {jugador.usuario}
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-bold text-xl">
                    {jugador.puntos} pts
                  </span>

                  {movimiento === "▲" && (
                    <span className="text-green-400 text-xl">
                      ▲
                    </span>
                  )}

                  {movimiento === "▼" && (
                    <span className="text-red-400 text-xl">
                      ▼
                    </span>
                  )}

                  {movimiento === "➖" && (
                    <span className="text-zinc-500 text-xl">
                      ➖
                    </span>
                  )}
                </div>
              </div>
            );
          })}

          {ranking.length > 7 && (
            <div className="pt-4 text-center">
              <button className="text-orange-400 hover:text-orange-300 font-bold transition">
                Ver clasificación completa →
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
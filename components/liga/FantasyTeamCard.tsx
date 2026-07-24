"use client";

interface Props {
  jugadorId: number;
}

export default function FantasyTeamCard({
  jugadorId,
}: Props) {
  return (
    <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
      <p className="text-zinc-400">
        Equipo del jugador {jugadorId}
      </p>
    </div>
  );
}
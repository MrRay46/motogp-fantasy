import {
  Piloto,
  MarketPilotActions,
  MarketPilotState,
} from "./types";

type PilotCardProps = {
  piloto: Piloto;
  estado: MarketPilotState;
  acciones: MarketPilotActions;
};

export default function PilotCard({
  piloto,
  estado,
  acciones,
}: PilotCardProps) {
  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-red-500/20 transition-all duration-300">
      <div className="relative">
        <img
          src={piloto.foto}
          alt={piloto.nombre}
          loading="lazy"
          className="w-full h-72 object-contain bg-gradient-to-b from-zinc-900 to-black p-4"
        />

        <div className="absolute top-4 left-4">
          <img
            src={piloto.logoEquipo}
            alt={piloto.equipo}
            loading="lazy"
            className="w-14 h-14 object-contain"
          />
        </div>

        <div className="absolute bottom-4 left-4">
          <h2 className="text-3xl font-black">
            {piloto.nombre}
          </h2>
        </div>
      </div>

      <div className="p-5">
        <div className="flex justify-between text-lg">
          <p>🏆 {piloto.puntos} pts</p>
          <p>💰 {piloto.precio} M</p>
        </div>

        <div className="mt-5 flex gap-3 flex-wrap">
          <button
            type="button"
            disabled={!estado.puedeFichar}
            onClick={acciones.fichar}
            className={`px-4 py-2 rounded-xl font-bold transition ${
              estado.fichado
                ? "bg-red-600"
                : "bg-red-500 hover:bg-red-400"
            }`}
          >
            {estado.fichado
              ? "Quitar ❌"
              : "Fichar"}
          </button>

          {estado.fichado && (
            <button
              type="button"
              disabled={!estado.puedeReserva}
              onClick={acciones.reserva}
              className={`px-4 py-2 rounded-xl font-bold transition ${
                estado.reserva
                  ? "bg-blue-600"
                  : "bg-blue-500 hover:bg-blue-400"
              }`}
            >
              {estado.reserva
                ? "Reserva ✅"
                : "Reserva"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
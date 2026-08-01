import PilotCard from "./PilotCard";
import { Piloto } from "./types";

type PilotsMarketProps = {
  pilotos: Piloto[];
  fichados: string[];
  reserva: string | null;
  mercadoAbierto: boolean;

  onFichar: (piloto: Piloto) => void;
  onReserva: (piloto: Piloto) => void;
};

export default function PilotsMarket({
  pilotos,
  fichados,
  reserva,
  mercadoAbierto,
  onFichar,
  onReserva,
}: PilotsMarketProps) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {pilotos.map((piloto) => {
        const fichado = fichados.includes(
          piloto.nombre
        );

        const esReserva =
          reserva === piloto.nombre;

        return (
          <PilotCard
            key={piloto.nombre}
            piloto={piloto}
            estado={{
              fichado,
              reserva: esReserva,
              puedeFichar:
                mercadoAbierto &&
                (!fichado || esReserva),
              puedeReserva:
                mercadoAbierto &&
                fichado &&
                !esReserva,
            }}
            acciones={{
              fichar: () =>
                onFichar(piloto),

              reserva: () =>
                onReserva(piloto),
            }}
          />
        );
      })}
    </div>
  );
}
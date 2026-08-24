import PilotCard from "./PilotCard";
import { Piloto } from "./types";

type PilotsMarketProps = {
  pilotos: Piloto[];

  fichados: string[];
  reserva: string | null;

  puedeFichar: boolean;
  puedeQuitar: boolean;
  puedeElegirReserva: boolean;

  onFichar: (piloto: Piloto) => void;
  onReserva: (piloto: Piloto) => void;
};

export default function PilotsMarket({
  pilotos,
  fichados,
  reserva,
  puedeFichar,
  puedeQuitar,
  puedeElegirReserva,
  onFichar,
  onReserva,
}: PilotsMarketProps) {
  return (
    <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
      {pilotos.map((piloto) => {
        const fichado = fichados.includes(piloto.nombre);
        const esReserva = reserva === piloto.nombre;

        const puedeModificarPiloto = fichado
          ? puedeQuitar
          : puedeFichar;

        const puedeConvertirEnReserva =
          fichado &&
          !esReserva &&
          puedeElegirReserva;

        return (
          <PilotCard
            key={piloto.nombre}
            piloto={piloto}
            estado={{
              fichado,
              reserva: esReserva,
              puedeFichar: puedeModificarPiloto,
              puedeReserva: puedeConvertirEnReserva,
            }}
            acciones={{
              fichar: () => onFichar(piloto),
              reserva: () => onReserva(piloto),
            }}
          />
        );
      })}
    </div>
  );
}
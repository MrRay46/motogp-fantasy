import GridSlot from "./GridSlot";

type PilotoGrid = {
  nombre: string;
  foto: string;
  miniatura: string;
};

type StartingGridProps = {
  titulares: PilotoGrid[];
  reserva: PilotoGrid | null;
};

export default function StartingGrid({
  titulares,
  reserva,
}: StartingGridProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6 md:p-8">

      <h2 className="mb-8 text-center text-3xl font-bold text-white">
        🏁 Mi Parrilla
      </h2>

      <div className="grid grid-cols-3 gap-x-10 gap-y-8 justify-items-center">

        {titulares.slice(0, 3).map((piloto) => (
          <GridSlot
            key={piloto.nombre}
            piloto={piloto}
            tipo="titular"
          />
        ))}

        {titulares.slice(3, 5).map((piloto) => (
          <GridSlot
            key={piloto.nombre}
            piloto={piloto}
            tipo="titular"
          />
        ))}

        {reserva && (
          <GridSlot
            piloto={reserva}
            tipo="reserva"
          />
        )}

      </div>

    </section>
  );
}
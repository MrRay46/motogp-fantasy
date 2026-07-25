import GridSlot from "./GridSlot";

type Props = {
  titulares: {
    nombre: string;
    foto: string;
  }[];

  reserva?: {
    nombre: string;
    foto: string;
  };
};

export default function StartingGrid({
  titulares,
  reserva,
}: Props) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-8">

      <h2 className="mb-10 text-center text-3xl font-bold text-white">
        🏁 Mi Parrilla
      </h2>

      <div className="grid grid-cols-3 gap-y-12">

        {titulares.map((piloto) => (
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
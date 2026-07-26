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
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-3 py-6 md:p-8">
      <div className="flex justify-center items-start gap-4 md:gap-14">
        {/* Columna izquierda */}
        <div className="flex flex-col gap-6 md:gap-8">
          <GridSlot piloto={titulares[0]} tipo="titular" />
          <GridSlot piloto={titulares[3]} tipo="titular" />
        </div>

        {/* Columna central */}
        <div className="mt-4 md:mt-6 flex flex-col gap-6 md:gap-8">
          <GridSlot piloto={titulares[1]} tipo="titular" />
          <GridSlot piloto={titulares[4]} tipo="titular" />
        </div>

        {/* Columna derecha */}
        <div className="mt-8 md:mt-12 flex flex-col gap-6 md:gap-8">
          <GridSlot piloto={titulares[2]} tipo="titular" />

          {reserva && (
            <GridSlot piloto={reserva} tipo="reserva" />
          )}
        </div>
      </div>
    </section>
  );
}
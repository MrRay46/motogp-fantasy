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
  const parrilla = [
    ...titulares.slice(0, 5).map((piloto) => ({
      piloto,
      tipo: "titular" as const,
    })),
    ...(reserva
      ? [
          {
            piloto: reserva,
            tipo: "reserva" as const,
          },
        ]
      : []),
  ];

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 px-3 py-6 md:p-8">
      <div
        className="
          grid
          grid-cols-3
          gap-x-3
          md:gap-x-10
          gap-y-6
          md:gap-y-8
          justify-items-center
        "
      >
        {parrilla.map(({ piloto, tipo }, index) => {
          const columna = index % 3;

          const offset =
            columna === 0
              ? ""
              : columna === 1
              ? "translate-x-1 translate-y-1 md:translate-x-2 md:translate-y-1"
              : "translate-x-2 translate-y-2 md:translate-x-4 md:translate-y-2";

          return (
            <div key={piloto.nombre} className={offset}>
              <GridSlot piloto={piloto} tipo={tipo} />
            </div>
          );
        })}
      </div>
    </section>
  );
}
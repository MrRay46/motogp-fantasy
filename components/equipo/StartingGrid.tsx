type PilotoGrid = {
  nombre: string;
  foto: string;
};

type GridSlotProps = {
  piloto: PilotoGrid;
  tipo: "titular" | "reserva";
};

export default function GridSlot({
  piloto,
  tipo,
}: GridSlotProps) {
  const borderColor =
    tipo === "reserva"
      ? "border-orange-500"
      : "border-white";

  return (
    <div className="flex flex-col items-center">

      {/* Cajón de salida */}
      <div
        className={`
          w-32
          h-8
          border-t-4
          border-l-4
          border-r-4
          rounded-t-md
          ${borderColor}
        `}
      />

      {/* Piloto */}
      <img
        src={piloto.foto}
        alt={piloto.nombre}
        className="
          -mt-5
          h-24
          object-contain
          select-none
          pointer-events-none
        "
        draggable={false}
      />

      {/* Nombre */}
      <p className="mt-2 text-center text-sm font-semibold text-white leading-tight">
        {piloto.nombre}
      </p>

    </div>
  );
}
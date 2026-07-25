type PilotoGrid = {
  nombre: string;
  foto: string;
  miniatura: string;
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

      {/* Cajón */}
      <div
        className={`
          w-36
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
        src={piloto.miniatura}
        alt={piloto.nombre}
        className="
          -mt-4
          h-28
          object-contain
          select-none
          pointer-events-none
        "
        draggable={false}
      />

      {/* Nombre */}
      <p className="mt-1 text-center text-base font-semibold text-white">
        {piloto.nombre}
      </p>

    </div>
  );
}
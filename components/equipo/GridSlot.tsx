type GridSlotProps = {
  piloto: {
    nombre: string;
    foto: string;
  };

  tipo: "titular" | "reserva";
};

export default function GridSlot({
  piloto,
  tipo,
}: GridSlotProps) {
  const colorLinea =
    tipo === "reserva"
      ? "border-orange-500"
      : "border-white";

  return (
    <div className="flex flex-col items-center">

      {/* Línea de parrilla */}
      <div
        className={`
          w-32
          h-8
          border-t-4
          border-l-4
          border-r-4
          rounded-t-md
          ${colorLinea}
        `}
      />

      {/* Miniatura */}
      <div className="-mt-4">
        <img
          src={piloto.foto}
          alt={piloto.nombre}
          className="
            h-20
            object-contain
            drop-shadow-xl
            select-none
          "
        />
      </div>

      {/* Nombre */}
      <p className="mt-2 text-center text-sm font-semibold text-white">
        {piloto.nombre}
      </p>

    </div>
  );
}
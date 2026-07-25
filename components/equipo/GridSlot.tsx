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
    w-28
    md:w-36
    h-7
    md:h-8
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
    md:-mt-5
    h-20
    md:h-28
    object-contain
    select-none
    pointer-events-none
  "
  draggable={false}
/>

      {/* Nombre */}
      <p
  className="
    mt-1
    text-center
    text-sm
    md:text-base
    font-semibold
    text-white
    leading-tight
  "
>
  {piloto.nombre}
</p>

    </div>
  );
}
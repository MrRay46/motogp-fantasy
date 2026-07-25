type Motor = {
  nombre: string;
  logo: string;
};

type MotorCardProps = {
  motor: Motor | null;
  puntos: number;
};

export default function MotorCard({
  motor,
}: MotorCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-5">

      <h2 className="mb-4 text-xl font-bold text-white">
        🏍 Motor
      </h2>

      {motor ? (
        <div className="flex items-center justify-center gap-7">

          <img
            src={motor.logo}
            alt={motor.nombre}
            className="h-20 w-20 md:h-24 md:w-24 object-contain"
          />

          <span className="text-2xl md:text-3xl font-bold text-white">
            {motor.nombre}
          </span>

        </div>
      ) : (
        <p className="text-zinc-500 text-center">
          No hay motor seleccionado.
        </p>
      )}

    </section>
  );
}
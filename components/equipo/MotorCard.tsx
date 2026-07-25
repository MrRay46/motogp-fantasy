type Motor = {
  nombre: string;
  logo: string;
  precio: number;
};

type MotorCardProps = {
  motor: Motor | null;
  puntos: number;
};

export default function MotorCard({
  motor,
  puntos,
}: MotorCardProps) {
  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">

      <h2 className="mb-6 text-2xl font-bold text-blue-400">
         Motor
      </h2>

      {motor ? (
        <div className="flex items-center gap-6">

          <img
            src={motor.logo}
            alt={motor.nombre}
            className="h-20 w-20 object-contain"
          />

          <div className="flex-1">

            <h3 className="text-2xl font-bold text-white">
              {motor.nombre}
            </h3>

            <div className="mt-3 flex gap-6 text-sm text-zinc-300">

              <span>
                🏆 {puntos} pts
              </span>

              <span>
                💰 {motor.precio} M
              </span>

            </div>

          </div>

        </div>
      ) : (
        <p className="text-zinc-500">
          No hay motor seleccionado.
        </p>
      )}

    </section>
  );
}
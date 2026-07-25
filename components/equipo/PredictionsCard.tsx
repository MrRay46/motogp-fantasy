import { motores } from "@/data/motores";
import { pilotos } from "@/data/pilotos";

type PredictionsCardProps = {
  piloto: string | null;
  motor: string | null;

  pilotoModificado: boolean;
  motorModificado: boolean;
};

export default function PredictionsCard({
  piloto,
  motor,
  pilotoModificado,
  motorModificado,
}: PredictionsCardProps) {
  const pilotoPredicho = pilotos.find(
    (p) => p.nombre === piloto
  );

  const motorPredicho = motores.find(
    (m) => m.nombre === motor
  );

  return (
    <section className="rounded-3xl border border-zinc-800 bg-zinc-900/40 p-6">

      <h2 className="mb-6 text-2xl font-bold text-yellow-400">
        🎯 Predicciones
      </h2>

      <div className="space-y-4">

        {/* Campeón */}

        <div
  className={`
    rounded-2xl
    p-4
    transition-colors
    ${
      pilotoModificado
        ? "border border-yellow-500/40 bg-yellow-900/10"
        : "border border-green-500/40 bg-green-900/10"
    }
  `}
>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Campeón del Mundo
          </p>

          {pilotoPredicho ? (
            <div className="flex items-center gap-4">

              <img
                src={pilotoPredicho.foto}
                alt={pilotoPredicho.nombre}
                className="h-16 w-16 object-contain"
              />

              <p className="text-lg font-bold text-white">
                {pilotoPredicho.nombre}
              </p>

            </div>
          ) : (
            <p className="text-zinc-500">
              Sin predicción
            </p>
          )}

        </div>

        {/* Constructor */}

        <div
  className={`
    rounded-2xl
    p-4
    transition-colors
    ${
      motorModificado
        ? "border border-yellow-500/40 bg-yellow-900/10"
        : "border border-green-500/40 bg-green-900/10"
    }
  `}
>

          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-400">
            Constructor Campeón
          </p>

          {motorPredicho ? (
            <div className="flex items-center gap-4">

              <img
                src={motorPredicho.logo}
                alt={motorPredicho.nombre}
                className="h-16 w-16 object-contain"
              />

              <p className="text-lg font-bold text-white">
                {motorPredicho.nombre}
              </p>

            </div>
          ) : (
            <p className="text-zinc-500">
              Sin predicción
            </p>
          )}

        </div>

      </div>

    </section>
  );
}
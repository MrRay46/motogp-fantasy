import {
  Constructor,
  Piloto,
} from "./types";

type SeasonPredictionsProps = {
  pilotos: Piloto[];
  constructores: Constructor[];

  prediccionPiloto: string | null;
  prediccionConstructor: string | null;

  puedeCambiarPredicciones: boolean;

  onSeleccionarPiloto: (
    piloto: string
  ) => void;

  onSeleccionarConstructor: (
    constructor: string
  ) => void;
};

export default function SeasonPredictions({
  pilotos,
  constructores,
  prediccionPiloto,
  prediccionConstructor,
  puedeCambiarPredicciones,
  onSeleccionarPiloto,
  onSeleccionarConstructor,
}: SeasonPredictionsProps) {
  return (
    <>
      <h2 className="text-4xl font-bold mt-16 mb-6">
        🎯 Predicciones Temporada
      </h2>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            🏆 Piloto Campeón
          </h3>

          <div className="flex flex-wrap gap-3">
            {pilotos.map((piloto) => (
              <button
                key={piloto.nombre}
                type="button"
                disabled={!puedeCambiarPredicciones}
                onClick={() =>
                  onSeleccionarPiloto(
                    piloto.nombre
                  )
                }
                className={`px-4 py-2 rounded-xl transition ${
                  prediccionPiloto ===
                  piloto.nombre
                    ? "bg-green-500"
                    : puedeCambiarPredicciones
                    ? "bg-zinc-800 hover:bg-zinc-700"
                    : "bg-zinc-700 opacity-50 cursor-not-allowed"
                }`}
              >
                {piloto.nombre}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">
          <h3 className="text-2xl font-bold mb-4">
            🏍️ Constructor Campeón
          </h3>

          <div className="flex flex-wrap gap-3">
            {constructores.map(
              (constructor) => (
                <button
                  key={constructor.nombre}
                  type="button"
                  disabled={
                    !puedeCambiarPredicciones
                  }
                  onClick={() =>
                    onSeleccionarConstructor(
                      constructor.nombre
                    )
                  }
                  className={`px-4 py-2 rounded-xl transition ${
                    prediccionConstructor ===
                    constructor.nombre
                      ? "bg-green-500"
                      : puedeCambiarPredicciones
                      ? "bg-zinc-800 hover:bg-zinc-700"
                      : "bg-zinc-700 opacity-50 cursor-not-allowed"
                  }`}
                >
                  {constructor.nombre}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}
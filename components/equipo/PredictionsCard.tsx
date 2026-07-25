export default function PredictionsCard() {
  return (
    <section className="rounded-2xl bg-zinc-900 p-5">

      <h3 className="mb-4 text-lg font-semibold text-yellow-400">
        🎯 Predicciones
      </h3>

      <div className="space-y-3">

        <div className="rounded-xl bg-green-900/20 border border-green-700 p-3">
          Campeón
        </div>

        <div className="rounded-xl bg-yellow-900/20 border border-yellow-700 p-3">
          Constructor
        </div>

      </div>

    </section>
  );
}
import PaddockPost from "./PaddockPost";

export default function PaddockFeed() {
  return (
    <div className="bg-zinc-900 rounded-3xl p-8 border border-zinc-800">

      <h2 className="text-2xl font-bold mb-8">
        🏍 PADDOCK
      </h2>

      <div className="space-y-4">

        <PaddockPost
          icon="🩺"
          category="Lesión"
          title="Jorge Martín será baja este GP."
          time="Hace 1 h"
        />

        <PaddockPost
          icon="🟠"
          category="Rumor"
          title="Pedro Acosta podría cambiar de fabricante."
          time="Hace 3 h"
        />

        <PaddockPost
          icon="🏁"
          category="Oficial"
          title="Ducati confirma la evolución del motor para Sachsenring."
          time="Hace 5 h"
        />

      </div>

      <button
        className="
          mt-8
          text-orange-400
          hover:text-orange-300
          font-semibold
          transition-colors
        "
      >
        Ver todas las noticias →
      </button>

    </div>
  );
}
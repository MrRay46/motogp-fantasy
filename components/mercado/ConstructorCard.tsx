import {
  Constructor,
  MarketConstructorActions,
  MarketConstructorState,
} from "./types";

type ConstructorCardProps = {
  constructor: Constructor;
  estado: MarketConstructorState;
  acciones: MarketConstructorActions;
};

export default function ConstructorCard({
  constructor,
  estado,
  acciones,
}: ConstructorCardProps) {
  return (
    <div className="bg-zinc-900/70 backdrop-blur-xl border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl hover:scale-[1.03] hover:shadow-red-500/20 transition-all duration-300">
      <div className="flex flex-col items-center p-8">
        <img
          src={constructor.logo}
          alt={constructor.nombre}
          loading="lazy"
          className="w-28 h-28 object-contain mb-6"
        />

        <h2 className="text-3xl font-black text-center">
          {constructor.nombre}
        </h2>

        <p className="mt-4 text-lg">
          💰 {constructor.precio} M
        </p>

        <button
          type="button"
          disabled={!estado.puedeSeleccionar}
          onClick={acciones.seleccionar}
          className={`mt-8 w-full rounded-xl px-6 py-3 font-bold transition ${
            estado.seleccionado
              ? "bg-green-600"
              : "bg-red-500 hover:bg-red-400"
          } ${
            !estado.puedeSeleccionar
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
        >
          {estado.seleccionado
            ? "Seleccionado ✅"
            : "Seleccionar"}
        </button>
      </div>
    </div>
  );
}
import ConstructorCard from "./ConstructorCard";
import { Constructor } from "./types";

type ConstructorsMarketProps = {
  constructores: Constructor[];

  constructorSeleccionado: string | null;

  mercadoAbierto: boolean;

  onSeleccionar: (
    constructor: Constructor
  ) => void;
};

export default function ConstructorsMarket({
  constructores,
  constructorSeleccionado,
  mercadoAbierto,
  onSeleccionar,
}: ConstructorsMarketProps) {
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
      {constructores.map(
        (constructor) => {
          const seleccionado =
            constructor.nombre ===
            constructorSeleccionado;

          return (
            <ConstructorCard
              key={constructor.nombre}
              constructor={
                constructor
              }
              estado={{
                seleccionado,
                puedeSeleccionar:
                  mercadoAbierto,
              }}
              acciones={{
                seleccionar: () =>
                  onSeleccionar(
                    constructor
                  ),
              }}
            />
          );
        }
      )}
    </div>
  );
}
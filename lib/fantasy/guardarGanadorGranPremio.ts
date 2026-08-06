import { supabase } from "@/lib/supabase";
import { ResultadoEquipoGP } from "./calcularPuntosEquipos";

export async function guardarGanadorGranPremio(
  granPremioId: number,
  resultados: ResultadoEquipoGP[]
) {
  if (resultados.length === 0) {
    throw new Error(
      "No hay resultados para calcular el ganador del GP."
    );
  }

  const ganador = [...resultados].sort(
    (a, b) =>
      (b.puntosGP + b.bonusGP) -
      (a.puntosGP + a.bonusGP)
  )[0];

  const { error } = await supabase
    .from("grandes_premios")
    .update({
      ganador_fantasy_equipo_id:
        ganador.equipoId,

      ganador_fantasy_puntos:
        ganador.puntosGP +
        ganador.bonusGP,
    })
    .eq("id", granPremioId);

  if (error) {
    throw new Error(
      `Error guardando ganador del GP: ${error.message}`
    );
  }
}
import { supabase } from "@/lib/supabase";
import { ResultadoEquipoGP } from "./calcularPuntosEquipos";

export async function guardarResultados(
  resultados: ResultadoEquipoGP[]
) {
  for (const resultado of resultados) {
    const { error } = await supabase
      .from("equipos")
      .update({
        puntos_gp_actual: resultado.puntosGP,
        bonus_gp: resultado.bonusGP,
      })
      .eq("id", resultado.equipoId);

    if (error) {
      throw new Error(
        `Error actualizando equipo ${resultado.equipoId}: ${error.message}`
      );
    }
  }
}
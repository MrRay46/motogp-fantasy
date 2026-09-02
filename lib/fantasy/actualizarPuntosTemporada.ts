import { supabase } from "@/lib/supabase";

type Equipo = {
  id: number;
  puntos: number | null;
  puntos_gp_actual: number | null;
};

export async function actualizarPuntosTemporada() {
  const { data: equipos, error } = await supabase
    .from("equipos")
    .select(`
      id,
      puntos,
      puntos_gp_actual
    `);

  if (error) {
    throw new Error(
      `Error leyendo equipos: ${error.message}`
    );
  }

  for (const equipo of equipos as Equipo[]) {
    const nuevosPuntos =
      (equipo.puntos ?? 0) +
      (equipo.puntos_gp_actual ?? 0);

    const { error: updateError } =
      await supabase
        .from("equipos")
        .update({
          puntos: nuevosPuntos,
        })
        .eq("id", equipo.id);

    if (updateError) {
      throw new Error(
        `Error actualizando puntos del equipo ${equipo.id}: ${updateError.message}`
      );
    }
  }
}
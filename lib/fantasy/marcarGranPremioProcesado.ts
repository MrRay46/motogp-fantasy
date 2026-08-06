import { supabase } from "@/lib/supabase";

export async function marcarGranPremioProcesado(
  gpId: number,
  usuarioId: number
) {
  const { error } = await supabase
    .from("grandes_premios")
    .update({
      fantasy_procesado: true,
      fantasy_procesado_at: new Date().toISOString(),
      fantasy_procesado_por: usuarioId,
    })
    .eq("id", gpId);

  if (error) {
    throw new Error(
      `Error marcando GP procesado: ${error.message}`
    );
  }
}
import type { SupabaseClient } from "@supabase/supabase-js";

export async function marcarGranPremioProcesado(
  supabase: SupabaseClient,
  gpId: number,
  usuarioId: number
) {
  const { error } = await supabase
    .from("grandes_premios")
    .update({
      fantasy_procesado: true,
      fantasy_procesado_at:
        new Date().toISOString(),
      fantasy_procesado_por: usuarioId,
    })
    .eq("id", gpId);

  if (error) {
    throw new Error(
      `Error marcando GP procesado: ${error.message}`
    );
  }
}
import { supabase } from "@/lib/supabase";

export type GranPremioProcesable = {
  id: number;
  codigo: string;
  nombre: string;
  temporada: number;
};

export async function validarGranPremio(): Promise<GranPremioProcesable> {
  const { data, error } = await supabase
    .from("grandes_premios")
    .select(
      `
      id,
      codigo,
      nombre,
      temporada,
      estado,
      fantasy_procesado
      `
    )
    .eq("estado", "finalizado")
    .eq("fantasy_procesado", false)
    .order("fecha_fin", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Error buscando GP: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "No existe ningún Gran Premio pendiente de procesar."
    );
  }

  return {
    id: data.id,
    codigo: data.codigo,
    nombre: data.nombre,
    temporada: data.temporada,
  };
}
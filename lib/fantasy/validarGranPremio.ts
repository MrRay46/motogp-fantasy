import { supabase } from "@/lib/supabase";

export type GranPremioProcesable = {
  id: number;
  codigo: string;
  nombre: string;
  temporada: number;
};

export async function validarGranPremio(
  granPremioId: number
): Promise<GranPremioProcesable> {

  const { data, error } = await supabase
    .from("grandes_premios")
    .select(`
      id,
      codigo,
      nombre,
      temporada,
      estado,
      fantasy_procesado
    `)
    .eq("id", granPremioId)
    .single();

  if (error) {
    throw new Error(
      `Error buscando GP: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "El Gran Premio seleccionado no existe."
    );
  }

  if (data.estado !== "finalizado") {
    throw new Error(
      `El GP ${data.nombre} todavía no está finalizado.`
    );
  }

  if (data.fantasy_procesado) {
    throw new Error(
      `El GP ${data.nombre} ya ha sido procesado.`
    );
  }

  return {
    id: data.id,
    codigo: data.codigo,
    nombre: data.nombre,
    temporada: data.temporada,
  };
}
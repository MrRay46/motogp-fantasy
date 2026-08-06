import { supabase } from "@/lib/supabase";

export type DatosFantasy = {
  equipos: any[];
  pilotos: any[];
  constructores: any[];
};

export async function leerDatosFantasy(): Promise<DatosFantasy> {
  const [
    equiposResult,
    pilotosResult,
    constructoresResult,
  ] = await Promise.all([
    supabase
      .from("equipos")
      .select("*"),

    supabase
      .from("pilotos")
      .select("*"),

    supabase
      .from("constructores")
      .select("*"),
  ]);

  if (equiposResult.error) {
    throw new Error(
      `Error cargando equipos: ${equiposResult.error.message}`
    );
  }

  if (pilotosResult.error) {
    throw new Error(
      `Error cargando pilotos: ${pilotosResult.error.message}`
    );
  }

  if (constructoresResult.error) {
    throw new Error(
      `Error cargando constructores: ${constructoresResult.error.message}`
    );
  }

  return {
    equipos: equiposResult.data ?? [],
    pilotos: pilotosResult.data ?? [],
    constructores:
      constructoresResult.data ?? [],
  };
}
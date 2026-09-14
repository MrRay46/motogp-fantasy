import type { SupabaseClient } from "@supabase/supabase-js";

import { validarGranPremio } from "./validarGranPremio";
import { leerDatosFantasy } from "./leerDatosFantasy";
import { calcularPuntosEquipos } from "./calcularPuntosEquipos";
import { guardarResultados } from "./guardarResultados";
import { actualizarPuntosTemporada } from "./actualizarPuntosTemporada";
import { actualizarClasificacion } from "./actualizarClasificacion";
import { guardarGanadorGranPremio } from "./guardarGanadorGranPremio";
import { marcarGranPremioProcesado } from "./marcarGranPremioProcesado";

export async function procesarGranPremio(
  supabase: SupabaseClient,
  granPremioId: number,
  usuarioId: number
) {
  const granPremio =
    await validarGranPremio(
      supabase,
      granPremioId
    );

  const datos =
    await leerDatosFantasy(supabase);

  const resultados =
    calcularPuntosEquipos(datos);

  await guardarResultados(
    supabase,
    resultados
  );

  await actualizarPuntosTemporada(
    supabase
  );

  await actualizarClasificacion(
    supabase
  );

  await guardarGanadorGranPremio(
    supabase,
    granPremio.id,
    resultados
  );

  await marcarGranPremioProcesado(
    supabase,
    granPremio.id,
    usuarioId
  );

  return {
    ok: true,
    granPremio,
    equiposProcesados:
      resultados.length,
  };
}
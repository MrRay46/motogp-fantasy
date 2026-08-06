import { validarGranPremio } from "./validarGranPremio";
import { leerDatosFantasy } from "./leerDatosFantasy";
import { calcularPuntosEquipos } from "./calcularPuntosEquipos";
import { guardarResultados } from "./guardarResultados";
import { actualizarPuntosTemporada } from "./actualizarPuntosTemporada";
import { actualizarClasificacion } from "./actualizarClasificacion";
import { guardarGanadorGranPremio } from "./guardarGanadorGranPremio";
import { marcarGranPremioProcesado } from "./marcarGranPremioProcesado";

export async function procesarGranPremio(
  usuarioId: number
) {
  //-------------------------------------------------
  // Validar GP pendiente
  //-------------------------------------------------

  const granPremio =
    await validarGranPremio();

  //-------------------------------------------------
  // Leer datos Fantasy
  //-------------------------------------------------

  const datos =
    await leerDatosFantasy();

  //-------------------------------------------------
  // Calcular puntos del GP
  //-------------------------------------------------

  const resultados =
    calcularPuntosEquipos(datos);

  //-------------------------------------------------
  // Guardar puntos GP
  //-------------------------------------------------

  await guardarResultados(resultados);

  //-------------------------------------------------
  // Actualizar temporada
  //-------------------------------------------------

  await actualizarPuntosTemporada();

  //-------------------------------------------------
  // Recalcular clasificación
  //-------------------------------------------------

  await actualizarClasificacion();

  //-------------------------------------------------
  // Guardar ganador Fantasy del GP
  //-------------------------------------------------

  await guardarGanadorGranPremio(
    granPremio.id,
    resultados
  );

  //-------------------------------------------------
  // Marcar GP procesado
  //-------------------------------------------------

  await marcarGranPremioProcesado(
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
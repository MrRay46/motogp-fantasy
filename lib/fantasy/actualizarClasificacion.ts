import { supabase } from "@/lib/supabase";

type Equipo = {
  id: number;
  liga_id: number | null;

  puntos: number | null;

  posicion_actual: number | null;
  posicion_anterior: number | null;

  diferencia_lider: number | null;
  diferencia_lider_anterior: number | null;
};

export async function actualizarClasificacion() {
  const { data: equipos, error } = await supabase
    .from("equipos")
    .select(`
      id,
      liga_id,
      puntos,
      posicion_actual,
      posicion_anterior,
      diferencia_lider,
      diferencia_lider_anterior
    `);

  if (error) {
    throw new Error(error.message);
  }

  if (!equipos?.length) {
    return;
  }

  // --------------------------------------------------
  // OBTENER LIGAS CON EQUIPOS
  // --------------------------------------------------

  const ligas = [
    ...new Set(
      equipos
        .map((equipo) => equipo.liga_id)
        .filter(
          (ligaId): ligaId is number =>
            ligaId !== null
        )
    ),
  ];

  // --------------------------------------------------
  // ACTUALIZAR CADA LIGA POR SEPARADO
  // --------------------------------------------------

  for (const ligaId of ligas) {
    const equiposLiga = equipos
      .filter(
        (equipo) =>
          equipo.liga_id === ligaId
      )
      .sort((a, b) => {
        // 1. Más puntos primero
        const puntosA = a.puntos ?? 0;
        const puntosB = b.puntos ?? 0;

        if (puntosB !== puntosA) {
          return puntosB - puntosA;
        }

        // 2. En caso de empate,
        // mantener la posición anterior
        const posicionA =
          a.posicion_actual ?? Infinity;

        const posicionB =
          b.posicion_actual ?? Infinity;

        if (posicionA !== posicionB) {
          return posicionA - posicionB;
        }

        // 3. Último desempate estable
        return a.id - b.id;
      });

    const puntosLider =
      equiposLiga[0]?.puntos ?? 0;

    // ------------------------------------------------
    // GUARDAR NUEVA CLASIFICACIÓN
    // ------------------------------------------------

    for (
      let indice = 0;
      indice < equiposLiga.length;
      indice++
    ) {
      const equipo =
        equiposLiga[indice];

      const nuevaPosicion =
        indice + 1;

      const { error: updateError } =
        await supabase
          .from("equipos")
          .update({
            // Posición anterior
            posicion_anterior:
              equipo.posicion_actual,

            // Diferencia anterior
            diferencia_lider_anterior:
              equipo.diferencia_lider,

            // Nueva posición
            posicion_actual:
              nuevaPosicion,

            // Diferencia respecto al líder
            diferencia_lider:
              puntosLider -
              (equipo.puntos ?? 0),
          })
          .eq("id", equipo.id)
          .eq("liga_id", ligaId);

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }
    }
  }
}
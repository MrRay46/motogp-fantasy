import { supabase } from "@/lib/supabase";

type Equipo = {
  id: number;
  liga_id: number;

  puntos: number;

  posicion_actual: number;
  posicion_anterior: number;

  diferencia_lider: number;
  diferencia_lider_anterior: number;
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
        if (b.puntos !== a.puntos) {
          return b.puntos - a.puntos;
        }

        // 2. En caso de empate,
        // mantener la posición anterior
        if (
          a.posicion_actual !==
          b.posicion_actual
        ) {
          return (
            (a.posicion_actual || Infinity) -
            (b.posicion_actual || Infinity)
          );
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
            // La posición que tenía ANTES
            // de esta actualización
            posicion_anterior:
              equipo.posicion_actual,

            diferencia_lider_anterior:
              equipo.diferencia_lider,

            // Nueva posición
            posicion_actual:
              nuevaPosicion,

            // Diferencia respecto al líder
            diferencia_lider:
              puntosLider -
              equipo.puntos,
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
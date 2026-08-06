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

  const ligas = [
    ...new Set(
      equipos.map((e) => e.liga_id)
    ),
  ];

  for (const ligaId of ligas) {
    const equiposLiga = equipos
      .filter(
        (e) => e.liga_id === ligaId
      )
      .sort(
        (a, b) =>
          b.puntos - a.puntos
      );

    const puntosLider =
      equiposLiga[0]?.puntos ?? 0;

    for (
      let posicion = 0;
      posicion < equiposLiga.length;
      posicion++
    ) {
      const equipo =
        equiposLiga[posicion];

      const { error: updateError } =
        await supabase
          .from("equipos")
          .update({
            posicion_anterior:
              equipo.posicion_actual,

            diferencia_lider_anterior:
              equipo.diferencia_lider,

            posicion_actual:
              posicion + 1,

            diferencia_lider:
              puntosLider -
              equipo.puntos,
          })
          .eq("id", equipo.id);

      if (updateError) {
        throw new Error(
          updateError.message
        );
      }
    }
  }
}
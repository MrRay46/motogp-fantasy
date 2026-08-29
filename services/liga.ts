import { supabase } from "@/lib/supabase";

import {
  DestacadosGP,
  EquipoFantasy,
  EquipoLigaDB,
  MovimientoRanking,
  PilotoDB,
  RankingJugador,
  UsuarioLigaDB,
} from "@/types/liga";

import type { ConstructorDB } from "@/types/liga";

/* -------------------------------------------------------------------------- */
/*                               API PÚBLICA                                  */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene la clasificación Fantasy de una liga concreta.
 *
 * El equipo se identifica mediante usuario_id + liga_id,
 * evitando mezclar datos entre diferentes ligas.
 */
export async function obtenerRankingFantasy(
  ligaId: number
): Promise<RankingJugador[]> {
  try {
    const usuarios = await obtenerUsuariosLiga(ligaId);

    const equipos = await obtenerEquiposLiga(
      ligaId,
      usuarios
    );

    const ranking = construirRanking(
      usuarios,
      equipos
    );

    const rankingOrdenado = ordenarRanking(ranking);

    return calcularPosiciones(rankingOrdenado);
  } catch (error) {
    console.error(
      "Error obteniendo ranking fantasy:",
      error
    );

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                              DESTACADOS GP                                 */
/* -------------------------------------------------------------------------- */

export async function obtenerDestacadosGP(): Promise<
  DestacadosGP | null
> {
  try {
    const {
      data: gp,
      error: gpError,
    } = await supabase
      .from("grandes_premios")
      .select("*")
      .eq("estado", "finalizado")
      .order("fecha_fin", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (gpError) {
      throw gpError;
    }

    if (!gp) {
      return null;
    }

    const {
      data: sprintWinner,
      error: sprintError,
    } = await supabase
      .from("pilotos")
      .select("*")
      .eq(
        "id",
        gp.piloto_ganador_sprint_id
      )
      .maybeSingle();

    if (sprintError) {
      throw sprintError;
    }

    const {
      data: raceWinner,
      error: raceError,
    } = await supabase
      .from("pilotos")
      .select("*")
      .eq(
        "id",
        gp.piloto_ganador_id
      )
      .maybeSingle();

    if (raceError) {
      throw raceError;
    }

    const {
      data: riderInForm,
      error: leaderError,
    } = await supabase
      .from("pilotos")
      .select("*")
      .order("puntos_totales", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (leaderError) {
      throw leaderError;
    }

    return {
      granPremio: {
        nombre: gp.nombre,
        pais: gp.pais,
        imagen: gp.imagen,
        fechaInicio: gp.fecha_inicio,
        fechaFin: gp.fecha_fin,
      },

      sprintWinner:
        sprintWinner ?? null,

      raceWinner:
        raceWinner ?? null,

      riderInForm:
        riderInForm ?? null,
    };
  } catch (error) {
    console.error(
      "Error obteniendo destacados GP:",
      error
    );

    throw error;
  }
}

/* -------------------------------------------------------------------------- */
/*                         CLASIFICACIÓN PILOTOS                              */
/* -------------------------------------------------------------------------- */

export async function obtenerRankingPilotos(): Promise<
  PilotoDB[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("pilotos")
    .select("*")
    .eq("activo", true)
    .order("puntos_totales", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                      CLASIFICACIÓN CONSTRUCTORES                           */
/* -------------------------------------------------------------------------- */

export async function obtenerRankingConstructores(): Promise<
  ConstructorDB[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("constructores")
    .select("*")
    .eq("activo", true)
    .order("puntos", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return data ?? [];
}

/* -------------------------------------------------------------------------- */
/*                              EQUIPO FANTASY                                */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene el equipo de un usuario dentro de una liga concreta.
 *
 * Se utilizan usuario_id + liga_id para identificar
 * correctamente el equipo.
 */
export async function obtenerEquipoFantasy(
  usuarioId: number,
  ligaId: number
): Promise<EquipoFantasy> {
  const {
    data,
    error,
  } = await supabase
    .from("equipos")
    .select(`
      fichados,
      reserva,
      motor,
      prediccion_piloto,
      prediccion_motor,
      prediccion_piloto_modificada,
      prediccion_motor_modificada
    `)
    .eq("usuario_id", usuarioId)
    .eq("liga_id", ligaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(
      "El usuario todavía no tiene equipo en esta liga."
    );
  }

  return {
    titulares: (data.fichados ?? []).filter(
      (piloto: string) =>
        piloto !== data.reserva
    ),

    reserva: data.reserva,
    motor: data.motor,

    prediccionPiloto:
      data.prediccion_piloto,

    prediccionMotor:
      data.prediccion_motor,

    pilotoModificada:
      data.prediccion_piloto_modificada,

    motorModificada:
      data.prediccion_motor_modificada,
  };
}

/* -------------------------------------------------------------------------- */
/*                             USUARIOS DE LIGA                               */
/* -------------------------------------------------------------------------- */

async function obtenerUsuariosLiga(
  ligaId: number
): Promise<UsuarioLigaDB[]> {
  const {
    data: relaciones,
    error,
  } = await supabase
    .from("usuarios_ligas")
    .select("usuario_id")
    .eq("liga_id", ligaId);

  if (error) {
    throw error;
  }

  if (!relaciones?.length) {
    return [];
  }

  const ids = relaciones.map(
    (relacion) =>
      relacion.usuario_id
  );

  const {
    data,
    error: usuariosError,
  } = await supabase
    .from("usuarios")
    .select(
      "id,usuario,avatar"
    )
    .in("id", ids);

  if (usuariosError) {
    throw usuariosError;
  }

  return (
    data ?? []
  ) as UsuarioLigaDB[];
}

/* -------------------------------------------------------------------------- */
/*                             EQUIPOS DE LIGA                                */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene exclusivamente los equipos de la liga indicada
 * utilizando el ID real del usuario.
 */
async function obtenerEquiposLiga(
  ligaId: number,
  usuarios: UsuarioLigaDB[]
): Promise<EquipoLigaDB[]> {
  if (!usuarios.length) {
    return [];
  }

  const ids = usuarios.map(
    (usuario) =>
      usuario.id
  );

  const {
    data,
    error,
  } = await supabase
    .from("equipos")
    .select(
      "usuario_id,puntos,posicion_anterior"
    )
    .eq("liga_id", ligaId)
    .in("usuario_id", ids);

  if (error) {
    throw error;
  }

  return (
    data ?? []
  ) as EquipoLigaDB[];
}

/* -------------------------------------------------------------------------- */
/*                              MAPA DE EQUIPOS                               */
/* -------------------------------------------------------------------------- */

function crearMapaEquipos(
  equipos: EquipoLigaDB[]
): Map<number, EquipoLigaDB> {
  return new Map(
    equipos.map(
      (equipo) => [
        equipo.usuario_id,
        equipo,
      ]
    )
  );
}

/* -------------------------------------------------------------------------- */
/*                           CONSTRUIR RANKING                                */
/* -------------------------------------------------------------------------- */

function construirRanking(
  usuarios: UsuarioLigaDB[],
  equipos: EquipoLigaDB[]
): Omit<
  RankingJugador,
  "posicion" | "movimiento"
>[] {
  const equiposMap =
    crearMapaEquipos(equipos);

  return usuarios.map(
    (usuario) => {
      const equipo =
        equiposMap.get(
          usuario.id
        );

      return {
        id: usuario.id,

        usuario:
          usuario.usuario,

        avatar:
          usuario.avatar,

        puntos:
          equipo?.puntos ?? 0,

        posicionAnterior:
          equipo?.posicion_anterior ??
          0,
      };
    }
  );
}

/* -------------------------------------------------------------------------- */
/*                              ORDENAR RANKING                               */
/* -------------------------------------------------------------------------- */

function ordenarRanking(
  ranking: Omit<
    RankingJugador,
    "posicion" | "movimiento"
  >[]
): Omit<
  RankingJugador,
  "posicion" | "movimiento"
>[] {
  return [...ranking].sort(
    (a, b) =>
      b.puntos - a.puntos
  );
}

/* -------------------------------------------------------------------------- */
/*                            CALCULAR POSICIONES                             */
/* -------------------------------------------------------------------------- */

function calcularPosiciones(
  ranking: Omit<
    RankingJugador,
    "posicion" | "movimiento"
  >[]
): RankingJugador[] {
  return ranking.map(
    (jugador, index) => ({
      ...jugador,

      posicion:
        index + 1,

      movimiento:
        calcularMovimiento(
          index + 1,
          jugador.posicionAnterior
        ),
    })
  );
}

/* -------------------------------------------------------------------------- */
/*                            CALCULAR MOVIMIENTO                             */
/* -------------------------------------------------------------------------- */

function calcularMovimiento(
  posicionActual: number,
  posicionAnterior: number
): MovimientoRanking {
  if (!posicionAnterior) {
    return "same";
  }

  if (
    posicionActual <
    posicionAnterior
  ) {
    return "up";
  }

  if (
    posicionActual >
    posicionAnterior
  ) {
    return "down";
  }

  return "same";
}
import { supabase } from "@/lib/supabase";
import {
  DestacadosGP,
  EquipoLigaDB,
  MovimientoRanking,
  RankingJugador,
  UsuarioLigaDB,
} from "@/types/liga";

/* -------------------------------------------------------------------------- */
/*                               API PÚBLICA                                  */
/* -------------------------------------------------------------------------- */

export async function obtenerRankingFantasy(
  ligaId: number
): Promise<RankingJugador[]> {
  try {
    const usuarios = await obtenerUsuariosLiga(ligaId);

    const equipos = await obtenerEquiposLiga(usuarios);

    const ranking = construirRanking(usuarios, equipos);

    const rankingOrdenado = ordenarRanking(ranking);

    return calcularPosiciones(rankingOrdenado);
  } catch (error) {
    console.error("Error obteniendo ranking fantasy:", error);
    throw error;
  }
}

export async function obtenerDestacadosGP(): Promise<DestacadosGP | null> {
  try {
    // Último GP finalizado
    const { data: gp, error: gpError } = await supabase
      .from("grandes_premios")
      .select("*")
      .eq("estado", "finalizado")
      .order("fecha_fin", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (gpError) throw gpError;

    if (!gp) return null;

    // Ganador Sprint
    const { data: sprintWinner, error: sprintError } = await supabase
      .from("pilotos")
      .select("*")
      .eq("id", gp.piloto_ganador_sprint_id)
      .maybeSingle();

    if (sprintError) throw sprintError;

    // Ganador Carrera
    const { data: raceWinner, error: raceError } = await supabase
      .from("pilotos")
      .select("*")
      .eq("id", gp.piloto_ganador_id)
      .maybeSingle();

    if (raceError) throw raceError;

    // Líder del Mundial
    const { data: riderInForm, error: leaderError } = await supabase
      .from("pilotos")
      .select("*")
      .order("puntos_totales", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (leaderError) throw leaderError;

    return {
      granPremio: {
        nombre: gp.nombre,
        pais: gp.pais,
        imagen: gp.imagen,
        fechaInicio: gp.fecha_inicio,
        fechaFin: gp.fecha_fin,
      },
      sprintWinner: sprintWinner ?? null,
      raceWinner: raceWinner ?? null,
      riderInForm: riderInForm ?? null,
    };
  } catch (error) {
    console.error("Error obteniendo destacados GP:", error);
    throw error;
  }
}

export async function obtenerRankingPilotos() {
  return [];
}

export async function obtenerRankingConstructores() {
  return [];
}

/* -------------------------------------------------------------------------- */
/*                              FUNCIONES PRIVADAS                            */
/* -------------------------------------------------------------------------- */

async function obtenerUsuariosLiga(
  ligaId: number
): Promise<UsuarioLigaDB[]> {
  const { data: relaciones, error } = await supabase
    .from("usuarios_ligas")
    .select("usuario_id")
    .eq("liga_id", ligaId);

  if (error) throw error;

  if (!relaciones?.length) return [];

  const ids = relaciones.map((r) => r.usuario_id);

  const { data, error: usuariosError } = await supabase
    .from("usuarios")
    .select("id,usuario,avatar")
    .in("id", ids);

  if (usuariosError) throw usuariosError;

  return (data ?? []) as UsuarioLigaDB[];
}

async function obtenerEquiposLiga(
  usuarios: UsuarioLigaDB[]
): Promise<EquipoLigaDB[]> {
  if (!usuarios.length) return [];

  const nombres = usuarios.map((u) => u.usuario);

  const { data, error } = await supabase
    .from("equipos")
    .select("usuario,puntos,posicion_anterior")
    .in("usuario", nombres);

  if (error) throw error;

  return (data ?? []) as EquipoLigaDB[];
}

function crearMapaEquipos(
  equipos: EquipoLigaDB[]
): Map<string, EquipoLigaDB> {
  return new Map(
    equipos.map((equipo) => [equipo.usuario, equipo])
  );
}

function construirRanking(
  usuarios: UsuarioLigaDB[],
  equipos: EquipoLigaDB[]
): Omit<RankingJugador, "posicion" | "movimiento">[] {
  const equiposMap = crearMapaEquipos(equipos);

  return usuarios.map((usuario) => {
    const equipo = equiposMap.get(usuario.usuario);

    return {
      id: usuario.id,
      usuario: usuario.usuario,
      avatar: usuario.avatar,
      puntos: equipo?.puntos ?? 0,
      posicionAnterior: equipo?.posicion_anterior ?? 0,
    };
  });
}

function ordenarRanking(
  ranking: Omit<RankingJugador, "posicion" | "movimiento">[]
): Omit<RankingJugador, "posicion" | "movimiento">[] {
  return [...ranking].sort((a, b) => b.puntos - a.puntos);
}

function calcularPosiciones(
  ranking: Omit<RankingJugador, "posicion" | "movimiento">[]
): RankingJugador[] {
  return ranking.map((jugador, index) => ({
    ...jugador,
    posicion: index + 1,
    movimiento: calcularMovimiento(
      index + 1,
      jugador.posicionAnterior
    ),
  }));
}

function calcularMovimiento(
  posicionActual: number,
  posicionAnterior: number
): MovimientoRanking {
  if (!posicionAnterior) return "same";

  if (posicionActual < posicionAnterior) {
    return "up";
  }

  if (posicionActual > posicionAnterior) {
    return "down";
  }

  return "same";
}
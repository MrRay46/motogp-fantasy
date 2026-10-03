import { supabase } from "@/lib/supabase";

import {
  DestacadosGP,
  PilotoDB,
} from "@/types/liga";

import type { ConstructorDB } from "@/types/liga";

/* -------------------------------------------------------------------------- */
/*                               DESTACADOS GP                                */
/* -------------------------------------------------------------------------- */

/**
 * Obtiene los datos destacados del último Gran Premio finalizado.
 */
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

/**
 * Obtiene la clasificación actual de pilotos.
 */
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

/**
 * Obtiene la clasificación actual de constructores.
 */
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
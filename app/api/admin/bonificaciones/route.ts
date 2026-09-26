
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { campeonTemporada } from "@/data/prediccionesTemporada";

export async function POST(request: NextRequest) {
  try {
    // 1. Comprobar la sesión de Supabase Auth
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Sesión no válida o caducada." },
        { status: 401 }
      );
    }

    // 2. Identificar al usuario interno de Rayongrid
    const { data: usuarioAdmin, error: errorAdmin } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, activo")
        .eq("auth_user_id", authUser.id)
        .maybeSingle();

    if (
      errorAdmin ||
      !usuarioAdmin ||
      !usuarioAdmin.activo
    ) {
      return NextResponse.json(
        { error: "Usuario no autorizado." },
        { status: 403 }
      );
    }

    // 3. Validar la liga solicitada
    const body = await request.json();
    const liga_id = Number(body.liga_id);

    if (
      !Number.isSafeInteger(liga_id) ||
      liga_id <= 0
    ) {
      return NextResponse.json(
        { error: "Liga no válida." },
        { status: 400 }
      );
    }

    // 4. Verificar que el usuario es administrador de esa liga
    const {
      data: membresiaAdmin,
      error: errorMembresia,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("usuario_id", usuarioAdmin.id)
      .eq("liga_id", liga_id)
      .eq("admin_liga", true)
      .maybeSingle();

    if (errorMembresia || !membresiaAdmin) {
      return NextResponse.json(
        {
          error:
            "No tienes permisos de administrador en esta liga.",
        },
        { status: 403 }
      );
    }

    // 5. Obtener exclusivamente los equipos de esa liga
    const {
      data: equipos,
      error: errorEquipos,
    } = await supabaseAdmin
      .from("equipos")
      .select("*")
      .eq("liga_id", liga_id);

    if (errorEquipos || !equipos) {
      console.error(errorEquipos);

      return NextResponse.json(
        { error: "No se pudieron leer los equipos de la liga." },
        { status: 500 }
      );
    }

    // 6. Aplicar las bonificaciones pendientes
    let equiposProcesados = 0;
    let equiposOmitidos = 0;
    const errores: string[] = [];

    for (const equipo of equipos) {
      if (equipo.bonus_temporada_aplicado) {
        equiposOmitidos++;
        continue;
      }

      let bonus = 0;

      if (
        equipo.prediccion_piloto === campeonTemporada.piloto
      ) {
        bonus += equipo.prediccion_piloto_modificada
          ? 18.5
          : 37;
      }

      if (
        equipo.prediccion_motor === campeonTemporada.constructor
      ) {
        bonus += equipo.prediccion_motor_modificada
          ? 5
          : 10;
      }

      const { error: errorUpdate } = await supabaseAdmin
        .from("equipos")
        .update({
          puntos: (equipo.puntos ?? 0) + bonus,
          bonus_temporada: bonus,
          bonus_temporada_aplicado: true,
        })
        .eq("id", equipo.id)
        .eq("liga_id", liga_id)
        .eq("bonus_temporada_aplicado", false);

      if (errorUpdate) {
        console.error(
          `Error actualizando equipo ${equipo.id}:`,
          errorUpdate
        );

        errores.push(String(equipo.id));
      } else {
        equiposProcesados++;
      }
    }

    return NextResponse.json({
      ok: true,
      equiposProcesados,
      equiposOmitidos,
      errores,
      mensaje:
        equiposProcesados === 0
          ? "No había equipos pendientes de bonificación."
          : "Proceso de bonificaciones finalizado.",
    });
  } catch (error) {
    console.error("Error en API de bonificaciones:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

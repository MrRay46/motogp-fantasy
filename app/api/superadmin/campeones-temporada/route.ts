import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const TEMPORADA_CAMPEONATOS = 2026;

function errorJson(mensaje: string, estado: number) {
  return NextResponse.json({ error: mensaje }, { status: estado });
}

type ResultadoAutenticacion =
  | {
      ok: true;
      usuarioId: number;
    }
  | {
      ok: false;
      respuesta: NextResponse;
    };

async function comprobarSuperAdmin(
  request: Request
): Promise<ResultadoAutenticacion> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      respuesta: errorJson("No has iniciado sesión.", 401),
    };
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return {
      ok: false,
      respuesta: errorJson("La sesión no es válida.", 401),
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      ok: false,
      respuesta: errorJson("La sesión no es válida.", 401),
    };
  }

  const { data: usuario, error: usuarioError } = await supabaseAdmin
    .from("usuarios")
    .select("id, activo, super_admin")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (usuarioError) {
    console.error(
      "Error comprobando permisos de SuperAdmin:",
      usuarioError
    );

    return {
      ok: false,
      respuesta: errorJson("No se pudieron comprobar los permisos.", 500),
    };
  }

  if (
    !usuario ||
    usuario.activo !== true ||
    usuario.super_admin !== true
  ) {
    return {
      ok: false,
      respuesta: errorJson("No tienes permisos de SuperAdmin.", 403),
    };
  }

  return {
    ok: true,
    usuarioId: usuario.id,
  };
}

async function contarBonificacionesAplicadas(): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from("equipos")
    .select("id", { count: "exact", head: true })
    .eq("bonus_temporada_aplicado", true);

  if (error) {
    throw new Error(
      `No se pudo comprobar el estado de las bonificaciones: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function GET(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const [
      resultadoPilotos,
      resultadoConstructores,
      resultadoCampeones,
      bonificacionesAplicadas,
    ] = await Promise.all([
      supabaseAdmin
        .from("pilotos")
        .select("id, nombre")
        .order("nombre", { ascending: true }),

      supabaseAdmin
        .from("constructores")
        .select("id, nombre")
        .order("nombre", { ascending: true }),

      supabaseAdmin
        .from("campeones_temporada")
        .select(
          "temporada, piloto_campeon_id, constructor_campeon_id, actualizado_en"
        )
        .eq("temporada", TEMPORADA_CAMPEONATOS)
        .maybeSingle(),

      contarBonificacionesAplicadas(),
    ]);

    if (resultadoPilotos.error) {
      console.error(
        "Error cargando pilotos:",
        resultadoPilotos.error
      );
      return errorJson("No se pudieron cargar los pilotos.", 500);
    }

    if (resultadoConstructores.error) {
      console.error(
        "Error cargando constructores:",
        resultadoConstructores.error
      );
      return errorJson("No se pudieron cargar los constructores.", 500);
    }

    if (resultadoCampeones.error) {
      console.error(
        "Error cargando campeones:",
        resultadoCampeones.error
      );
      return errorJson("No se pudo leer la selección de campeones.", 500);
    }

    return NextResponse.json(
      {
        temporada: TEMPORADA_CAMPEONATOS,
        pilotos: resultadoPilotos.data ?? [],
        constructores: resultadoConstructores.data ?? [],
        campeones: resultadoCampeones.data ?? null,
        bonificacionesAplicadas,
      },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error en GET de campeones:", error);

    return errorJson(
      error instanceof Error
        ? error.message
        : "Error interno del servidor.",
      500
    );
  }
}

export async function POST(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorJson("La solicitud no contiene JSON válido.", 400);
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return errorJson("Los datos de campeones no son válidos.", 400);
    }

    const datos = body as Record<string, unknown>;
    const pilotoId = Number(datos.piloto_campeon_id);
    const constructorId = Number(datos.constructor_campeon_id);

    if (!Number.isSafeInteger(pilotoId) || pilotoId <= 0) {
      return errorJson("Selecciona un piloto campeón válido.", 400);
    }

    if (!Number.isSafeInteger(constructorId) || constructorId <= 0) {
      return errorJson("Selecciona un constructor campeón válido.", 400);
    }

    const bonificacionesAplicadas =
      await contarBonificacionesAplicadas();

    if (bonificacionesAplicadas > 0) {
      return NextResponse.json(
        {
          error:
            "No se pueden cambiar los campeones porque ya se han aplicado bonificaciones.",
          bonificacionesAplicadas,
        },
        { status: 409 }
      );
    }

    const [resultadoPiloto, resultadoConstructor] = await Promise.all([
      supabaseAdmin
        .from("pilotos")
        .select("id")
        .eq("id", pilotoId)
        .maybeSingle(),

      supabaseAdmin
        .from("constructores")
        .select("id")
        .eq("id", constructorId)
        .maybeSingle(),
    ]);

    if (resultadoPiloto.error || !resultadoPiloto.data) {
      return errorJson("El piloto seleccionado no existe.", 400);
    }

    if (resultadoConstructor.error || !resultadoConstructor.data) {
      return errorJson("El constructor seleccionado no existe.", 400);
    }

    const { data: campeones, error: errorGuardado } = await supabaseAdmin
      .from("campeones_temporada")
      .upsert(
        {
          temporada: TEMPORADA_CAMPEONATOS,
          piloto_campeon_id: pilotoId,
          constructor_campeon_id: constructorId,
          actualizado_por: autenticacion.usuarioId,
          actualizado_en: new Date().toISOString(),
        },
        {
          onConflict: "temporada",
        }
      )
      .select(
        "temporada, piloto_campeon_id, constructor_campeon_id, actualizado_en"
      )
      .single();

    if (errorGuardado || !campeones) {
      console.error("Error guardando campeones:", errorGuardado);
      return errorJson("No se pudieron guardar los campeones.", 500);
    }

    return NextResponse.json({
      ok: true,
      campeones,
      bonificacionesAplicadas: 0,
    });
  } catch (error) {
    console.error("Error en POST de campeones:", error);

    return errorJson(
      error instanceof Error
        ? error.message
        : "Error interno del servidor.",
      500
    );
  }
}
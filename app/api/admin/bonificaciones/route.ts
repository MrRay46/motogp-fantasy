import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const TEMPORADA_BONIFICACIONES = 2026;

type ContextoAdmin =
  | {
      ok: true;
      usuarioId: number;
      ligaId: number;
    }
  | {
      ok: false;
      response: NextResponse;
    };

async function comprobarAdminLiga(
  request: Request,
  ligaSolicitada?: number
): Promise<ContextoAdmin> {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      ),
    };
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      ),
    };
  }

  const {
    data: { user: authUser },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !authUser) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Sesión no válida o caducada." },
        { status: 401 }
      ),
    };
  }

  const { data: usuario, error: errorUsuario } =
    await supabaseAdmin
      .from("usuarios")
      .select("id, activo, liga_actual_id")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

  if (errorUsuario) {
    console.error(
      "Error comprobando usuario administrador:",
      errorUsuario
    );

    return {
      ok: false,
      response: NextResponse.json(
        { error: "No se pudo comprobar el usuario." },
        { status: 500 }
      ),
    };
  }

  if (!usuario || usuario.activo !== true) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "Usuario no autorizado." },
        { status: 403 }
      ),
    };
  }

  const ligaId =
    ligaSolicitada ?? Number(usuario.liga_actual_id);

  if (
    !Number.isSafeInteger(ligaId) ||
    ligaId <= 0
  ) {
    return {
      ok: false,
      response: NextResponse.json(
        { error: "No se ha encontrado una liga válida." },
        { status: 400 }
      ),
    };
  }

  const { data: membresia, error: errorMembresia } =
    await supabaseAdmin
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .eq("admin_liga", true)
      .maybeSingle();

  if (errorMembresia) {
    console.error(
      "Error comprobando administración de liga:",
      errorMembresia
    );

    return {
      ok: false,
      response: NextResponse.json(
        { error: "No se pudo comprobar el permiso de administración." },
        { status: 500 }
      ),
    };
  }

  if (!membresia) {
    return {
      ok: false,
      response: NextResponse.json(
        {
          error:
            "No tienes permisos de administrador en esta liga.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    ok: true,
    usuarioId: usuario.id,
    ligaId,
  };
}

async function obtenerEstadoBonificaciones(
  ligaId: number
) {
  const [
    resultadoGP,
    resultadoCampeones,
    resultadoEquipos,
  ] = await Promise.all([
    supabaseAdmin
      .from("grandes_premios")
      .select("id, estado, fantasy_procesado")
      .eq("temporada", TEMPORADA_BONIFICACIONES),

    supabaseAdmin
      .from("campeones_temporada")
      .select(
        "temporada, piloto_campeon_id, constructor_campeon_id"
      )
      .eq("temporada", TEMPORADA_BONIFICACIONES)
      .maybeSingle(),

    supabaseAdmin
      .from("equipos")
      .select("bonus_temporada_aplicado")
      .eq("liga_id", ligaId),
  ]);

  if (resultadoGP.error) {
    throw new Error(
      `Error comprobando los Grandes Premios: ${resultadoGP.error.message}`
    );
  }

  if (resultadoCampeones.error) {
    throw new Error(
      `Error leyendo los campeones: ${resultadoCampeones.error.message}`
    );
  }

  if (resultadoEquipos.error) {
    throw new Error(
      `Error comprobando los equipos: ${resultadoEquipos.error.message}`
    );
  }

  const grandesPremios =
    resultadoGP.data ?? [];

  const campeones =
    resultadoCampeones.data;

  const equipos =
    resultadoEquipos.data ?? [];

  const campeonesConfigurados =
    Boolean(
      campeones &&
        Number.isSafeInteger(
          Number(campeones.piloto_campeon_id)
        ) &&
        Number(campeones.piloto_campeon_id) > 0 &&
        Number.isSafeInteger(
          Number(campeones.constructor_campeon_id)
        ) &&
        Number(campeones.constructor_campeon_id) > 0
    );

  const temporadaFinalizada =
    grandesPremios.length > 0 &&
    grandesPremios.every(
      (gp) => gp.estado === "finalizado"
    );

  const todosLosGPProcesados =
    grandesPremios.length > 0 &&
    grandesPremios.every(
      (gp) => gp.fantasy_procesado === true
    );

  const equiposPendientes =
    equipos.filter(
      (equipo) =>
        equipo.bonus_temporada_aplicado !== true
    ).length;

  const yaAplicadas =
    equipos.length > 0 &&
    equiposPendientes === 0;

  let mensaje =
    "Las bonificaciones están listas para aplicarse.";

  if (!campeonesConfigurados) {
    mensaje =
      "El SuperAdmin aún no ha registrado el piloto y el constructor campeones.";
  } else if (grandesPremios.length === 0) {
    mensaje =
      `No hay Grandes Premios registrados para la temporada ${TEMPORADA_BONIFICACIONES}.`;
  } else if (!temporadaFinalizada) {
    mensaje =
      "Las bonificaciones se habilitarán cuando todos los Grandes Premios estén finalizados.";
  } else if (!todosLosGPProcesados) {
    mensaje =
      "Hay Grandes Premios finalizados que todavía no se han procesado.";
  } else if (equipos.length === 0) {
    mensaje =
      "Esta liga no tiene equipos para bonificar.";
  } else if (yaAplicadas) {
    mensaje =
      "Las bonificaciones ya se aplicaron a todos los equipos de esta liga.";
  }

  const puedeAplicar =
    campeonesConfigurados &&
    temporadaFinalizada &&
    todosLosGPProcesados &&
    equipos.length > 0 &&
    !yaAplicadas;

  return {
    temporada: TEMPORADA_BONIFICACIONES,
    puedeAplicar,
    campeonesConfigurados,
    temporadaFinalizada,
    todosLosGPProcesados,
    totalGP: grandesPremios.length,
    totalEquipos: equipos.length,
    equiposPendientes,
    yaAplicadas,
    mensaje,
  };
}

export async function GET(request: Request) {
  try {
    const contexto =
      await comprobarAdminLiga(request);

    if (!contexto.ok) {
      return contexto.response;
    }

    const estado =
      await obtenerEstadoBonificaciones(
        contexto.ligaId
      );

    return NextResponse.json({
      ok: true,
      ...estado,
    });
  } catch (error) {
    console.error(
      "Error comprobando estado de bonificaciones:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    let body: Record<string, unknown>;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "La solicitud no contiene JSON válido." },
        { status: 400 }
      );
    }

    const ligaIdSolicitada =
      Number(body.liga_id);

    if (
      !Number.isSafeInteger(ligaIdSolicitada) ||
      ligaIdSolicitada <= 0
    ) {
      return NextResponse.json(
        { error: "Liga no válida." },
        { status: 400 }
      );
    }

    const contexto =
      await comprobarAdminLiga(
        request,
        ligaIdSolicitada
      );

    if (!contexto.ok) {
      return contexto.response;
    }

    const estado =
      await obtenerEstadoBonificaciones(
        contexto.ligaId
      );

    if (!estado.puedeAplicar) {
      return NextResponse.json(
        {
          error: estado.mensaje,
          estado,
        },
        { status: 409 }
      );
    }

    const {
      data: campeones,
      error: errorCampeones,
    } = await supabaseAdmin
      .from("campeones_temporada")
      .select(
        "piloto_campeon_id, constructor_campeon_id"
      )
      .eq("temporada", TEMPORADA_BONIFICACIONES)
      .single();

    if (errorCampeones || !campeones) {
      console.error(
        "Error obteniendo campeones:",
        errorCampeones
      );

      return NextResponse.json(
        { error: "No se pudieron obtener los campeones." },
        { status: 500 }
      );
    }

    const [
      resultadoPiloto,
      resultadoConstructor,
      resultadoEquipos,
    ] = await Promise.all([
      supabaseAdmin
        .from("pilotos")
        .select("nombre")
        .eq("id", campeones.piloto_campeon_id)
        .single(),

      supabaseAdmin
        .from("constructores")
        .select("nombre")
        .eq("id", campeones.constructor_campeon_id)
        .single(),

      supabaseAdmin
        .from("equipos")
        .select(`
          id,
          liga_id,
          puntos,
          prediccion_piloto,
          prediccion_motor,
          prediccion_piloto_modificada,
          prediccion_motor_modificada,
          bonus_temporada_aplicado
        `)
        .eq("liga_id", contexto.ligaId),
    ]);

    if (resultadoPiloto.error || !resultadoPiloto.data) {
      console.error(
        "Error obteniendo piloto campeón:",
        resultadoPiloto.error
      );

      return NextResponse.json(
        { error: "No se pudo obtener el piloto campeón." },
        { status: 500 }
      );
    }

    if (
      resultadoConstructor.error ||
      !resultadoConstructor.data
    ) {
      console.error(
        "Error obteniendo constructor campeón:",
        resultadoConstructor.error
      );

      return NextResponse.json(
        { error: "No se pudo obtener el constructor campeón." },
        { status: 500 }
      );
    }

    if (resultadoEquipos.error) {
      console.error(
        "Error obteniendo equipos:",
        resultadoEquipos.error
      );

      return NextResponse.json(
        { error: "No se pudieron leer los equipos de la liga." },
        { status: 500 }
      );
    }

    const nombrePilotoCampeon =
      resultadoPiloto.data.nombre;

    const nombreConstructorCampeon =
      resultadoConstructor.data.nombre;

    let equiposProcesados = 0;
    let equiposOmitidos = 0;
    const errores: string[] = [];

    for (const equipo of resultadoEquipos.data ?? []) {
      if (equipo.bonus_temporada_aplicado === true) {
        equiposOmitidos++;
        continue;
      }

      let bonus = 0;

      if (
        equipo.prediccion_piloto ===
        nombrePilotoCampeon
      ) {
        bonus +=
          equipo.prediccion_piloto_modificada
            ? 18.5
            : 37;
      }

      if (
        equipo.prediccion_motor ===
        nombreConstructorCampeon
      ) {
        bonus +=
          equipo.prediccion_motor_modificada
            ? 5
            : 10;
      }

      const {
        data: equipoActualizado,
        error: errorUpdate,
      } = await supabaseAdmin
        .from("equipos")
        .update({
          puntos:
            (equipo.puntos ?? 0) + bonus,
          bonus_temporada: bonus,
          bonus_temporada_aplicado: true,
        })
        .eq("id", equipo.id)
        .eq("liga_id", contexto.ligaId)
        .or(
          "bonus_temporada_aplicado.eq.false,bonus_temporada_aplicado.is.null"
        )
        .select("id")
        .maybeSingle();

      if (errorUpdate) {
        console.error(
          `Error actualizando equipo ${equipo.id}:`,
          errorUpdate
        );

        errores.push(String(equipo.id));
      } else if (equipoActualizado) {
        equiposProcesados++;
      } else {
        // Otra solicitud pudo aplicar el bonus primero.
        equiposOmitidos++;
      }
    }

    const respuesta = {
      ok: errores.length === 0,
      temporada: TEMPORADA_BONIFICACIONES,
      equiposProcesados,
      equiposOmitidos,
      errores,
      mensaje:
        errores.length > 0
          ? "El proceso terminó con algunos equipos pendientes. Puedes volver a intentarlo; los ya aplicados no recibirán el bonus otra vez."
          : "Bonificaciones de temporada aplicadas.",
    };

    return NextResponse.json(
      respuesta,
      {
        status: errores.length > 0 ? 207 : 200,
      }
    );
  } catch (error) {
    console.error(
      "Error en API de bonificaciones:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
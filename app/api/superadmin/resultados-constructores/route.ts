import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://edlpwbhgxixiyivvljtk.supabase.co";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

async function comprobarSuperAdmin(
  request: Request
) {
  // -----------------------------------------
  // 1. Obtener token de Supabase Auth
  // -----------------------------------------

  const authorization =
    request.headers.get("authorization");

  if (!authorization) {
    return null;
  }

  if (
    !authorization
      .toLowerCase()
      .startsWith("bearer ")
  ) {
    return null;
  }

  const accessToken =
    authorization.slice(7).trim();

  if (!accessToken) {
    return null;
  }

  // -----------------------------------------
  // 2. Verificar usuario en Supabase Auth
  // -----------------------------------------

  const {
    data: authData,
    error: authError,
  } =
    await supabase.auth.getUser(
      accessToken
    );

  if (
    authError ||
    !authData.user
  ) {
    return null;
  }

  // -----------------------------------------
  // 3. Comprobar usuario Rayongrid
  // -----------------------------------------

  const {
    data: usuario,
    error,
  } = await supabase
    .from("usuarios")
    .select(
      "id, super_admin, activo"
    )
    .eq(
      "auth_user_id",
      authData.user.id
    )
    .single();

  if (
    error ||
    !usuario ||
    usuario.activo !== true ||
    usuario.super_admin !== true
  ) {
    return null;
  }

  return usuario;
}

// =========================================
// GET
// CARGAR RESULTADOS DE CONSTRUCTORES
// =========================================

export async function GET(
  request: Request
) {
  try {
    // -----------------------------------------
    // 1. Comprobar autenticación y SuperAdmin
    // -----------------------------------------

    const usuario =
      await comprobarSuperAdmin(
        request
      );

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "No autorizado.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 2. Obtener ID del Gran Premio
    // -----------------------------------------

    const url =
      new URL(
        request.url
      );

    const granPremioId =
      Number(
        url.searchParams.get(
          "gran_premio_id"
        )
      );

    if (
      !Number.isInteger(
        granPremioId
      ) ||
      granPremioId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Gran Premio no válido.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 3. Cargar histórico mediante
    //    Service Role
    // -----------------------------------------

    const {
      data: resultados,
      error,
    } = await supabase
      .from(
        "resultados_constructores_gp"
      )
      .select(`
        constructor_id,
        puntos_fantasy,
        puntos_oficiales
      `)
      .eq(
        "gran_premio_id",
        granPremioId
      );

    if (error) {
      console.error(
        "Error cargando resultados de constructores:",
        error
      );

      return NextResponse.json(
        {
          error:
            error.message,
        },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 4. Devolver resultados
    // -----------------------------------------

    return NextResponse.json({
      resultados:
        resultados || [],
    });
  } catch (error) {
    console.error(
      "Error en GET de resultados de constructores:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}

// =========================================
// POST
// GUARDAR RESULTADOS DE CONSTRUCTORES
// =========================================

export async function POST(
  request: Request
) {
  try {
    // -----------------------------------------
    // 1. Comprobar autenticación y SuperAdmin
    // -----------------------------------------

    const usuario =
      await comprobarSuperAdmin(
        request
      );

    if (!usuario) {
      return NextResponse.json(
        {
          error:
            "No autorizado.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 2. Leer datos recibidos
    // -----------------------------------------

    const body =
      await request.json();

    const granPremioId =
      Number(
        body.gran_premio_id
      );

    const constructores =
      Array.isArray(
        body.constructores
      )
        ? body.constructores
        : null;

    // -----------------------------------------
    // 3. Validar Gran Premio
    // -----------------------------------------

    if (
      !Number.isInteger(
        granPremioId
      ) ||
      granPremioId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "Gran Premio no válido.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 4. Validar constructores
    // -----------------------------------------

    if (!constructores) {
      return NextResponse.json(
        {
          error:
            "Datos de constructores no válidos.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 5. Guardar resultados
    // -----------------------------------------

    for (
      const constructor
      of constructores
    ) {
      const constructorId =
        Number(
          constructor.id
        );

      const puntosFantasy =
        Number(
          constructor.puntos_gp
        );

      const puntosOficiales =
        Number(
          constructor.puntos
        );

      // -----------------------------------------
      // Validar ID
      // -----------------------------------------

      if (
        !Number.isInteger(
          constructorId
        ) ||
        constructorId <= 0
      ) {
        return NextResponse.json(
          {
            error:
              "ID de constructor no válido.",
          },
          { status: 400 }
        );
      }

      // -----------------------------------------
      // Validar puntos Fantasy
      // -----------------------------------------

      if (
        !Number.isFinite(
          puntosFantasy
        ) ||
        puntosFantasy < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Puntos Fantasy no válidos.",
          },
          { status: 400 }
        );
      }

      // -----------------------------------------
      // Validar puntos oficiales
      // -----------------------------------------

      if (
        !Number.isFinite(
          puntosOficiales
        ) ||
        puntosOficiales < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Puntos oficiales no válidos.",
          },
          { status: 400 }
        );
      }

      // -----------------------------------------
      // Guardar histórico del GP
      // -----------------------------------------

      const {
        error: errorHistorico,
      } = await supabase
        .from(
          "resultados_constructores_gp"
        )
        .upsert(
          {
            gran_premio_id:
              granPremioId,

            constructor_id:
              constructorId,

            puntos_fantasy:
              puntosFantasy,

            puntos_oficiales:
              puntosOficiales,
          },
          {
            onConflict:
              "gran_premio_id,constructor_id",
          }
        );

      if (errorHistorico) {
        console.error(
          "Error guardando histórico de constructor:",
          errorHistorico
        );

        return NextResponse.json(
          {
            error:
              errorHistorico.message,
          },
          { status: 500 }
        );
      }

      // -----------------------------------------
      // Actualizar puntos Fantasy actuales
      // -----------------------------------------

      const {
        error: errorConstructor,
      } = await supabase
        .from("constructores")
        .update({
          puntos_gp:
            puntosFantasy,
        })
        .eq(
          "id",
          constructorId
        );

      if (errorConstructor) {
        console.error(
          "Error actualizando constructor:",
          errorConstructor
        );

        return NextResponse.json(
          {
            error:
              errorConstructor.message,
          },
          { status: 500 }
        );
      }
    }

    // -----------------------------------------
    // 6. Respuesta correcta
    // -----------------------------------------

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Error en API de resultados de constructores:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
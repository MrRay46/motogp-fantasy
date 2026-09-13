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

// =====================================================
// COMPROBAR SUPERADMIN
// =====================================================

async function comprobarSuperAdmin(
  request: Request
) {
  const authorization =
    request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return null;
  }

  const accessToken =
    authorization.substring(7);

  if (!accessToken) {
    return null;
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser(
    accessToken
  );

  if (authError || !user) {
    return null;
  }

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
      user.id
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

// =====================================================
// POST — GUARDAR DATOS DESTACADOS DEL GP
// =====================================================

export async function POST(
  request: Request
) {
  try {
    // -----------------------------------------
    // 1. COMPROBAR SUPERADMIN
    // -----------------------------------------

    const usuario =
      await comprobarSuperAdmin(
        request
      );

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        {
          status: 403,
        }
      );
    }

    // -----------------------------------------
    // 2. LEER DATOS
    // -----------------------------------------

    const body =
      await request.json();

    const granPremioId =
      Number(
        body.gran_premio_id
      );

    const ganadorSprint =
      body.piloto_ganador_sprint_id;

    const pilotoGanadorSprint =
      body.piloto_ganador_sprint;

    const ganadorCarrera =
      body.piloto_ganador_id;

    const pilotoGanador =
      body.piloto_ganador;

    const pilotoForma =
      body.piloto_forma_id;

    const pilotoFormaNombre =
      body.piloto_forma;

    const constructorGanador =
      body.constructor_ganador;

    const constructorForma =
      body.constructor_forma;

    // -----------------------------------------
    // 3. VALIDAR GP
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
            "ID de Gran Premio no válido.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // 4. VALIDAR IDs DE PILOTOS
    // -----------------------------------------

    if (
      ganadorSprint !== null &&
      ganadorSprint !== undefined &&
      (
        !Number.isInteger(
          Number(ganadorSprint)
        ) ||
        Number(ganadorSprint) <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "ID del ganador del Sprint no válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      ganadorCarrera !== null &&
      ganadorCarrera !== undefined &&
      (
        !Number.isInteger(
          Number(ganadorCarrera)
        ) ||
        Number(ganadorCarrera) <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "ID del ganador de carrera no válido.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      pilotoForma !== null &&
      pilotoForma !== undefined &&
      (
        !Number.isInteger(
          Number(pilotoForma)
        ) ||
        Number(pilotoForma) <= 0
      )
    ) {
      return NextResponse.json(
        {
          error:
            "ID del piloto en forma no válido.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // 5. COMPROBAR QUE EL GP EXISTE
    // -----------------------------------------

    const {
      data: granPremio,
      error: granPremioError,
    } = await supabase
      .from("grandes_premios")
      .select(
        "id, nombre"
      )
      .eq(
        "id",
        granPremioId
      )
      .single();

    if (
      granPremioError ||
      !granPremio
    ) {
      console.error(
        "Error comprobando GP:",
        granPremioError
      );

      return NextResponse.json(
        {
          error:
            "El Gran Premio seleccionado no existe.",
        },
        {
          status: 400,
        }
      );
    }

    // -----------------------------------------
    // 6. ACTUALIZAR GRANDES PREMIOS
    // -----------------------------------------

    const {
      data: gpActualizado,
      error: updateError,
    } = await supabase
      .from("grandes_premios")
      .update({
        piloto_ganador_sprint_id:
          ganadorSprint !== undefined
            ? ganadorSprint
            : null,

        piloto_ganador_sprint:
          pilotoGanadorSprint ??
          null,

        piloto_ganador_id:
          ganadorCarrera !== undefined
            ? ganadorCarrera
            : null,

        piloto_ganador:
          pilotoGanador ??
          null,

        piloto_forma_id:
          pilotoForma !== undefined
            ? pilotoForma
            : null,

        piloto_forma:
          pilotoFormaNombre ??
          null,

        constructor_ganador:
          constructorGanador ||
          null,

        constructor_forma:
          constructorForma ||
          null,
      })
      .eq(
        "id",
        granPremioId
      )
      .select(
        `
          id,
          nombre,
          piloto_ganador_sprint_id,
          piloto_ganador_sprint,
          piloto_ganador_id,
          piloto_ganador,
          piloto_forma_id,
          piloto_forma,
          constructor_ganador,
          constructor_forma
        `
      )
      .single();

    if (updateError) {
      console.error(
        "Error actualizando datos del GP:",
        updateError
      );

      return NextResponse.json(
        {
          error:
            `Error actualizando el GP: ${updateError.message}`,
        },
        {
          status: 500,
        }
      );
    }

    // -----------------------------------------
    // 7. RESPUESTA
    // -----------------------------------------

    return NextResponse.json({
      ok: true,
      gran_premio:
        gpActualizado,
    });
  } catch (error) {
    console.error(
      "Error en API de datos del GP:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      {
        status: 500,
      }
    );
  }
}
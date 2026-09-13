import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verificarSesion } from "@/lib/auth/auth";

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

async function comprobarSuperAdmin() {
  const cookieStore = await cookies();

  // -----------------------------------------
  // 1. Intentar sesión antigua
  // -----------------------------------------

  const token =
    cookieStore.get("rayongrid_session")?.value;

  const sesion = verificarSesion(token);

  if (sesion) {
    const { data: usuario, error } =
      await supabase
        .from("usuarios")
        .select("id, super_admin, activo")
        .eq("id", sesion.usuarioId)
        .single();

    if (
      !error &&
      usuario &&
      usuario.activo === true &&
      usuario.super_admin === true
    ) {
      return usuario;
    }
  }

  // -----------------------------------------
  // 2. Intentar sesión de Supabase Auth
  // -----------------------------------------

  const authorization =
    cookieStore.get(
      "sb-edlpwbhgxixiyivvljtk-auth-token"
    )?.value;

  if (!authorization) {
    return null;
  }

  try {
    const parsed =
      JSON.parse(authorization);

    const accessToken =
      parsed?.access_token;

    if (!accessToken) {
      return null;
    }

    const {
      data: authData,
      error: authError,
    } = await supabase.auth.getUser(
      accessToken
    );

    if (
      authError ||
      !authData.user
    ) {
      return null;
    }

    const {
      data: usuario,
      error,
    } = await supabase
      .from("usuarios")
      .select("id, super_admin, activo")
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
  } catch (error) {
    console.error(
      "Error comprobando sesión de Supabase Auth:",
      error
    );

    return null;
  }
}

export async function POST(request: Request) {
  try {
    const usuario = await comprobarSuperAdmin();

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const granPremioId = Number(
      body.gran_premio_id
    );

    const constructores = Array.isArray(
      body.constructores
    )
      ? body.constructores
      : null;

    if (
      !Number.isInteger(granPremioId) ||
      granPremioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Gran Premio no válido.",
        },
        { status: 400 }
      );
    }

    if (!constructores) {
      return NextResponse.json(
        {
          error: "Datos de constructores no válidos.",
        },
        { status: 400 }
      );
    }

    for (const constructor of constructores) {
      const constructorId = Number(
        constructor.id
      );

      const puntosFantasy = Number(
        constructor.puntos_gp
      );

      const puntosOficiales = Number(
        constructor.puntos
      );

      if (
        !Number.isInteger(constructorId) ||
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

      if (
        !Number.isFinite(puntosFantasy) ||
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

      if (
        !Number.isFinite(puntosOficiales) ||
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

      const { error: errorHistorico } =
        await supabase
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

      const {
        error: errorConstructor,
      } = await supabase
        .from("constructores")
        .update({
          puntos_gp:
            puntosFantasy,
        })
        .eq("id", constructorId);

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
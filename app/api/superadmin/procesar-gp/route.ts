import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { procesarGranPremio } from "@/lib/fantasy/procesarGranPremio";

export async function POST(request: Request) {
  try {
    // -----------------------------------------
    // AUTENTICACIÓN SUPABASE
    // -----------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        {
          error:
            "No se ha proporcionado un token de autenticación.",
        },
        { status: 401 }
      );
    }

    const accessToken =
      authorization.substring("Bearer ".length);

    // -----------------------------------------
    // COMPROBAR USUARIO AUTH
    // -----------------------------------------

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.getUser(
      accessToken
    );

    if (authError || !authData.user) {
      return NextResponse.json(
        {
          error:
            "La sesión de Supabase no es válida.",
        },
        { status: 401 }
      );
    }

    const authUserId = authData.user.id;

    // -----------------------------------------
    // BUSCAR USUARIO RAYONGRID
    // -----------------------------------------

    const {
      data: usuario,
      error: usuarioError,
    } = await supabaseAdmin
      .from("usuarios")
      .select(`
        id,
        activo,
        super_admin
      `)
      .eq("auth_user_id", authUserId)
      .single();

    if (usuarioError || !usuario) {
      return NextResponse.json(
        {
          error:
            "No se ha encontrado el usuario Rayongrid asociado a esta cuenta.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // COMPROBAR SUPERADMIN
    // -----------------------------------------

    if (
      usuario.activo !== true ||
      usuario.super_admin !== true
    ) {
      return NextResponse.json(
        {
          error:
            "No tienes permisos de SuperAdmin.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // LEER DATOS DE LA PETICIÓN
    // -----------------------------------------

    const body = await request.json();

    const granPremioId =
      Number(body?.granPremioId);

    if (
      !Number.isInteger(granPremioId) ||
      granPremioId <= 0
    ) {
      return NextResponse.json(
        {
          error:
            "El Gran Premio seleccionado no es válido.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // PROCESAR GRAN PREMIO
    // -----------------------------------------

    const resultado =
      await procesarGranPremio(
        granPremioId,
        usuario.id
      );

    // -----------------------------------------
    // RESPUESTA
    // -----------------------------------------

    return NextResponse.json(
      {
        ok: true,
        granPremio: resultado.granPremio,
        equiposProcesados:
          resultado.equiposProcesados,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error procesando Gran Premio:",
      error
    );

    const mensaje =
      error instanceof Error
        ? error.message
        : "Ha ocurrido un error desconocido.";

    return NextResponse.json(
      {
        error: mensaje,
      },
      { status: 500 }
    );
  }
}
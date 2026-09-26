
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    //----------------------------------------
    // 1. VALIDAR SESIÓN
    //----------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No has iniciado sesión." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return NextResponse.json(
        { error: "Token de sesión no válido." },
        { status: 401 }
      );
    }

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "La sesión no es válida o ha caducado." },
        { status: 401 }
      );
    }

    const authUserId = authData.user.id;

    //----------------------------------------
    // 2. OBTENER USUARIO RAYONGRID
    //----------------------------------------

    const {
      data: usuario,
      error: errorUsuario,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id, activo")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (errorUsuario) {
      console.error(
        "Error obteniendo usuario:",
        errorUsuario
      );

      return NextResponse.json(
        { error: "No se pudo comprobar tu cuenta." },
        { status: 500 }
      );
    }

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Tu cuenta no está activa o no existe." },
        { status: 403 }
      );
    }

    //----------------------------------------
    // 3. VALIDAR ID DE LA LIGA
    //----------------------------------------

    const body = await request.json();
    const ligaId = body.liga_id;

    if (
      typeof ligaId !== "number" ||
      !Number.isSafeInteger(ligaId) ||
      ligaId <= 0
    ) {
      return NextResponse.json(
        { error: "El identificador de liga no es válido." },
        { status: 400 }
      );
    }

    //----------------------------------------
    // 4. COMPROBAR PERTENENCIA A LA LIGA
    //----------------------------------------

    const {
      data: relacion,
      error: errorRelacion,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (errorRelacion) {
      console.error(
        "Error comprobando pertenencia:",
        errorRelacion
      );

      return NextResponse.json(
        { error: "No se pudo comprobar tu pertenencia a la liga." },
        { status: 500 }
      );
    }

    if (!relacion) {
      return NextResponse.json(
        { error: "No perteneces a esta liga." },
        { status: 403 }
      );
    }

    //----------------------------------------
    // 5. ACTUALIZAR LIGA ACTIVA
    //----------------------------------------

    const {
      data: ligaActualizada,
      error: errorUpdate,
    } = await supabaseAdmin
      .from("usuarios")
      .update({
        liga_actual_id: ligaId,
      })
      .eq("id", usuario.id)
      .eq("auth_user_id", authUserId)
      .select("id, liga_actual_id")
      .single();

    if (errorUpdate || !ligaActualizada) {
      console.error(
        "Error actualizando liga activa:",
        errorUpdate
      );

      return NextResponse.json(
        { error: "No se pudo cambiar de liga." },
        { status: 500 }
      );
    }

    //----------------------------------------
    // 6. RESPUESTA
    //----------------------------------------

    return NextResponse.json({
      ok: true,
      liga_actual_id: ligaActualizada.liga_actual_id,
    });
  } catch (error) {
    console.error(
      "Error en API de selección de liga:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

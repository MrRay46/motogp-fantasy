
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    //----------------------------------------
    // 1. VALIDAR SESIÓN DE SUPABASE AUTH
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
    // 2. OBTENER USUARIO RAYONGRID REAL
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
    // 3. VALIDAR CÓDIGO
    //----------------------------------------

    const body = await request.json();

    const codigo =
      typeof body.codigo === "string"
        ? body.codigo.trim().toUpperCase()
        : "";

    if (!codigo) {
      return NextResponse.json(
        { error: "Introduce un código de liga." },
        { status: 400 }
      );
    }

    //----------------------------------------
    // 4. BUSCAR LIGA
    //----------------------------------------

    const {
      data: liga,
      error: errorLiga,
    } = await supabaseAdmin
      .from("ligas")
      .select("id, nombre, codigo, activa")
      .eq("codigo", codigo)
      .maybeSingle();

    if (errorLiga) {
      console.error(
        "Error buscando liga:",
        errorLiga
      );

      return NextResponse.json(
        { error: "No se pudo comprobar el código." },
        { status: 500 }
      );
    }

    if (!liga) {
      return NextResponse.json(
        { error: "Ese código no existe." },
        { status: 404 }
      );
    }

    if (!liga.activa) {
      return NextResponse.json(
        { error: "Esta liga no está activa." },
        { status: 400 }
      );
    }

    //----------------------------------------
    // 5. COMPROBAR SI YA PERTENECE
    //----------------------------------------

    const {
      data: existente,
      error: errorExistente,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", liga.id)
      .maybeSingle();

    if (errorExistente) {
      console.error(
        "Error comprobando pertenencia:",
        errorExistente
      );

      return NextResponse.json(
        { error: "No se pudo comprobar la liga." },
        { status: 500 }
      );
    }

    if (existente) {
      return NextResponse.json(
        { error: "Ya perteneces a esta liga." },
        { status: 409 }
      );
    }

    //----------------------------------------
    // 6. AÑADIR USUARIO A LA LIGA
    //----------------------------------------

    const {
      error: errorRelacion,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .insert({
        usuario_id: usuario.id,
        liga_id: liga.id,
        admin_liga: false,
        codigo: liga.codigo,
      });

    if (errorRelacion) {
      console.error(
        "Error creando relación usuario-liga:",
        errorRelacion
      );

      return NextResponse.json(
        { error: "No se pudo completar la inscripción." },
        { status: 500 }
      );
    }

    //----------------------------------------
    // 7. ACTUALIZAR LIGA ACTIVA
    //----------------------------------------

    const {
      error: errorUpdate,
    } = await supabaseAdmin
      .from("usuarios")
      .update({
        liga_actual_id: liga.id,
      })
      .eq("id", usuario.id)
      .eq("auth_user_id", authUserId);

    if (errorUpdate) {
      console.error(
        "Error actualizando liga activa:",
        errorUpdate
      );

      // Intentar deshacer la relación creada
      const {
        error: errorRollback,
      } = await supabaseAdmin
        .from("usuarios_ligas")
        .delete()
        .eq("usuario_id", usuario.id)
        .eq("liga_id", liga.id);

      if (errorRollback) {
        console.error(
          "Error limpiando relación incompleta:",
          errorRollback
        );
      }

      return NextResponse.json(
        { error: "No se pudo establecer la liga activa." },
        { status: 500 }
      );
    }

    //----------------------------------------
    // 8. RESPUESTA
    //----------------------------------------

    return NextResponse.json(
      {
        ok: true,
        liga: {
          id: liga.id,
          nombre: liga.nombre,
          codigo: liga.codigo,
          admin_liga: false,
        },
        liga_actual_id: liga.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "Error en API para unirse a liga:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

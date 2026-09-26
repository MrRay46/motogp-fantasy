
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    // 1. Comprobar sesión de Supabase Auth
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

    // 2. Obtener el usuario interno de Rayongrid
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

    // 3. Validar los datos recibidos
    const body = await request.json();

    const usuario_id = Number(body.usuario_id);
    const activo = body.activo;

    const liga_id = Number(body.liga_id);

    if (
      !Number.isSafeInteger(usuario_id) ||
      usuario_id <= 0 ||
      !Number.isSafeInteger(liga_id) ||
      liga_id <= 0 ||
      typeof activo !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Datos de solicitud no válidos." },
        { status: 400 }
      );
    }

    // 4. Comprobar que el administrador administra esa liga
    const { data: membresiaAdmin, error: errorMembresia } =
      await supabaseAdmin
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

    // 5. Comprobar que el participante pertenece a esa liga
    const { data: membresiaParticipante, error: errorParticipante } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuario_id)
        .eq("liga_id", liga_id)
        .maybeSingle();

    if (errorParticipante || !membresiaParticipante) {
      return NextResponse.json(
        {
          error:
            "El participante no pertenece a esta liga.",
        },
        { status: 404 }
      );
    }

    // 6. Actualizar el estado del participante
    const { error: errorUpdate } = await supabaseAdmin
      .from("usuarios")
      .update({ activo })
      .eq("id", usuario_id);

    if (errorUpdate) {
      console.error("Error actualizando participante:", errorUpdate);

      return NextResponse.json(
        { error: "No se pudo actualizar el participante." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      usuario_id,
      activo,
    });
  } catch (error) {
    console.error("Error en API de participantes:", error);

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

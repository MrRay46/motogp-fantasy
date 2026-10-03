import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7).trim();

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

    const { data: usuarioAdmin, error: errorAdmin } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, activo, liga_actual_id")
        .eq("auth_user_id", authUser.id)
        .maybeSingle();

    if (
      errorAdmin ||
      !usuarioAdmin ||
      !usuarioAdmin.activo ||
      !usuarioAdmin.liga_actual_id
    ) {
      return NextResponse.json(
        { error: "Usuario no autorizado o sin liga activa." },
        { status: 403 }
      );
    }

    const ligaId = usuarioAdmin.liga_actual_id;

    const { data: membresiaAdmin, error: errorMembresia } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuarioAdmin.id)
        .eq("liga_id", ligaId)
        .eq("admin_liga", true)
        .maybeSingle();

    if (errorMembresia || !membresiaAdmin) {
      return NextResponse.json(
        { error: "No tienes permisos de administrador en esta liga." },
        { status: 403 }
      );
    }

    const { data: liga, error: errorLiga } =
      await supabaseAdmin
        .from("ligas")
        .select("codigo")
        .eq("id", ligaId)
        .maybeSingle();

    if (errorLiga || !liga) {
      console.error("Error obteniendo liga:", errorLiga);
      return NextResponse.json(
        { error: "No se pudo obtener la liga." },
        { status: 500 }
      );
    }

    const { data: relaciones, error: errorRelaciones } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("liga_id", ligaId);

    if (errorRelaciones) {
      console.error("Error obteniendo miembros:", errorRelaciones);
      return NextResponse.json(
        { error: "No se pudieron obtener los participantes." },
        { status: 500 }
      );
    }

    const usuarioIds = (relaciones ?? []).map(
      (relacion) => relacion.usuario_id
    );

    if (usuarioIds.length === 0) {
      return NextResponse.json({
        codigo: liga.codigo,
        participantes: [],
      });
    }

    const { data: participantes, error: errorParticipantes } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, usuario, avatar, activo")
        .in("id", usuarioIds)
        .order("usuario");

    if (errorParticipantes) {
      console.error("Error obteniendo participantes:", errorParticipantes);
      return NextResponse.json(
        { error: "No se pudieron obtener los participantes." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      codigo: liga.codigo,
      participantes: participantes ?? [],
    });
  } catch (error) {
    console.error("Error en GET de participantes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7).trim();

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

    const body = await request.json();
    const usuarioId = Number(body.usuario_id);
    const ligaId = Number(body.liga_id);
    const activo = body.activo;

    if (
      !Number.isSafeInteger(usuarioId) ||
      usuarioId <= 0 ||
      !Number.isSafeInteger(ligaId) ||
      ligaId <= 0 ||
      typeof activo !== "boolean"
    ) {
      return NextResponse.json(
        { error: "Datos de solicitud no válidos." },
        { status: 400 }
      );
    }

    const { data: membresiaAdmin, error: errorMembresia } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuarioAdmin.id)
        .eq("liga_id", ligaId)
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

    const {
      data: membresiaParticipante,
      error: errorParticipante,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("usuario_id", usuarioId)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (errorParticipante || !membresiaParticipante) {
      return NextResponse.json(
        { error: "El participante no pertenece a esta liga." },
        { status: 404 }
      );
    }

    const { error: errorUpdate } =
      await supabaseAdmin
        .from("usuarios")
        .update({ activo })
        .eq("id", usuarioId);

    if (errorUpdate) {
      console.error("Error actualizando participante:", errorUpdate);
      return NextResponse.json(
        { error: "No se pudo actualizar el participante." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      usuario_id: usuarioId,
      activo,
    });
  } catch (error) {
    console.error("Error en POST de participantes:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
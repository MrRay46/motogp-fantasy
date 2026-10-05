import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No autenticado." },
        { status: 401 }
      );
    }

    const accessToken =
      authorization.replace("Bearer ", "").trim();

    if (!accessToken) {
      return NextResponse.json(
        { error: "Token de acceso no válido." },
        { status: 401 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(accessToken);

    if (authError || !user) {
      return NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      );
    }

    const { data: usuario, error: usuarioError } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, usuario, activo")
        .eq("auth_user_id", user.id)
        .maybeSingle();

    if (usuarioError) {
      console.error(
        "Error obteniendo usuario público:",
        usuarioError
      );

      return NextResponse.json(
        { error: "Error obteniendo el usuario." },
        { status: 500 }
      );
    }

    if (!usuario) {
      return NextResponse.json(
        { error: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: "Usuario inactivo." },
        { status: 403 }
      );
    }

    const url = new URL(request.url);
    const ligaIdParam =
      url.searchParams.get("liga_id");
    const ligaId = Number(ligaIdParam);

    if (
      !ligaIdParam ||
      !Number.isInteger(ligaId) ||
      ligaId <= 0
    ) {
      return NextResponse.json(
        { error: "Liga no válida." },
        { status: 400 }
      );
    }

    const { data: membresia, error: membresiaError } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (membresiaError) {
      console.error(
        "Error comprobando pertenencia a la liga:",
        membresiaError
      );

      return NextResponse.json(
        { error: "Error comprobando la liga." },
        { status: 500 }
      );
    }

    if (!membresia) {
      return NextResponse.json(
        { error: "No perteneces a esta liga." },
        { status: 403 }
      );
    }

    const { data: equipo, error: equipoError } =
      await supabaseAdmin
        .from("equipos")
        .select(`
          fichados,
          reserva,
          motor,
          puntos,
          puntos_gp_actual,
          prediccion_piloto,
          prediccion_motor,
          prediccion_piloto_original,
          prediccion_motor_original,
          prediccion_piloto_modificada,
          prediccion_motor_modificada,
          constructor_modificado,
          reserva_modificada,
          cambios_pilotos
        `)
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (equipoError) {
      console.error(
        "Error obteniendo equipo:",
        equipoError
      );

      return NextResponse.json(
        { error: "Error obteniendo el equipo." },
        { status: 500 }
      );
    }

    if (!equipo) {
      return NextResponse.json(
        {
          equipo: null,
          usuario: {
            id: usuario.id,
            usuario: usuario.usuario,
          },
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      equipo,
      usuario: {
        id: usuario.id,
        usuario: usuario.usuario,
      },
    });
  } catch (error) {
    console.error(
      "Error inesperado obteniendo equipo:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
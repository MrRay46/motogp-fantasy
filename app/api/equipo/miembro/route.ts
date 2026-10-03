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

    const token = authorization.slice(7).trim();

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "Sesión no válida." },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const jugadorIdParam = url.searchParams.get("jugador_id");
    const ligaIdParam = url.searchParams.get("liga_id");
    const jugadorId = Number(jugadorIdParam);
    const ligaId = Number(ligaIdParam);

    if (
      !jugadorIdParam ||
      !Number.isSafeInteger(jugadorId) ||
      jugadorId <= 0 ||
      !ligaIdParam ||
      !Number.isSafeInteger(ligaId) ||
      ligaId <= 0
    ) {
      return NextResponse.json(
        { error: "Jugador o liga no válidos." },
        { status: 400 }
      );
    }

    const { data: usuario, error: usuarioError } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, activo")
        .eq("auth_user_id", authUser.id)
        .maybeSingle();

    if (usuarioError) {
      console.error("Error obteniendo usuario:", usuarioError);
      return NextResponse.json(
        { error: "Error obteniendo el usuario." },
        { status: 500 }
      );
    }

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Usuario no encontrado o inactivo." },
        { status: 403 }
      );
    }

    // Quien consulta debe pertenecer a la liga.
    const { data: membresiaSolicitante, error: errorSolicitante } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (errorSolicitante) {
      console.error("Error comprobando membresía:", errorSolicitante);
      return NextResponse.json(
        { error: "Error comprobando la liga." },
        { status: 500 }
      );
    }

    if (!membresiaSolicitante) {
      return NextResponse.json(
        { error: "No perteneces a esta liga." },
        { status: 403 }
      );
    }

    // El jugador consultado también debe pertenecer a esa liga.
    const { data: membresiaJugador, error: errorJugador } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", jugadorId)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (errorJugador) {
      console.error("Error comprobando al jugador:", errorJugador);
      return NextResponse.json(
        { error: "Error comprobando el jugador." },
        { status: 500 }
      );
    }

    if (!membresiaJugador) {
      return NextResponse.json(
        { error: "El jugador no pertenece a esta liga." },
        { status: 404 }
      );
    }

    const { data: equipo, error: equipoError } =
      await supabaseAdmin
        .from("equipos")
        .select(`
          fichados,
          reserva,
          motor,
          prediccion_piloto,
          prediccion_motor,
          prediccion_piloto_modificada,
          prediccion_motor_modificada
        `)
        .eq("usuario_id", jugadorId)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (equipoError) {
      console.error("Error obteniendo equipo:", equipoError);
      return NextResponse.json(
        { error: "Error obteniendo el equipo." },
        { status: 500 }
      );
    }

    if (!equipo) {
      return NextResponse.json({ equipo: null });
    }

    return NextResponse.json({
      equipo: {
        titulares: equipo.fichados ?? [],
        reserva: equipo.reserva ?? "",
        motor: equipo.motor ?? "",
        prediccionPiloto: equipo.prediccion_piloto ?? "",
        prediccionMotor: equipo.prediccion_motor ?? "",
        pilotoModificada:
          equipo.prediccion_piloto_modificada ?? false,
        motorModificada:
          equipo.prediccion_motor_modificada ?? false,
      },
    });
  } catch (error) {
    console.error("Error inesperado obteniendo equipo:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
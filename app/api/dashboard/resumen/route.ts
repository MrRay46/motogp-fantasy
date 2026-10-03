import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

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

    const { data: usuario, error: usuarioError } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, activo, liga_actual_id")
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

    const ligaId = usuario.liga_actual_id;

    if (!ligaId) {
      return NextResponse.json({
        rendimiento: null,
        ganador: null,
      });
    }

    const { data: membresia, error: membresiaError } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("usuario_id")
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (membresiaError) {
      console.error("Error comprobando membresía:", membresiaError);
      return NextResponse.json(
        { error: "Error comprobando la liga." },
        { status: 500 }
      );
    }

    if (!membresia) {
      return NextResponse.json(
        { error: "No perteneces a tu liga seleccionada." },
        { status: 403 }
      );
    }

    const { data: rendimiento, error: rendimientoError } =
      await supabaseAdmin
        .from("equipos")
        .select(`
          puntos,
          posicion_actual,
          posicion_anterior,
          diferencia_lider,
          diferencia_lider_anterior
        `)
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (rendimientoError) {
      console.error("Error obteniendo rendimiento:", rendimientoError);
      return NextResponse.json(
        { error: "Error obteniendo el rendimiento." },
        { status: 500 }
      );
    }

    const { data: gp, error: gpError } =
      await supabaseAdmin
        .from("grandes_premios")
        .select("nombre")
        .eq("fantasy_procesado", true)
        .order("orden", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (gpError) {
      console.error("Error obteniendo último GP:", gpError);
      return NextResponse.json(
        { error: "Error obteniendo el último GP." },
        { status: 500 }
      );
    }

    let ganador = null;

    if (gp) {
      const { data: equipoGanador, error: equipoGanadorError } =
        await supabaseAdmin
          .from("equipos")
          .select("usuario_id, usuario, puntos_gp_actual")
          .eq("liga_id", ligaId)
          .order("puntos_gp_actual", { ascending: false })
          .limit(1)
          .maybeSingle();

      if (equipoGanadorError) {
        console.error(
          "Error obteniendo equipo ganador:",
          equipoGanadorError
        );
        return NextResponse.json(
          { error: "Error obteniendo el ganador del GP." },
          { status: 500 }
        );
      }

      if (equipoGanador) {
        const { data: usuarioGanador, error: avatarError } =
          await supabaseAdmin
            .from("usuarios")
            .select("avatar")
            .eq("id", equipoGanador.usuario_id)
            .maybeSingle();

        if (avatarError) {
          console.error(
            "Error obteniendo avatar del ganador:",
            avatarError
          );
        }

        ganador = {
          nombreGP: gp.nombre,
          usuario: equipoGanador.usuario,
          puntos: equipoGanador.puntos_gp_actual ?? 0,
          avatar: usuarioGanador?.avatar ?? "avatar1.png",
        };
      }
    }

    return NextResponse.json({
      rendimiento: rendimiento ?? null,
      ganador,
    });
  } catch (error) {
    console.error("Error inesperado obteniendo resumen:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
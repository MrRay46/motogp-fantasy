import { NextResponse } from "next/server";

import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(request: Request) {
  try {
    // --------------------------------------------------
    // AUTENTICACIÓN
    // --------------------------------------------------

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

    // --------------------------------------------------
    // IDENTIFICAR USUARIO AUTENTICADO
    // --------------------------------------------------

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

    // --------------------------------------------------
    // OBTENER USUARIO PÚBLICO
    // --------------------------------------------------

    const { data: usuario, error: usuarioError } =
      await supabaseAdmin
        .from("usuarios")
        .select("id, activo")
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

    // --------------------------------------------------
    // OBTENER LIGA
    // --------------------------------------------------

    const url = new URL(request.url);

    const ligaIdParam =
      url.searchParams.get("liga_id");

    const ligaId =
      Number(ligaIdParam);

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

    // --------------------------------------------------
    // COMPROBAR QUE EL USUARIO PERTENECE A LA LIGA
    // --------------------------------------------------

    const {
      data: membresia,
      error: membresiaError,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (membresiaError) {
      console.error(
        "Error comprobando membresía:",
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

    // --------------------------------------------------
    // OBTENER MIEMBROS DE LA LIGA
    // --------------------------------------------------

    const {
      data: relaciones,
      error: relacionesError,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("liga_id", ligaId);

    if (relacionesError) {
      console.error(
        "Error obteniendo miembros de la liga:",
        relacionesError
      );

      return NextResponse.json(
        { error: "Error obteniendo los miembros." },
        { status: 500 }
      );
    }

    if (!relaciones?.length) {
      return NextResponse.json({
        ranking: [],
      });
    }

    const usuarioIds =
      relaciones.map(
        (relacion) => relacion.usuario_id
      );

    // --------------------------------------------------
    // OBTENER DATOS PÚBLICOS DE LOS USUARIOS
    // --------------------------------------------------

    const {
      data: usuarios,
      error: usuariosError,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id, usuario, avatar")
      .in("id", usuarioIds);

    if (usuariosError) {
      console.error(
        "Error obteniendo usuarios:",
        usuariosError
      );

      return NextResponse.json(
        { error: "Error obteniendo los usuarios." },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // OBTENER DATOS NECESARIOS DE LOS EQUIPOS
    // --------------------------------------------------

    const {
      data: equipos,
      error: equiposError,
    } = await supabaseAdmin
      .from("equipos")
      .select(
        "usuario_id, puntos, posicion_anterior"
      )
      .eq("liga_id", ligaId)
      .in("usuario_id", usuarioIds);

    if (equiposError) {
      console.error(
        "Error obteniendo equipos:",
        equiposError
      );

      return NextResponse.json(
        { error: "Error obteniendo los equipos." },
        { status: 500 }
      );
    }

    // --------------------------------------------------
    // MAPA DE EQUIPOS
    // --------------------------------------------------

    const equiposMap = new Map(
      (equipos ?? []).map(
        (equipo) => [
          equipo.usuario_id,
          equipo,
        ]
      )
    );

    // --------------------------------------------------
    // CONSTRUIR RANKING
    // --------------------------------------------------

    const rankingBase = (
      usuarios ?? []
    ).map((usuarioLiga) => {
      const equipo =
        equiposMap.get(usuarioLiga.id);

      return {
        id: usuarioLiga.id,

        usuario:
          usuarioLiga.usuario,

        avatar:
          usuarioLiga.avatar,

        puntos:
          equipo?.puntos ?? 0,

        posicionAnterior:
          equipo?.posicion_anterior ?? 0,
      };
    });

    // --------------------------------------------------
    // ORDENAR POR PUNTOS
    // --------------------------------------------------

    rankingBase.sort(
      (a, b) => b.puntos - a.puntos
    );

    // --------------------------------------------------
    // CALCULAR POSICIONES Y MOVIMIENTO
    // --------------------------------------------------

    const ranking = rankingBase.map(
      (jugador, index) => {
        const posicionActual =
          index + 1;

        let movimiento:
          | "up"
          | "down"
          | "same" = "same";

        if (jugador.posicionAnterior) {
          if (
            posicionActual <
            jugador.posicionAnterior
          ) {
            movimiento = "up";
          } else if (
            posicionActual >
            jugador.posicionAnterior
          ) {
            movimiento = "down";
          }
        }

        return {
          id: jugador.id,

          usuario: jugador.usuario,

          avatar: jugador.avatar,

          puntos: jugador.puntos,

          posicion: posicionActual,

          posicionAnterior:
            jugador.posicionAnterior,

          movimiento,
        };
      }
    );

    // --------------------------------------------------
    // RESPUESTA
    // --------------------------------------------------

    return NextResponse.json({
      ranking,
    });
  } catch (error) {
    console.error(
      "Error inesperado obteniendo clasificación:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
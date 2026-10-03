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
        .select(
          "id, usuario, email, avatar, liga_actual_id, super_admin, activo"
        )
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

    const { data: membresias, error: membresiasError } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("liga_id, admin_liga")
        .eq("usuario_id", usuario.id);

    if (membresiasError) {
      console.error("Error obteniendo membresías:", membresiasError);
      return NextResponse.json(
        { error: "Error obteniendo las ligas del usuario." },
        { status: 500 }
      );
    }

    const ligaIds = (membresias ?? []).map(
      (membresia) => membresia.liga_id
    );

    let ligas: {
      id: number;
      nombre: string;
      codigo: string;
      admin_liga: boolean;
    }[] = [];

    if (ligaIds.length > 0) {
      const { data: datosLigas, error: ligasError } =
        await supabaseAdmin
          .from("ligas")
          .select("id, nombre, codigo")
          .in("id", ligaIds);

      if (ligasError) {
        console.error("Error obteniendo ligas:", ligasError);
        return NextResponse.json(
          { error: "Error obteniendo las ligas." },
          { status: 500 }
        );
      }

      ligas = (datosLigas ?? []).map((liga) => {
        const membresia = membresias?.find(
          (item) => item.liga_id === liga.id
        );

        return {
          id: liga.id,
          nombre: liga.nombre,
          codigo: liga.codigo,
          admin_liga: membresia?.admin_liga ?? false,
        };
      });
    }

    const ligaActual =
      ligas.find((liga) => liga.id === usuario.liga_actual_id) ??
      null;

    return NextResponse.json(
      {
        usuario: {
          id: usuario.id,
          usuario: usuario.usuario,
          email: usuario.email,
          avatar: usuario.avatar,
          liga_actual_id: ligaActual?.id ?? null,
          super_admin: usuario.super_admin,
        },
        ligas,
        ligaActual,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("Error inesperado obteniendo contexto:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
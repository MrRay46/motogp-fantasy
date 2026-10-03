import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const avataresPermitidos = new Set(
  Array.from({ length: 13 }, (_, i) => `avatar${i + 1}.png`)
);

export async function POST(request: Request) {
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

    const body = await request.json();
    const avatar =
      typeof body.avatar === "string"
        ? body.avatar
        : "";

    if (!avataresPermitidos.has(avatar)) {
      return NextResponse.json(
        { error: "Avatar no válido." },
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

    const { error: updateError } =
      await supabaseAdmin
        .from("usuarios")
        .update({ avatar })
        .eq("id", usuario.id);

    if (updateError) {
      console.error("Error actualizando avatar:", updateError);
      return NextResponse.json(
        { error: "No se pudo guardar el avatar." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, avatar });
  } catch (error) {
    console.error("Error inesperado actualizando avatar:", error);
    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
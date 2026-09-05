import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { crearSesion } from "@/lib/auth/auth";

const supabaseUrl =
  "https://edlpwbhgxixiyivvljtk.supabase.co";

const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseServiceRoleKey) {
  throw new Error(
    "Falta SUPABASE_SERVICE_ROLE_KEY en .env.local"
  );
}

const supabase = createClient(
  supabaseUrl,
  supabaseServiceRoleKey
);

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const usuario =
      typeof body.usuario === "string"
        ? body.usuario.trim()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    if (!usuario || !password) {
      return NextResponse.json(
        {
          error: "Usuario y contraseña son obligatorios.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("usuarios")
      .select(
        "id, usuario, avatar, liga_actual_id, super_admin"
      )
      .eq("usuario", usuario)
      .eq("password", password)
      .eq("activo", true)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          error: "Usuario o contraseña incorrectos.",
        },
        { status: 401 }
      );
    }

    const token = crearSesion(data.id);

    const response = NextResponse.json({
      usuario: {
        id: data.id,
        usuario: data.usuario,
        avatar: data.avatar,
        liga_actual_id: data.liga_actual_id,
        super_admin: data.super_admin,
      },
    });

    response.cookies.set("rayongrid_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("Error en login:", error);

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
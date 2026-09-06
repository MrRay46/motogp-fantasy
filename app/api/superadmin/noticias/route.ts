import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { verificarSesion } from "@/lib/auth/auth";

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

async function comprobarSuperAdmin() {
  const cookieStore = await cookies();

  const token =
    cookieStore.get("rayongrid_session")?.value;

  const sesion = verificarSesion(token);

  if (!sesion) {
    return null;
  }

  const { data: usuario, error } = await supabase
    .from("usuarios")
    .select("id, super_admin, activo")
    .eq("id", sesion.usuarioId)
    .single();

  if (
    error ||
    !usuario ||
    usuario.activo !== true ||
    usuario.super_admin !== true
  ) {
    return null;
  }

  return usuario;
}

export async function POST(request: Request) {
  try {
    const usuario = await comprobarSuperAdmin();

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const tipo =
      typeof body.tipo === "string"
        ? body.tipo.trim()
        : "";

    const titulo =
      typeof body.titulo === "string"
        ? body.titulo.trim()
        : "";

    const contenido =
      typeof body.contenido === "string"
        ? body.contenido.trim()
        : "";

    const pilotoId =
      body.piloto_id === null ||
      body.piloto_id === undefined ||
      body.piloto_id === ""
        ? null
        : Number(body.piloto_id);

    const visible =
      typeof body.visible === "boolean"
        ? body.visible
        : true;

    if (!tipo || !titulo) {
      return NextResponse.json(
        {
          error: "Tipo y título son obligatorios.",
        },
        { status: 400 }
      );
    }

    if (
      pilotoId !== null &&
      (!Number.isInteger(pilotoId) || pilotoId <= 0)
    ) {
      return NextResponse.json(
        {
          error: "Piloto no válido.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("noticias")
      .insert({
        tipo,
        titulo,
        contenido: contenido || null,
        piloto_id: pilotoId,
        visible,
      })
      .select()
      .single();

    if (error) {
      console.error(
        "Error creando noticia:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      noticia: data,
    });
  } catch (error) {
    console.error(
      "Error en API de noticias:",
      error
    );

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const usuario = await comprobarSuperAdmin();

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "ID de noticia no válido.",
        },
        { status: 400 }
      );
    }

    const actualizacion: Record<string, unknown> = {};

    if (typeof body.tipo === "string") {
      actualizacion.tipo = body.tipo.trim();
    }

    if (typeof body.titulo === "string") {
      actualizacion.titulo = body.titulo.trim();
    }

    if (typeof body.contenido === "string") {
      actualizacion.contenido =
        body.contenido.trim() || null;
    }

    if (
      body.piloto_id === null ||
      body.piloto_id === undefined ||
      body.piloto_id === ""
    ) {
      actualizacion.piloto_id = null;
    } else if (Number.isInteger(Number(body.piloto_id))) {
      actualizacion.piloto_id = Number(body.piloto_id);
    }

    if (typeof body.visible === "boolean") {
      actualizacion.visible = body.visible;
    }

    const { data, error } = await supabase
      .from("noticias")
      .update(actualizacion)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(
        "Error actualizando noticia:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      noticia: data,
    });
  } catch (error) {
    console.error(
      "Error en API de noticias:",
      error
    );

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const usuario = await comprobarSuperAdmin();

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const id = Number(body.id);

    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json(
        {
          error: "ID de noticia no válido.",
        },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("noticias")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(
        "Error eliminando noticia:",
        error
      );

      return NextResponse.json(
        {
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
    });
  } catch (error) {
    console.error(
      "Error en API de noticias:",
      error
    );

    return NextResponse.json(
      {
        error: "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const TIPOS_NOTICIA = [
  "motogp",
  "mercado",
  "fantasy",
  "lesión",
  "calendario",
  "rumor",
] as const;

type ResultadoAutenticacion =
  | {
      ok: true;
      usuario: {
        id: number;
      };
    }
  | {
      ok: false;
      respuesta: NextResponse;
    };

function errorJson(mensaje: string, estado: number) {
  return NextResponse.json({ error: mensaje }, { status: estado });
}

async function comprobarSuperAdmin(
  request: Request
): Promise<ResultadoAutenticacion> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      respuesta: errorJson("No autenticado.", 401),
    };
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return {
      ok: false,
      respuesta: errorJson("Sesión no válida.", 401),
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      ok: false,
      respuesta: errorJson("Sesión no válida.", 401),
    };
  }

  const { data: usuario, error: usuarioError } = await supabaseAdmin
    .from("usuarios")
    .select("id, activo, super_admin")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (usuarioError) {
    console.error("Error comprobando superadmin:", usuarioError);

    return {
      ok: false,
      respuesta: errorJson("No se ha podido comprobar el usuario.", 500),
    };
  }

  if (!usuario || usuario.activo !== true || usuario.super_admin !== true) {
    return {
      ok: false,
      respuesta: errorJson("No autorizado.", 403),
    };
  }

  return {
    ok: true,
    usuario: {
      id: usuario.id,
    },
  };
}

function esObjeto(
  valor: unknown
): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
}

function validarTipo(valor: unknown): string | null {
  if (
    typeof valor !== "string" ||
    !TIPOS_NOTICIA.includes(
      valor as (typeof TIPOS_NOTICIA)[number]
    )
  ) {
    return null;
  }

  return valor;
}

function validarPilotoId(
  valor: unknown
): { valido: true; id: number | null } | { valido: false } {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return { valido: true, id: null };
  }

  const id = Number(valor);

  if (!Number.isSafeInteger(id) || id <= 0) {
    return { valido: false };
  }

  return { valido: true, id };
}

export async function GET(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const { data, error } = await supabaseAdmin
      .from("noticias")
      .select(`
        id,
        tipo,
        titulo,
        contenido,
        fecha,
        visible,
        piloto_id,
        piloto:pilotos (
          id,
          nombre,
          miniatura
        )
      `)
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error cargando noticias para administración:", error);
      return errorJson("No se han podido cargar las noticias.", 500);
    }

    return NextResponse.json(
      { noticias: data ?? [] },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Error en GET de noticias:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}

export async function POST(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const valor = await request.json();

    if (!esObjeto(valor)) {
      return errorJson("Los datos de la noticia no son válidos.", 400);
    }

    const tipo = validarTipo(valor.tipo);
    const titulo =
      typeof valor.titulo === "string" ? valor.titulo.trim() : "";
    const contenido =
      typeof valor.contenido === "string"
        ? valor.contenido.trim()
        : "";
    const piloto = validarPilotoId(valor.piloto_id);
    const visible =
      valor.visible === undefined ? true : valor.visible;

    if (!tipo) {
      return errorJson("El tipo de noticia no es válido.", 400);
    }

    if (!titulo || titulo.length > 160) {
      return errorJson(
        "El título es obligatorio y no puede superar 160 caracteres.",
        400
      );
    }

    if (contenido.length > 10000) {
      return errorJson(
        "El contenido no puede superar 10.000 caracteres.",
        400
      );
    }

    if (!piloto.valido) {
      return errorJson("El piloto indicado no es válido.", 400);
    }

    if (typeof visible !== "boolean") {
      return errorJson("El estado de publicación no es válido.", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("noticias")
      .insert({
        tipo,
        titulo,
        contenido: contenido || null,
        piloto_id: piloto.id,
        visible,
      })
      .select(`
        id,
        tipo,
        titulo,
        contenido,
        fecha,
        visible,
        piloto_id,
        piloto:pilotos (
          id,
          nombre,
          miniatura
        )
      `)
      .single();

    if (error) {
      console.error("Error creando noticia:", error);
      return errorJson("No se ha podido crear la noticia.", 500);
    }

    return NextResponse.json({ noticia: data });
  } catch (error) {
    console.error("Error en POST de noticias:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}

export async function PATCH(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const valor = await request.json();

    if (!esObjeto(valor)) {
      return errorJson("Los datos de la noticia no son válidos.", 400);
    }

    const id = Number(valor.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return errorJson("El ID de noticia no es válido.", 400);
    }

    const actualizacion: Record<string, unknown> = {};

    if (valor.tipo !== undefined) {
      const tipo = validarTipo(valor.tipo);

      if (!tipo) {
        return errorJson("El tipo de noticia no es válido.", 400);
      }

      actualizacion.tipo = tipo;
    }

    if (valor.titulo !== undefined) {
      if (typeof valor.titulo !== "string") {
        return errorJson("El título no es válido.", 400);
      }

      const titulo = valor.titulo.trim();

      if (!titulo || titulo.length > 160) {
        return errorJson(
          "El título es obligatorio y no puede superar 160 caracteres.",
          400
        );
      }

      actualizacion.titulo = titulo;
    }

    if (valor.contenido !== undefined) {
      if (typeof valor.contenido !== "string") {
        return errorJson("El contenido no es válido.", 400);
      }

      const contenido = valor.contenido.trim();

      if (contenido.length > 10000) {
        return errorJson(
          "El contenido no puede superar 10.000 caracteres.",
          400
        );
      }

      actualizacion.contenido = contenido || null;
    }

    if (valor.piloto_id !== undefined) {
      const piloto = validarPilotoId(valor.piloto_id);

      if (!piloto.valido) {
        return errorJson("El piloto indicado no es válido.", 400);
      }

      actualizacion.piloto_id = piloto.id;
    }

    if (valor.visible !== undefined) {
      if (typeof valor.visible !== "boolean") {
        return errorJson("El estado de publicación no es válido.", 400);
      }

      actualizacion.visible = valor.visible;
    }

    if (Object.keys(actualizacion).length === 0) {
      return errorJson("No se han enviado cambios para guardar.", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("noticias")
      .update(actualizacion)
      .eq("id", id)
      .select(`
        id,
        tipo,
        titulo,
        contenido,
        fecha,
        visible,
        piloto_id,
        piloto:pilotos (
          id,
          nombre,
          miniatura
        )
      `)
      .maybeSingle();

    if (error) {
      console.error("Error actualizando noticia:", error);
      return errorJson("No se ha podido actualizar la noticia.", 500);
    }

    if (!data) {
      return errorJson("No se ha encontrado la noticia.", 404);
    }

    return NextResponse.json({ noticia: data });
  } catch (error) {
    console.error("Error en PATCH de noticias:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}

export async function DELETE(request: Request) {
  try {
    const autenticacion = await comprobarSuperAdmin(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const valor = await request.json();

    if (!esObjeto(valor)) {
      return errorJson("Los datos de la noticia no son válidos.", 400);
    }

    const id = Number(valor.id);

    if (!Number.isSafeInteger(id) || id <= 0) {
      return errorJson("El ID de noticia no es válido.", 400);
    }

    const { data, error } = await supabaseAdmin
      .from("noticias")
      .delete()
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("Error eliminando noticia:", error);
      return errorJson("No se ha podido eliminar la noticia.", 500);
    }

    if (!data) {
      return errorJson("No se ha encontrado la noticia.", 404);
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error en DELETE de noticias:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}
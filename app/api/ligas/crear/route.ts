import { NextResponse } from "next/server";
import { randomInt } from "crypto";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

function generarCodigoLiga() {
  const letras = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numeros = "23456789";

  let codigo = "RG-";

  for (let i = 0; i < 6; i++) {
    if (randomInt(2) === 0) {
      codigo += letras[randomInt(letras.length)];
    } else {
      codigo += numeros[randomInt(numeros.length)];
    }
  }

  return codigo;
}

export async function POST(request: Request) {
  let ligaCreadaId: number | null = null;

  try {
    // -----------------------------------------
    // 1. Validar token de Supabase Auth
    // -----------------------------------------

    const authorization =
      request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No has iniciado sesión." },
        { status: 401 }
      );
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return NextResponse.json(
        { error: "Token de sesión no válido." },
        { status: 401 }
      );
    }

    const {
      data: authData,
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authData.user) {
      return NextResponse.json(
        { error: "La sesión no es válida o ha caducado." },
        { status: 401 }
      );
    }

    const authUserId = authData.user.id;

    // -----------------------------------------
    // 2. Obtener usuario Rayongrid real
    // -----------------------------------------

    const {
      data: usuario,
      error: errorUsuario,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id, activo")
      .eq("auth_user_id", authUserId)
      .maybeSingle();

    if (errorUsuario) {
      console.error(
        "Error obteniendo usuario Rayongrid:",
        errorUsuario
      );

      return NextResponse.json(
        { error: "No se pudo comprobar tu cuenta." },
        { status: 500 }
      );
    }

    if (!usuario || !usuario.activo) {
      return NextResponse.json(
        { error: "Tu cuenta no está activa o no existe." },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 3. Validar nombre de la liga
    // -----------------------------------------

    const body = await request.json();

    const nombre =
      typeof body.nombre === "string"
        ? body.nombre.trim()
        : "";

    if (!nombre) {
      return NextResponse.json(
        { error: "Introduce un nombre para la liga." },
        { status: 400 }
      );
    }

    if (nombre.length > 60) {
      return NextResponse.json(
        { error: "El nombre no puede superar 60 caracteres." },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 4. Generar código único
    // -----------------------------------------

    let codigo = "";
    let codigoDisponible = false;

    for (let intento = 0; intento < 10; intento++) {
      codigo = generarCodigoLiga();

      const {
        data: ligaExistente,
        error: errorBusqueda,
      } = await supabaseAdmin
        .from("ligas")
        .select("id")
        .eq("codigo", codigo)
        .maybeSingle();

      if (errorBusqueda) {
        console.error(
          "Error comprobando código:",
          errorBusqueda
        );

        return NextResponse.json(
          { error: "No se pudo generar el código de la liga." },
          { status: 500 }
        );
      }

      if (!ligaExistente) {
        codigoDisponible = true;
        break;
      }
    }

    if (!codigoDisponible) {
      return NextResponse.json(
        { error: "No se pudo generar un código único. Inténtalo de nuevo." },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 5. Crear liga
    // -----------------------------------------

    const {
      data: nuevaLiga,
      error: errorLiga,
    } = await supabaseAdmin
      .from("ligas")
      .insert({
        nombre,
        codigo,
        activa: true,
        creador_id: usuario.id,
      })
      .select("id, nombre, codigo")
      .single();

    if (errorLiga || !nuevaLiga) {
      console.error(
        "Error creando liga:",
        errorLiga
      );

      return NextResponse.json(
        { error: "No se pudo crear la liga." },
        { status: 500 }
      );
    }

    ligaCreadaId = nuevaLiga.id;

    // -----------------------------------------
    // 6. Crear relación usuario-liga
    // -----------------------------------------

    const {
      error: errorRelacion,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .insert({
        usuario_id: usuario.id,
        liga_id: nuevaLiga.id,
        admin_liga: true,
        codigo: nuevaLiga.codigo,
      });

    if (errorRelacion) {
      console.error(
        "Error creando relación usuario-liga:",
        errorRelacion
      );

      // Intentar eliminar la liga creada
      const { error: errorRollback } =
        await supabaseAdmin
          .from("ligas")
          .delete()
          .eq("id", nuevaLiga.id);

      if (errorRollback) {
        console.error(
          "Error limpiando liga incompleta:",
          errorRollback
        );
      } else {
        ligaCreadaId = null;
      }

      return NextResponse.json(
        { error: "No se pudo asignar el administrador de la liga." },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 7. Establecer liga activa
    // -----------------------------------------

    const {
      error: errorUpdate,
    } = await supabaseAdmin
      .from("usuarios")
      .update({
        liga_actual_id: nuevaLiga.id,
      })
      .eq("id", usuario.id)
      .eq("auth_user_id", authUserId);

    if (errorUpdate) {
      console.error(
        "Error actualizando liga activa:",
        errorUpdate
      );

      // Intentar limpiar la relación y la liga
      const { error: errorRelacionRollback } =
        await supabaseAdmin
          .from("usuarios_ligas")
          .delete()
          .eq("usuario_id", usuario.id)
          .eq("liga_id", nuevaLiga.id);

      if (errorRelacionRollback) {
        console.error(
          "Error limpiando relación incompleta:",
          errorRelacionRollback
        );
      }

      const { error: errorLigaRollback } =
        await supabaseAdmin
          .from("ligas")
          .delete()
          .eq("id", nuevaLiga.id);

      if (errorLigaRollback) {
        console.error(
          "Error limpiando liga incompleta:",
          errorLigaRollback
        );
      } else {
        ligaCreadaId = null;
      }

      return NextResponse.json(
        { error: "No se pudo establecer la liga activa." },
        { status: 500 }
      );
    }

    // -----------------------------------------
    // 8. Respuesta
    // -----------------------------------------

    ligaCreadaId = null;

    return NextResponse.json(
      {
        ok: true,
        liga: {
          id: nuevaLiga.id,
          nombre: nuevaLiga.nombre,
          codigo: nuevaLiga.codigo,
          admin_liga: true,
        },
        liga_actual_id: nuevaLiga.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Error en API de creación de liga:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
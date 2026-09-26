import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function POST(request: NextRequest) {
  try {
    // 1. Comprobar el token de Supabase
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No has iniciado sesión." },
        { status: 401 }
      );
    }

    const token = authorization.substring(7);

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return NextResponse.json(
        { error: "La sesión no es válida." },
        { status: 401 }
      );
    }

    // 2. Obtener el usuario interno de Rayongrid
    const {
      data: usuario,
      error: usuarioError,
    } = await supabaseAdmin
      .from("usuarios")
      .select("id, usuario, activo")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (usuarioError || !usuario) {
      return NextResponse.json(
        { error: "No se ha encontrado tu usuario." },
        { status: 404 }
      );
    }

    if (!usuario.activo) {
      return NextResponse.json(
        { error: "Tu cuenta está desactivada." },
        { status: 403 }
      );
    }

    // 3. Leer los datos del equipo
    const body = await request.json();

    const ligaId = Number(body.liga_id);

    if (
      !Number.isSafeInteger(ligaId) ||
      ligaId <= 0
    ) {
      return NextResponse.json(
        { error: "La liga indicada no es válida." },
        { status: 400 }
      );
    }

    // 4. Comprobar que el usuario pertenece a esa liga
    const {
      data: membresia,
      error: membresiaError,
    } = await supabaseAdmin
      .from("usuarios_ligas")
      .select("id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (membresiaError) {
      console.error(
        "Error comprobando membresía:",
        membresiaError
      );

      return NextResponse.json(
        { error: "No se ha podido comprobar la liga." },
        { status: 500 }
      );
    }

    if (!membresia) {
      return NextResponse.json(
        { error: "No perteneces a esta liga." },
        { status: 403 }
      );
    }

    // 5. Validar los datos del equipo
    const {
      fichados,
      reserva,
      motor,
      prediccion_piloto,
      prediccion_motor,
      prediccion_piloto_original,
      prediccion_motor_original,
      prediccion_piloto_modificada,
      prediccion_motor_modificada,
      constructor_modificado,
      reserva_modificada,
      cambios_pilotos,
    } = body;

    if (
      !Array.isArray(fichados) ||
      !fichados.every(
        (item: unknown) => typeof item === "string"
      )
    ) {
      return NextResponse.json(
        { error: "La lista de pilotos no es válida." },
        { status: 400 }
      );
    }

    const camposTexto = [
      reserva,
      motor,
      prediccion_piloto,
      prediccion_motor,
      prediccion_piloto_original,
      prediccion_motor_original,
    ];

    if (
      !camposTexto.every(
        (valor) =>
          valor === null ||
          typeof valor === "string"
      )
    ) {
      return NextResponse.json(
        { error: "Hay campos de texto no válidos." },
        { status: 400 }
      );
    }

    const camposBooleanos = [
      prediccion_piloto_modificada,
      prediccion_motor_modificada,
      constructor_modificado,
      reserva_modificada,
    ];

    if (
      !camposBooleanos.every(
        (valor) => typeof valor === "boolean"
      )
    ) {
      return NextResponse.json(
        { error: "Hay indicadores no válidos." },
        { status: 400 }
      );
    }

    if (
      !Number.isSafeInteger(cambios_pilotos) ||
      cambios_pilotos < 0
    ) {
      return NextResponse.json(
        { error: "El número de cambios no es válido." },
        { status: 400 }
      );
    }

    // 6. Construir los datos autorizados para guardar
    // No se acepta usuario_id, usuario ni puntos
    // enviados por el navegador.

    const datosEquipo = {
      usuario_id: usuario.id,
      usuario: usuario.usuario,
      liga_id: ligaId,
      fichados,
      reserva,
      motor,
      prediccion_piloto,
      prediccion_motor,
      prediccion_piloto_original,
      prediccion_motor_original,
      prediccion_piloto_modificada,
      prediccion_motor_modificada,
      constructor_modificado,
      reserva_modificada,
      cambios_pilotos,
    };

    // 7. Comprobar si ya existe el equipo
    const {
      data: equipoExistente,
      error: equipoError,
    } = await supabaseAdmin
      .from("equipos")
      .select("id")
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (equipoError) {
      console.error(
        "Error buscando equipo:",
        equipoError
      );

      return NextResponse.json(
        { error: "No se ha podido consultar el equipo." },
        { status: 500 }
      );
    }

    // 8. Actualizar el equipo existente o crear uno nuevo
    // En ningún caso se modifican los puntos existentes.

    if (equipoExistente) {
      const {
        error: updateError,
      } = await supabaseAdmin
        .from("equipos")
        .update(datosEquipo)
        .eq("id", equipoExistente.id)
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId);

      if (updateError) {
        console.error(
          "Error actualizando equipo:",
          updateError
        );

        return NextResponse.json(
          { error: "No se ha podido guardar el equipo." },
          { status: 500 }
        );
      }
    } else {
      const {
        error: insertError,
      } = await supabaseAdmin
        .from("equipos")
        .insert({
          ...datosEquipo,
          puntos: 0,
        });

      if (insertError) {
        console.error(
          "Error creando equipo:",
          insertError
        );

        return NextResponse.json(
          { error: "No se ha podido crear el equipo." },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Equipo guardado correctamente.",
    });
  } catch (error) {
    console.error(
      "Error inesperado guardando equipo:",
      error
    );

    return NextResponse.json(
      { error: "Error interno del servidor." },
      { status: 500 }
    );
  }
}
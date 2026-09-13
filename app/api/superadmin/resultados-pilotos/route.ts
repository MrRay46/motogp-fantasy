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

type PilotoResultado = {
  id: number;
  nombre: string;
  puntos_gp: number;
  puntos_totales: number;
};

export async function POST(request: Request) {
  try {
    // -----------------------------------------
    // 1. COMPROBAR SUPERADMIN
    // -----------------------------------------

    const usuario = await comprobarSuperAdmin();

    if (!usuario) {
      return NextResponse.json(
        {
          error: "No autorizado.",
        },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // 2. LEER DATOS
    // -----------------------------------------

    const body = await request.json();

    const granPremioId = Number(
      body.gran_premio_id
    );

    const pilotos = body.pilotos;

    // -----------------------------------------
    // 3. VALIDAR GP
    // -----------------------------------------

    if (
      !Number.isInteger(granPremioId) ||
      granPremioId <= 0
    ) {
      return NextResponse.json(
        {
          error: "ID de Gran Premio no válido.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 4. VALIDAR PILOTOS
    // -----------------------------------------

    if (!Array.isArray(pilotos)) {
      return NextResponse.json(
        {
          error: "Los datos de pilotos no son válidos.",
        },
        { status: 400 }
      );
    }

    const pilotosValidados: PilotoResultado[] =
      [];

    for (const piloto of pilotos) {
      const id = Number(piloto?.id);

      const puntosGp = Number(
        piloto?.puntos_gp
      );

      const puntosTotales = Number(
        piloto?.puntos_totales
      );

      const nombre =
        typeof piloto?.nombre === "string"
          ? piloto.nombre
          : `Piloto ${id}`;

      if (
        !Number.isInteger(id) ||
        id <= 0
      ) {
        return NextResponse.json(
          {
            error: `ID de piloto no válido: ${id}.`,
          },
          { status: 400 }
        );
      }

      if (
        !Number.isFinite(puntosGp) ||
        !Number.isFinite(puntosTotales)
      ) {
        return NextResponse.json(
          {
            error: `Puntos no válidos para ${nombre}.`,
          },
          { status: 400 }
        );
      }

      pilotosValidados.push({
        id,
        nombre,
        puntos_gp: puntosGp,
        puntos_totales: puntosTotales,
      });
    }

    if (pilotosValidados.length === 0) {
      return NextResponse.json(
        {
          error: "No hay pilotos para guardar.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 5. COMPROBAR QUE EL GP EXISTE
    // -----------------------------------------

    const {
      data: granPremio,
      error: granPremioError,
    } = await supabase
      .from("grandes_premios")
      .select("id, nombre")
      .eq("id", granPremioId)
      .single();

    if (
      granPremioError ||
      !granPremio
    ) {
      console.error(
        "Error comprobando GP:",
        granPremioError
      );

      return NextResponse.json(
        {
          error:
            "El Gran Premio seleccionado no existe.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // 6. GUARDAR HISTÓRICO DEL GP
    // -----------------------------------------

    for (const piloto of pilotosValidados) {
      const {
        error,
      } = await supabase
        .from("resultados_pilotos_gp")
        .upsert(
          {
            gran_premio_id:
              granPremioId,

            piloto_id:
              piloto.id,

            puntos_fantasy:
              piloto.puntos_gp,

            puntos_oficiales:
              piloto.puntos_totales,
          },
          {
            onConflict:
              "gran_premio_id,piloto_id",
          }
        );

      if (error) {
        console.error(
          `Error guardando histórico de ${piloto.nombre}:`,
          error
        );

        return NextResponse.json(
          {
            error: `Error guardando histórico de ${piloto.nombre}: ${error.message}`,
          },
          { status: 500 }
        );
      }
    }

    // -----------------------------------------
    // 7. ACTUALIZAR TABLA PRINCIPAL DE PILOTOS
    // -----------------------------------------

    for (const piloto of pilotosValidados) {
      const {
        error,
      } = await supabase
        .from("pilotos")
        .update({
          puntos_gp:
            piloto.puntos_gp,

          puntos_totales:
            piloto.puntos_totales,
        })
        .eq(
          "id",
          piloto.id
        );

      if (error) {
        console.error(
          `Error actualizando ${piloto.nombre}:`,
          error
        );

        return NextResponse.json(
          {
            error: `Error actualizando ${piloto.nombre}: ${error.message}`,
          },
          { status: 500 }
        );
      }
    }

    // -----------------------------------------
    // 8. RESPUESTA
    // -----------------------------------------

    return NextResponse.json({
      ok: true,
      gran_premio: granPremio,
      pilotos_actualizados:
        pilotosValidados.length,
    });
  } catch (error) {
    console.error(
      "Error en API de resultados de pilotos:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Error interno del servidor.",
      },
      { status: 500 }
    );
  }
}
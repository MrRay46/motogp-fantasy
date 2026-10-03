import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

type Accion =
  | "obtener"
  | "registrar_piloto"
  | "marcar_constructor"
  | "marcar_reserva";

type Usuario = {
  id: number;
  activo: boolean;
};

type Ventana = {
  id: number;
  inicio: string;
  fin: string;
  cambios_pilotos: number;
  cambiar_constructor: boolean;
  cambiar_reserva: boolean;
  reserva_consumible: boolean;
};

function errorJson(mensaje: string, estado: number) {
  return NextResponse.json({ error: mensaje }, { status: estado });
}

function fechaActualMadrid(): string {
  const partes = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Madrid",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const obtener = (tipo: string) =>
    partes.find((parte) => parte.type === tipo)?.value ?? "";

  return `${obtener("year")}-${obtener("month")}-${obtener("day")}`;
}

async function autenticar(request: Request): Promise<
  | { ok: true; usuario: Usuario }
  | { ok: false; respuesta: NextResponse }
> {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    return {
      ok: false,
      respuesta: errorJson("No has iniciado sesión.", 401),
    };
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return {
      ok: false,
      respuesta: errorJson("La sesión no es válida.", 401),
    };
  }

  const {
    data: { user },
    error: authError,
  } = await supabaseAdmin.auth.getUser(token);

  if (authError || !user) {
    return {
      ok: false,
      respuesta: errorJson("La sesión no es válida.", 401),
    };
  }

  const { data: usuario, error: usuarioError } = await supabaseAdmin
    .from("usuarios")
    .select("id, activo")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (usuarioError) {
    console.error("Error buscando usuario de mercado:", usuarioError);
    return {
      ok: false,
      respuesta: errorJson("No se ha podido comprobar tu usuario.", 500),
    };
  }

  if (!usuario) {
    return {
      ok: false,
      respuesta: errorJson("No se ha encontrado tu usuario.", 404),
    };
  }

  if (!usuario.activo) {
    return {
      ok: false,
      respuesta: errorJson("Tu cuenta está desactivada.", 403),
    };
  }

  return { ok: true, usuario: usuario as Usuario };
}

async function comprobarMembresia(
  usuarioId: number,
  ligaId: number
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("usuarios_ligas")
    .select("id")
    .eq("usuario_id", usuarioId)
    .eq("liga_id", ligaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function obtenerVentanaActiva(
  ventanaId: number
): Promise<Ventana | null> {
  const { data, error } = await supabaseAdmin
    .from("ventanas_mercado")
    .select(
      "id, inicio, fin, cambios_pilotos, cambiar_constructor, cambiar_reserva, reserva_consumible"
    )
    .eq("id", ventanaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    return null;
  }

  const ventana = data as Ventana;
  const hoy = fechaActualMadrid();

  if (hoy < ventana.inicio || hoy > ventana.fin) {
    return null;
  }

  return ventana;
}

async function obtenerOCrearEstado(
  usuarioId: number,
  ligaId: number,
  ventanaId: number
) {
  const { data: existente, error: lecturaError } = await supabaseAdmin
    .from("equipos_ventanas")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("liga_id", ligaId)
    .eq("ventana_id", ventanaId)
    .maybeSingle();

  if (lecturaError) {
    throw lecturaError;
  }

  if (existente) {
    return existente;
  }

  const { data: nuevo, error: creacionError } = await supabaseAdmin
    .from("equipos_ventanas")
    .insert({
      usuario_id: usuarioId,
      liga_id: ligaId,
      ventana_id: ventanaId,
      cambios_pilotos: 0,
      constructor_modificado: false,
      reserva_modificada: false,
    })
    .select("*")
    .single();

  if (!creacionError && nuevo) {
    return nuevo;
  }

  // Si dos solicitudes intentan crear el estado a la vez, recuperamos
  // la fila creada por la otra solicitud cuando la restricción única salte.
  if (creacionError?.code === "23505") {
    const { data: recuperado, error: recuperacionError } =
      await supabaseAdmin
        .from("equipos_ventanas")
        .select("*")
        .eq("usuario_id", usuarioId)
        .eq("liga_id", ligaId)
        .eq("ventana_id", ventanaId)
        .single();

    if (!recuperacionError && recuperado) {
      return recuperado;
    }
  }

  throw creacionError ?? new Error("No se pudo crear el estado de mercado.");
}

export async function POST(request: Request) {
  try {
    const autenticacion = await autenticar(request);

    if (!autenticacion.ok) {
      return autenticacion.respuesta;
    }

    const usuario = autenticacion.usuario;
    const body = await request.json();
    const accion = body.accion as Accion | undefined;

    if (
      accion !== "obtener" &&
      accion !== "registrar_piloto" &&
      accion !== "marcar_constructor" &&
      accion !== "marcar_reserva"
    ) {
      return errorJson("La operación solicitada no es válida.", 400);
    }

    if (accion === "obtener") {
      const ligaId = Number(body.liga_id);
      const ventanaId = Number(body.ventana_id);

      if (
        !Number.isSafeInteger(ligaId) ||
        ligaId <= 0 ||
        !Number.isSafeInteger(ventanaId) ||
        ventanaId <= 0
      ) {
        return errorJson("La liga o la ventana no son válidas.", 400);
      }

      if (!(await comprobarMembresia(usuario.id, ligaId))) {
        return errorJson("No perteneces a esta liga.", 403);
      }

      const ventana = await obtenerVentanaActiva(ventanaId);

      if (!ventana) {
        return errorJson("La ventana de mercado no está abierta.", 409);
      }

      const estado = await obtenerOCrearEstado(
        usuario.id,
        ligaId,
        ventanaId
      );

      return NextResponse.json(estado);
    }

    const estadoId = Number(body.estado_id);

    if (!Number.isSafeInteger(estadoId) || estadoId <= 0) {
      return errorJson("El estado de cambios no es válido.", 400);
    }

    // El estado se busca junto con el ID interno del usuario autenticado.
    // El ID recibido del navegador nunca basta para modificar otra fila.
    const { data: estado, error: estadoError } = await supabaseAdmin
      .from("equipos_ventanas")
      .select("*")
      .eq("id", estadoId)
      .eq("usuario_id", usuario.id)
      .maybeSingle();

    if (estadoError) {
      console.error("Error leyendo estado de mercado:", estadoError);
      return errorJson("No se ha podido leer el estado de mercado.", 500);
    }

    if (!estado) {
      return errorJson("No se ha encontrado tu estado de mercado.", 404);
    }

    if (!(await comprobarMembresia(usuario.id, estado.liga_id))) {
      return errorJson("No perteneces a esta liga.", 403);
    }

    const ventana = await obtenerVentanaActiva(estado.ventana_id);

    if (!ventana) {
      return errorJson("La ventana de mercado no está abierta.", 409);
    }

    if (accion === "registrar_piloto") {
      const cambiosActuales = Number(estado.cambios_pilotos ?? 0);

      if (cambiosActuales >= Number(ventana.cambios_pilotos ?? 0)) {
        return errorJson(
          "Se ha alcanzado el límite de cambios de pilotos de esta ventana.",
          409
        );
      }

      // Comparar con el contador leído evita que dos solicitudes simultáneas
      // consuman el mismo cambio y superen el límite.
      const { data: actualizado, error: updateError } = await supabaseAdmin
        .from("equipos_ventanas")
        .update({ cambios_pilotos: cambiosActuales + 1 })
        .eq("id", estado.id)
        .eq("usuario_id", usuario.id)
        .eq("cambios_pilotos", cambiosActuales)
        .select("*")
        .maybeSingle();

      if (updateError) {
        console.error("Error registrando cambio de piloto:", updateError);
        return errorJson("No se ha podido registrar el cambio de piloto.", 500);
      }

      if (!actualizado) {
        return errorJson(
          "El estado cambió mientras se procesaba la solicitud. Vuelve a intentarlo.",
          409
        );
      }

      return NextResponse.json(actualizado);
    }

    if (accion === "marcar_constructor") {
      if (!ventana.cambiar_constructor) {
        return errorJson(
          "Esta ventana no permite cambiar el constructor.",
          403
        );
      }

      if (estado.constructor_modificado) {
        return errorJson(
          "Ya has cambiado el constructor en esta ventana.",
          409
        );
      }

      const { data: actualizado, error: updateError } = await supabaseAdmin
        .from("equipos_ventanas")
        .update({ constructor_modificado: true })
        .eq("id", estado.id)
        .eq("usuario_id", usuario.id)
        .eq("constructor_modificado", false)
        .select("*")
        .maybeSingle();

      if (updateError) {
        console.error("Error marcando cambio de constructor:", updateError);
        return errorJson(
          "No se ha podido registrar el cambio de constructor.",
          500
        );
      }

      if (!actualizado) {
        return errorJson(
          "El constructor ya se ha cambiado en esta ventana.",
          409
        );
      }

      return NextResponse.json(actualizado);
    }

    if (!ventana.cambiar_reserva) {
      return errorJson("Esta ventana no permite cambiar la reserva.", 403);
    }

    if (estado.reserva_modificada && !ventana.reserva_consumible) {
      return errorJson(
        "Ya has cambiado la reserva en esta ventana.",
        409
      );
    }

    if (estado.reserva_modificada) {
      return NextResponse.json(estado);
    }

    const { data: actualizado, error: updateError } = await supabaseAdmin
      .from("equipos_ventanas")
      .update({ reserva_modificada: true })
      .eq("id", estado.id)
      .eq("usuario_id", usuario.id)
      .eq("reserva_modificada", false)
      .select("*")
      .maybeSingle();

    if (updateError) {
      console.error("Error marcando cambio de reserva:", updateError);
      return errorJson(
        "No se ha podido registrar el cambio de reserva.",
        500
      );
    }

    if (!actualizado) {
      return errorJson(
        "La reserva ya se ha cambiado en esta ventana.",
        409
      );
    }

    return NextResponse.json(actualizado);
  } catch (error) {
    console.error("Error en la API de cambios de mercado:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}
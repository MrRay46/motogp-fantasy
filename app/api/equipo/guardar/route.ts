import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { pilotos } from "@/data/pilotos";
import { motores } from "@/data/motores";

type DatosEquipo = {
  fichados: string[];
  reserva: string | null;
  motor: string | null;
  prediccionPiloto: string | null;
  prediccionMotor: string | null;
};

type VentanaMercado = {
  id: number;
  inicio: string;
  fin: string;
  cambios_pilotos: number;
  cambiar_constructor: boolean;
  cambiar_reserva: boolean;
  cambiar_predicciones: boolean;
  reserva_consumible: boolean;
};

type EstadoVentana = {
  id: number;
  cambios_pilotos: number;
  cambios_pilotos_aplicados: number;
  constructor_modificado: boolean;
  constructor_modificacion_aplicada: boolean;
  reserva_modificada: boolean;
  reserva_modificacion_aplicada: boolean;
};

function errorJson(mensaje: string, estado: number) {
  return NextResponse.json({ error: mensaje }, { status: estado });
}

function esObjeto(valor: unknown): valor is Record<string, unknown> {
  return (
    typeof valor === "object" &&
    valor !== null &&
    !Array.isArray(valor)
  );
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

function equipoCompleto(equipo: {
  fichados: unknown;
  reserva: unknown;
  motor: unknown;
  prediccion_piloto: unknown;
  prediccion_motor: unknown;
}): boolean {
  return (
    Array.isArray(equipo.fichados) &&
    equipo.fichados.length === 6 &&
    equipo.reserva !== null &&
    equipo.motor !== null &&
    equipo.prediccion_piloto !== null &&
    equipo.prediccion_motor !== null
  );
}

async function obtenerVentanaActiva(): Promise<VentanaMercado | null> {
  const { data, error } = await supabaseAdmin
    .from("ventanas_mercado")
    .select(`
      id,
      inicio,
      fin,
      cambios_pilotos,
      cambiar_constructor,
      cambiar_reserva,
      cambiar_predicciones,
      reserva_consumible
    `)
    .order("inicio", { ascending: true });

  if (error) {
    throw error;
  }

  const hoy = fechaActualMadrid();

  return (
    (data ?? []).find(
      (ventana) => hoy >= ventana.inicio && hoy <= ventana.fin
    ) ?? null
  );
}

async function obtenerEstadoVentana(
  usuarioId: number,
  ligaId: number,
  ventanaId: number
): Promise<EstadoVentana | null> {
  const { data, error } = await supabaseAdmin
    .from("equipos_ventanas")
    .select(`
      id,
      cambios_pilotos,
      cambios_pilotos_aplicados,
      constructor_modificado,
      constructor_modificacion_aplicada,
      reserva_modificada,
      reserva_modificacion_aplicada
    `)
    .eq("usuario_id", usuarioId)
    .eq("liga_id", ligaId)
    .eq("ventana_id", ventanaId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data as EstadoVentana | null;
}

async function aplicarContadorPilotos(
  estado: EstadoVentana,
  contadorEsperado: number
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("equipos_ventanas")
    .update({
      cambios_pilotos_aplicados: contadorEsperado,
    })
    .eq("id", estado.id)
    .eq("cambios_pilotos", contadorEsperado)
    .eq("cambios_pilotos_aplicados", estado.cambios_pilotos_aplicados)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function aplicarCambioConstructor(
  estado: EstadoVentana
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("equipos_ventanas")
    .update({
      constructor_modificacion_aplicada: true,
    })
    .eq("id", estado.id)
    .eq("constructor_modificado", true)
    .eq("constructor_modificacion_aplicada", false)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

async function aplicarCambioReserva(
  estado: EstadoVentana
): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from("equipos_ventanas")
    .update({
      reserva_modificacion_aplicada: true,
    })
    .eq("id", estado.id)
    .eq("reserva_modificada", true)
    .eq("reserva_modificacion_aplicada", false)
    .select("id")
    .maybeSingle();

  if (error) {
    throw error;
  }

  return Boolean(data);
}

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
      return errorJson("No has iniciado sesión.", 401);
    }

    const token = authorization.slice(7).trim();

    if (!token) {
      return errorJson("La sesión no es válida.", 401);
    }

    const {
      data: { user: authUser },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !authUser) {
      return errorJson("La sesión no es válida.", 401);
    }

    const { data: usuario, error: usuarioError } = await supabaseAdmin
      .from("usuarios")
      .select("id, usuario, activo")
      .eq("auth_user_id", authUser.id)
      .maybeSingle();

    if (usuarioError) {
      console.error("Error obteniendo usuario:", usuarioError);
      return errorJson("No se ha podido comprobar tu usuario.", 500);
    }

    if (!usuario) {
      return errorJson("No se ha encontrado tu usuario.", 404);
    }

    if (!usuario.activo) {
      return errorJson("Tu cuenta está desactivada.", 403);
    }

    const body = await request.json();

    if (!esObjeto(body)) {
      return errorJson("Los datos del equipo no son válidos.", 400);
    }

    const ligaId = Number(body.liga_id);

    if (!Number.isSafeInteger(ligaId) || ligaId <= 0) {
      return errorJson("La liga indicada no es válida.", 400);
    }

    const { data: membresia, error: membresiaError } =
      await supabaseAdmin
        .from("usuarios_ligas")
        .select("id")
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId)
        .maybeSingle();

    if (membresiaError) {
      console.error("Error comprobando membresía:", membresiaError);
      return errorJson("No se ha podido comprobar la liga.", 500);
    }

    if (!membresia) {
      return errorJson("No perteneces a esta liga.", 403);
    }

    const fichados = body.fichados;
    const reserva = body.reserva;
    const motor = body.motor;
    const prediccionPiloto = body.prediccion_piloto;
    const prediccionMotor = body.prediccion_motor;

    if (
      !Array.isArray(fichados) ||
      fichados.length > 6 ||
      !fichados.every((item) => typeof item === "string") ||
      new Set(fichados).size !== fichados.length
    ) {
      return errorJson("La lista de pilotos no es válida.", 400);
    }

    const nombresPilotos = new Set(pilotos.map((piloto) => piloto.nombre));
    const nombresMotores = new Set(motores.map((item) => item.nombre));

    if (!fichados.every((nombre) => nombresPilotos.has(nombre))) {
      return errorJson("La lista contiene un piloto no válido.", 400);
    }

    const camposTexto = [
      reserva,
      motor,
      prediccionPiloto,
      prediccionMotor,
    ];

    if (
      !camposTexto.every(
        (valor) => valor === null || typeof valor === "string"
      )
    ) {
      return errorJson("Hay campos de texto no válidos.", 400);
    }

    if (
      reserva !== null &&
      (!nombresPilotos.has(reserva as string) ||
        !fichados.includes(reserva as string))
    ) {
      return errorJson(
        "La reserva debe ser uno de los pilotos fichados.",
        400
      );
    }

    if (motor !== null && !nombresMotores.has(motor as string)) {
      return errorJson("El constructor indicado no es válido.", 400);
    }

    if (
      prediccionPiloto !== null &&
      !nombresPilotos.has(prediccionPiloto as string)
    ) {
      return errorJson("La predicción de piloto no es válida.", 400);
    }

    if (
      prediccionMotor !== null &&
      !nombresMotores.has(prediccionMotor as string)
    ) {
      return errorJson("La predicción de constructor no es válida.", 400);
    }

    const precioPilotos = fichados.reduce((total, nombre) => {
      const piloto = pilotos.find((item) => item.nombre === nombre);
      return total + (piloto?.precio ?? 0);
    }, 0);

    const precioMotor =
      motor === null
        ? 0
        : motores.find((item) => item.nombre === motor)?.precio ?? 0;

    if (precioPilotos + precioMotor > 172) {
      return errorJson("El equipo supera el presupuesto permitido.", 400);
    }

    const nuevoEquipo: DatosEquipo = {
      fichados: fichados as string[],
      reserva: reserva as string | null,
      motor: motor as string | null,
      prediccionPiloto: prediccionPiloto as string | null,
      prediccionMotor: prediccionMotor as string | null,
    };

    const { data: existente, error: equipoError } = await supabaseAdmin
      .from("equipos")
      .select(`
        id,
        fichados,
        reserva,
        motor,
        puntos,
        prediccion_piloto,
        prediccion_motor,
        prediccion_piloto_original,
        prediccion_motor_original,
        prediccion_piloto_modificada,
        prediccion_motor_modificada,
        constructor_modificado,
        reserva_modificada,
        cambios_pilotos
      `)
      .eq("usuario_id", usuario.id)
      .eq("liga_id", ligaId)
      .maybeSingle();

    if (equipoError) {
      console.error("Error buscando equipo:", equipoError);
      return errorJson("No se ha podido consultar el equipo.", 500);
    }

    const inicial =
      !existente ||
      !equipoCompleto(existente);

    const anteriorFichados = Array.isArray(existente?.fichados)
      ? (existente.fichados as string[])
      : [];

    const anteriores = new Set(anteriorFichados);
    const nuevos = new Set(nuevoEquipo.fichados);

    const quitados = anteriorFichados.filter((nombre) => !nuevos.has(nombre));
    const añadidos = nuevoEquipo.fichados.filter(
      (nombre) => !anteriores.has(nombre)
    );

    let ventanaActiva: VentanaMercado | null = null;
    let estadoVentana: EstadoVentana | null = null;

    if (!inicial) {
      ventanaActiva = await obtenerVentanaActiva();

      if (ventanaActiva) {
        estadoVentana = await obtenerEstadoVentana(
          usuario.id,
          ligaId,
          ventanaActiva.id
        );
      }

      const motorCambio = nuevoEquipo.motor !== existente.motor;
      const reservaCambio = nuevoEquipo.reserva !== existente.reserva;
      const prediccionPilotoCambio =
        nuevoEquipo.prediccionPiloto !== existente.prediccion_piloto;
      const prediccionMotorCambio =
        nuevoEquipo.prediccionMotor !== existente.prediccion_motor;
      const pilotosCambio =
        quitados.length > 0 || añadidos.length > 0;

      // La pantalla permite retirar primero un piloto y fichar su sustituto
      // después. No persistimos ese estado temporal incompleto.
      const retiradaPendiente =
        quitados.length === 1 &&
        añadidos.length === 0 &&
        anteriorFichados.length === 6 &&
        nuevoEquipo.fichados.length === 5 &&
        nuevoEquipo.motor === existente.motor &&
        nuevoEquipo.prediccionPiloto === existente.prediccion_piloto &&
        nuevoEquipo.prediccionMotor === existente.prediccion_motor &&
        (existente.reserva === null ||
          nuevoEquipo.reserva === existente.reserva ||
          nuevoEquipo.reserva === null);

      if (retiradaPendiente) {
        if (!ventanaActiva || !estadoVentana) {
          return errorJson(
            "No hay una ventana de mercado activa para cambiar pilotos.",
            403
          );
        }

        if (
          !Number.isSafeInteger(estadoVentana.cambios_pilotos) ||
          estadoVentana.cambios_pilotos >= ventanaActiva.cambios_pilotos ||
          estadoVentana.cambios_pilotos_aplicados !==
            estadoVentana.cambios_pilotos
        ) {
          return errorJson(
            "No tienes cambios de pilotos disponibles en esta ventana.",
            403
          );
        }

        return NextResponse.json({
          ok: true,
          pendiente: true,
          mensaje: "Selecciona el piloto sustituto para guardar el cambio.",
        });
      }

      if (
        nuevoEquipo.fichados.length !== 6 ||
        nuevoEquipo.reserva === null ||
        nuevoEquipo.motor === null ||
        nuevoEquipo.prediccionPiloto === null ||
        nuevoEquipo.prediccionMotor === null
      ) {
        return errorJson(
          "Un equipo completo no puede guardarse incompleto.",
          400
        );
      }

      if (
        pilotosCambio &&
        (quitados.length !== 1 || añadidos.length !== 1)
      ) {
        return errorJson(
          "Solo se permite sustituir un piloto por operación.",
          403
        );
      }

      if (
        (motorCambio ||
          reservaCambio ||
          prediccionPilotoCambio ||
          prediccionMotorCambio ||
          pilotosCambio) &&
        (!ventanaActiva || !estadoVentana)
      ) {
        return errorJson(
          "No hay una ventana de mercado activa para modificar el equipo.",
          403
        );
      }

      if (pilotosCambio) {
        if (
          !ventanaActiva ||
          !estadoVentana ||
          estadoVentana.cambios_pilotos >
            ventanaActiva.cambios_pilotos ||
          estadoVentana.cambios_pilotos_aplicados + 1 !==
            estadoVentana.cambios_pilotos
        ) {
          return errorJson(
            "El cambio de piloto no está autorizado o ya se ha aplicado.",
            403
          );
        }
      }

      const cambioReservaPorSustitucion =
        pilotosCambio &&
        existente.reserva !== null &&
        quitados.includes(existente.reserva) &&
        añadidos.length === 1 &&
        nuevoEquipo.reserva === añadidos[0];

      if (motorCambio) {
        if (
          !ventanaActiva?.cambiar_constructor ||
          !estadoVentana?.constructor_modificado ||
          estadoVentana.constructor_modificacion_aplicada
        ) {
          return errorJson(
            "El cambio de constructor no está autorizado o ya se ha aplicado.",
            403
          );
        }
      }

      if (reservaCambio && !cambioReservaPorSustitucion) {
        if (
          !ventanaActiva?.cambiar_reserva ||
          !estadoVentana?.reserva_modificada
        ) {
          return errorJson(
            "El cambio de reserva no está autorizado.",
            403
          );
        }

        if (
          !ventanaActiva.reserva_consumible &&
          estadoVentana.reserva_modificacion_aplicada
        ) {
          return errorJson(
            "Ya has utilizado el cambio de reserva de esta ventana.",
            403
          );
        }
      }

      if (
        (prediccionPilotoCambio || prediccionMotorCambio) &&
        !ventanaActiva?.cambiar_predicciones
      ) {
        return errorJson(
          "Esta ventana no permite cambiar las predicciones.",
          403
        );
      }

      // Consumimos primero los permisos de ventana mediante actualizaciones
      // condicionales. Una solicitud repetida no puede aplicar el mismo cambio.
      if (pilotosCambio && estadoVentana) {
        const aplicado = await aplicarContadorPilotos(
          estadoVentana,
          estadoVentana.cambios_pilotos
        );

        if (!aplicado) {
          return errorJson(
            "El cambio de piloto ya se ha aplicado. Recarga el equipo.",
            409
          );
        }
      }

      if (motorCambio && estadoVentana) {
        const aplicado = await aplicarCambioConstructor(estadoVentana);

        if (!aplicado) {
          return errorJson(
            "El cambio de constructor ya se ha aplicado.",
            409
          );
        }
      }

      if (
        reservaCambio &&
        !cambioReservaPorSustitucion &&
        estadoVentana &&
        !ventanaActiva?.reserva_consumible
      ) {
        const aplicado = await aplicarCambioReserva(estadoVentana);

        if (!aplicado) {
          return errorJson(
            "El cambio de reserva ya se ha aplicado.",
            409
          );
        }
      }
    }

    const originalPiloto =
      existente?.prediccion_piloto_original ??
      existente?.prediccion_piloto ??
      nuevoEquipo.prediccionPiloto;

    const originalMotor =
      existente?.prediccion_motor_original ??
      existente?.prediccion_motor ??
      nuevoEquipo.prediccionMotor;

    const cambiosPilotosGuardados =
      estadoVentana?.cambios_pilotos ??
      existente?.cambios_pilotos ??
      0;

    const datosGuardados = {
      usuario_id: usuario.id,
      usuario: usuario.usuario,
      liga_id: ligaId,
      fichados: nuevoEquipo.fichados,
      reserva: nuevoEquipo.reserva,
      motor: nuevoEquipo.motor,
      prediccion_piloto: nuevoEquipo.prediccionPiloto,
      prediccion_motor: nuevoEquipo.prediccionMotor,
      prediccion_piloto_original: originalPiloto,
      prediccion_motor_original: originalMotor,
      prediccion_piloto_modificada:
        nuevoEquipo.prediccionPiloto !== originalPiloto,
      prediccion_motor_modificada:
        nuevoEquipo.prediccionMotor !== originalMotor,
      constructor_modificado:
        estadoVentana?.constructor_modificado ??
        (inicial ? false : existente.constructor_modificado ?? false),
      reserva_modificada:
        estadoVentana?.reserva_modificada ??
        (inicial ? false : existente.reserva_modificada ?? false),
      cambios_pilotos: cambiosPilotosGuardados,
    };

    if (existente) {
      const { error: updateError } = await supabaseAdmin
        .from("equipos")
        .update(datosGuardados)
        .eq("id", existente.id)
        .eq("usuario_id", usuario.id)
        .eq("liga_id", ligaId);

      if (updateError) {
        console.error("Error actualizando equipo:", updateError);
        return errorJson("No se ha podido guardar el equipo.", 500);
      }
    } else {
      const { error: insertError } = await supabaseAdmin
        .from("equipos")
        .insert({
          ...datosGuardados,
          puntos: 0,
        });

      if (insertError) {
        console.error("Error creando equipo:", insertError);
        return errorJson("No se ha podido crear el equipo.", 500);
      }
    }

    return NextResponse.json({
      ok: true,
      mensaje: "Equipo guardado correctamente.",
    });
  } catch (error) {
    console.error("Error inesperado guardando equipo:", error);
    return errorJson("Error interno del servidor.", 500);
  }
}
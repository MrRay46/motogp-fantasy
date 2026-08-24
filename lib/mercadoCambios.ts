import { supabase } from "@/lib/supabase";

export type EstadoCambiosVentana = {
  id: number;

  usuario_id: number;
  liga_id: number;
  ventana_id: number;

  cambios_pilotos: number;

  constructor_modificado: boolean;
  reserva_modificada: boolean;
};

// ==================================================
// OBTENER ESTADO DE CAMBIOS DE LA VENTANA
// ==================================================

export async function obtenerEstadoCambiosVentana(
  usuarioId: number,
  ligaId: number,
  ventanaId: number
): Promise<EstadoCambiosVentana> {
  const { data, error } = await supabase
    .from("equipos_ventanas")
    .select("*")
    .eq("usuario_id", usuarioId)
    .eq("liga_id", ligaId)
    .eq("ventana_id", ventanaId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `Error obteniendo estado de cambios: ${error.message}`
    );
  }

  // --------------------------------------------------
  // YA EXISTE
  // --------------------------------------------------

  if (data) {
    return data as EstadoCambiosVentana;
  }

  // --------------------------------------------------
  // NO EXISTE → CREAR
  // --------------------------------------------------

  const { data: nuevoEstado, error: crearError } =
    await supabase
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

  if (crearError) {
    throw new Error(
      `Error creando estado de cambios: ${crearError.message}`
    );
  }

  return nuevoEstado as EstadoCambiosVentana;
}

// ==================================================
// REGISTRAR CAMBIO DE PILOTO
// ==================================================

export async function registrarCambioPiloto(
  estadoId: number,
  limite: number
): Promise<EstadoCambiosVentana> {
  const { data: estado, error: lecturaError } =
    await supabase
      .from("equipos_ventanas")
      .select("*")
      .eq("id", estadoId)
      .single();

  if (lecturaError) {
    throw new Error(
      `Error leyendo estado de cambios: ${lecturaError.message}`
    );
  }

  // --------------------------------------------------
  // COMPROBAR LÍMITE
  // --------------------------------------------------

  if (
    estado.cambios_pilotos >= limite
  ) {
    throw new Error(
      "Se ha alcanzado el límite de cambios de pilotos de esta ventana."
    );
  }

  // --------------------------------------------------
  // INCREMENTAR
  // --------------------------------------------------

  const nuevosCambios =
    estado.cambios_pilotos + 1;

  const {
    data: actualizado,
    error: updateError,
  } = await supabase
    .from("equipos_ventanas")
    .update({
      cambios_pilotos: nuevosCambios,
    })
    .eq("id", estadoId)
    .select("*")
    .single();

  if (updateError) {
    throw new Error(
      `Error registrando cambio de piloto: ${updateError.message}`
    );
  }

  return actualizado as EstadoCambiosVentana;
}

// ==================================================
// MARCAR CAMBIO DE CONSTRUCTOR
// ==================================================

export async function marcarConstructorModificado(
  estadoId: number
): Promise<EstadoCambiosVentana> {
  const {
    data: actualizado,
    error,
  } = await supabase
    .from("equipos_ventanas")
    .update({
      constructor_modificado: true,
    })
    .eq("id", estadoId)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Error marcando constructor: ${error.message}`
    );
  }

  return actualizado as EstadoCambiosVentana;
}

// ==================================================
// MARCAR CAMBIO DE RESERVA
// ==================================================

export async function marcarReservaModificada(
  estadoId: number
): Promise<EstadoCambiosVentana> {
  const {
    data: actualizado,
    error,
  } = await supabase
    .from("equipos_ventanas")
    .update({
      reserva_modificada: true,
    })
    .eq("id", estadoId)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `Error marcando reserva: ${error.message}`
    );
  }

  return actualizado as EstadoCambiosVentana;
}
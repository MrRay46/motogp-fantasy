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

async function llamarApi(
  datos: Record<string, number | string>
): Promise<EstadoCambiosVentana> {
  const {
    data: { session },
    error: sesionError,
  } = await supabase.auth.getSession();

  if (sesionError || !session?.access_token) {
    throw new Error("Tu sesión ha caducado. Inicia sesión de nuevo.");
  }

  const respuesta = await fetch("/api/mercado/cambios", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify(datos),
  });

  const resultado = await respuesta.json().catch(() => null);

  if (!respuesta.ok) {
    throw new Error(
      resultado?.error ?? "No se ha podido actualizar el estado del mercado."
    );
  }

  return resultado as EstadoCambiosVentana;
}

export async function obtenerEstadoCambiosVentana(
  _usuarioId: number,
  ligaId: number,
  ventanaId: number
): Promise<EstadoCambiosVentana> {
  return llamarApi({
    accion: "obtener",
    liga_id: ligaId,
    ventana_id: ventanaId,
  });
}

export async function registrarCambioPiloto(
  estadoId: number,
  _limite: number
): Promise<EstadoCambiosVentana> {
  return llamarApi({
    accion: "registrar_piloto",
    estado_id: estadoId,
  });
}

export async function marcarConstructorModificado(
  estadoId: number
): Promise<EstadoCambiosVentana> {
  return llamarApi({
    accion: "marcar_constructor",
    estado_id: estadoId,
  });
}

export async function marcarReservaModificada(
  estadoId: number
): Promise<EstadoCambiosVentana> {
  return llamarApi({
    accion: "marcar_reserva",
    estado_id: estadoId,
  });
}
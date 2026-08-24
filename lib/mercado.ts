import { supabase } from "@/lib/supabase";

export async function obtenerEstadoMercado() {
  const { data, error } = await supabase
    .from("ventanas_mercado")
    .select("*")
    .order("inicio", { ascending: true });

  if (error) {
    console.error(
      "Error obteniendo ventanas de mercado:",
      error
    );

    return null;
  }

  if (!data?.length) {
    return {
      mercadoAbierto: false,
      diasRestantes: null,

      id: null,
      nombre: null,

      cambiosPilotos: 0,
      cambiarConstructor: false,
      cambiarReserva: false,
      cambiarPredicciones: false,
      reservaConsumible: false,
    };
  }

  // ==================================================
  // FECHA ACTUAL
  // ==================================================

  const ahora = new Date();

  const hoy = new Date(
    ahora.getFullYear(),
    ahora.getMonth(),
    ahora.getDate()
  );

  // ==================================================
  // BUSCAR VENTANA ACTIVA
  // ==================================================

  const ventana = data.find((v) => {
    const inicio = convertirFecha(v.inicio);
    const fin = convertirFecha(v.fin);

    return hoy >= inicio && hoy <= fin;
  });

  // ==================================================
  // HAY UNA VENTANA ABIERTA
  // ==================================================

  if (ventana) {
    return {
      mercadoAbierto: true,
      diasRestantes: null,

      // ID DE LA VENTANA ACTUAL
      id: ventana.id,

      nombre: ventana.nombre,

      cambiosPilotos:
        ventana.cambios_pilotos,

      cambiarConstructor:
        ventana.cambiar_constructor,

      cambiarReserva:
        ventana.cambiar_reserva,

      cambiarPredicciones:
        ventana.cambiar_predicciones,

      reservaConsumible:
        ventana.reserva_consumible,
    };
  }

  // ==================================================
  // BUSCAR SIGUIENTE VENTANA
  // ==================================================

  const siguiente = data
    .map((v) => ({
      ...v,

      fechaInicio: convertirFecha(
        v.inicio
      ),
    }))
    .filter(
      (v) => v.fechaInicio > hoy
    )
    .sort(
      (a, b) =>
        a.fechaInicio.getTime() -
        b.fechaInicio.getTime()
    )[0];

  // ==================================================
  // DÍAS HASTA LA SIGUIENTE VENTANA
  // ==================================================

  let diasRestantes: number | null =
    null;

  if (siguiente) {
    const diferencia =
      siguiente.fechaInicio.getTime() -
      hoy.getTime();

    diasRestantes = Math.ceil(
      diferencia /
        (1000 * 60 * 60 * 24)
    );
  }

  // ==================================================
  // MERCADO CERRADO
  // ==================================================

  return {
    mercadoAbierto: false,
    diasRestantes,

    id: null,
    nombre: null,

    cambiosPilotos: 0,
    cambiarConstructor: false,
    cambiarReserva: false,
    cambiarPredicciones: false,
    reservaConsumible: false,
  };
}

// ==================================================
// CONVERTIR DATE DE SUPABASE A FECHA LOCAL
// ==================================================

function convertirFecha(
  fecha: string
): Date {
  const [anio, mes, dia] =
    fecha.split("-").map(Number);

  return new Date(
    anio,
    mes - 1,
    dia
  );
}
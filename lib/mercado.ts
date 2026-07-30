import { supabase } from "@/lib/supabase";

export async function obtenerEstadoMercado() {
  const { data } = await supabase
    .from("ventanas_mercado")
    .select("*")
    .order("inicio");

  if (!data) return null;

  const hoy = new Date();

  const ventana = data.find((v) => {
    const inicio = new Date(v.inicio);
    const fin = new Date(v.fin);

    return hoy >= inicio && hoy <= fin;
  });

 if (!ventana) {
  const siguiente = data
    .filter((v) => new Date(v.inicio) > hoy)
    .sort(
      (a, b) =>
        new Date(a.inicio).getTime() -
        new Date(b.inicio).getTime()
    )[0];

  let diasRestantes = null;

  if (siguiente) {
    diasRestantes = Math.ceil(
      (new Date(siguiente.inicio).getTime() - hoy.getTime()) /
      (1000 * 60 * 60 * 24)
    );
  }

  return {
    mercadoAbierto: false,
    diasRestantes,

    nombre: null,
    cambiosPilotos: 0,
    cambiarConstructor: false,
    cambiarReserva: false,
    cambiarPredicciones: false,
    reservaConsumible: false,
  };
}

return {
  mercadoAbierto: true,
  diasRestantes: null,

  nombre: ventana.nombre,
  cambiosPilotos: ventana.cambios_pilotos,
  cambiarConstructor: ventana.cambiar_constructor,
  cambiarReserva: ventana.cambiar_reserva,
  cambiarPredicciones: ventana.cambiar_predicciones,
  reservaConsumible: ventana.reserva_consumible,
};
}
type EquipoFantasy = {
  id: number;
  usuario: string;
  liga_id: number;
  fichados: string[];
  reserva: string | null;
  motor: string | null;
};

type PilotoFantasy = {
  nombre: string;
  puntos_gp: number;
};

type ConstructorFantasy = {
  nombre: string;
  puntos_gp: number;
};

type DatosFantasy = {
  equipos: EquipoFantasy[];
  pilotos: PilotoFantasy[];
  constructores: ConstructorFantasy[];
};

export type ResultadoEquipoGP = {
  equipoId: number;
  usuario: string;
  ligaId: number;
  puntosGP: number;
  bonusGP: number;
};

export function calcularPuntosEquipos(
  datos: DatosFantasy
): ResultadoEquipoGP[] {
  return datos.equipos.map((equipo) => {
    let puntosGP = 0;

    // -----------------------------------------
    // PILOTOS TITULARES
    // -----------------------------------------

    const titulares = equipo.fichados.filter(
      (nombrePiloto) =>
        nombrePiloto !== equipo.reserva
    );

    let hayTitularConCero = false;

    for (const nombrePiloto of titulares) {
      const piloto = datos.pilotos.find(
        (p) => p.nombre === nombrePiloto
      );

      if (!piloto) {
        continue;
      }

      puntosGP += piloto.puntos_gp;

      if (piloto.puntos_gp === 0) {
        hayTitularConCero = true;
      }
    }

    // -----------------------------------------
    // RESERVA
    // -----------------------------------------

    if (hayTitularConCero && equipo.reserva) {
      const pilotoReserva = datos.pilotos.find(
        (p) => p.nombre === equipo.reserva
      );

      if (pilotoReserva) {
        puntosGP += pilotoReserva.puntos_gp;
      }
    }

    // -----------------------------------------
    // MOTOR
    // -----------------------------------------

    if (equipo.motor) {
      const constructor =
        datos.constructores.find(
          (c) => c.nombre === equipo.motor
        );

      if (constructor) {
        puntosGP += constructor.puntos_gp;
      }
    }

    return {
      equipoId: equipo.id,
      usuario: equipo.usuario,
      ligaId: equipo.liga_id,
      puntosGP,
      bonusGP: 0,
    };
  });
}
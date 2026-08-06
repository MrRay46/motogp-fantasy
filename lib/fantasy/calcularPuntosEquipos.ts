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

    // Pilotos
    for (const nombrePiloto of equipo.fichados) {
      const piloto = datos.pilotos.find(
        (p) => p.nombre === nombrePiloto
      );

      if (piloto) {
        puntosGP += piloto.puntos_gp;
      }
    }

    // Constructor
    if (equipo.motor) {
      const constructor =
        datos.constructores.find(
          (c) =>
            c.nombre === equipo.motor
        );

      if (constructor) {
        puntosGP +=
          constructor.puntos_gp;
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
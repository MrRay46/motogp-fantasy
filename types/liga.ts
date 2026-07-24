export type MovimientoRanking = "up" | "down" | "same";

export interface UsuarioSesion {
  id: number;
  usuario: string;
  avatar: string;
  liga_actual_id: number | null;
}

/* -------------------------------------------------------------------------- */
/*                           MODELOS DE BASE DE DATOS                         */
/* -------------------------------------------------------------------------- */

export interface UsuarioLigaDB {
  id: number;
  usuario: string;
  avatar: string;
}

export interface EquipoLigaDB {
  usuario: string;
  puntos: number;
  posicion_anterior: number;
}

export interface PilotoDB {
  id: number;
  nombre: string;
  slug: string;
  dorsal: number;
  precio: number;
  puntos_gp: number;
  puntos_totales: number;
  equipo: string;
  constructor: string;
  foto: string;
  miniatura: string;
  logo_equipo: string;
  activo: boolean;
  orden: number;

  // Opcional para futuras consultas
  logo_constructor?: string;
}

export interface ConstructorDB {
  id: number;
  nombre: string;
  slug: string;
  logo: string;
  logo_blanco?: string;
  color: string;
  puntos: number;
  activo: boolean;
  orden: number;
}
/* -------------------------------------------------------------------------- */
/*                             MODELOS DE NEGOCIO                             */
/* -------------------------------------------------------------------------- */

export interface RankingJugador {
  id: number;
  usuario: string;
  avatar: string;
  puntos: number;
  posicion: number;
  posicionAnterior: number;
  movimiento: MovimientoRanking;
}

export interface DestacadosGP {
  granPremio: {
    nombre: string;
    pais: string;
    imagen: string;
    fechaInicio: string;
    fechaFin: string;
  };

  sprintWinner: PilotoDB | null;
  raceWinner: PilotoDB | null;
  riderInForm: PilotoDB | null;
}



export interface PilotoRanking {
  posicion: number;
  nombre: string;
  puntos: number;
  foto: string;
}

export interface ConstructorRanking { 
  posicion: number; 
  nombre: string; 
  puntos: number; 
  logo: string; 
}

export interface EquipoFantasy {
  titulares: string[];
  reserva: string;
  motor: string;

  prediccionPiloto: string;
  prediccionMotor: string;

  pilotoModificada: boolean;
  motorModificada: boolean;
}
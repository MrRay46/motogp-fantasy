export type MovimientoRanking = "up" | "down" | "same";

export interface UsuarioSesion {
  id: number;
  usuario: string;
  avatar: string;
  liga_actual_id: number | null;
}

/**
 * Modelos de base de datos
 */

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

/**
 * Modelos de negocio
 */

export interface RankingJugador {
  id: number;

  usuario: string;

  avatar: string;

  puntos: number;

  posicion: number;

  posicionAnterior: number;

  movimiento: MovimientoRanking;
}

export interface GPHighlight {
  titulo: string;
  nombre: string;
  imagen: string;
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
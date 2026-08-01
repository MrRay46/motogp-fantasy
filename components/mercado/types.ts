import { pilotos } from "@/data/pilotos";
import { motores } from "@/data/motores";

export type Piloto = (typeof pilotos)[number];

export type Constructor = (typeof motores)[number];

export type MarketPilotState = {
  fichado: boolean;
  reserva: boolean;

  puedeFichar: boolean;
  puedeReserva: boolean;
};

export type MarketPilotActions = {
  fichar: () => void;
  reserva: () => void;
};

export type MarketConstructorState = {
  seleccionado: boolean;
  puedeSeleccionar: boolean;
};

export type MarketConstructorActions = {
  seleccionar: () => void;
};
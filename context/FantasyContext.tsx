"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type EquipoJugador = {
  fichados: string[];
  reserva: string | null;
  motor: string | null;

  prediccionPiloto: string | null;
  prediccionMotor: string | null;
};

type FantasyContextType = {
  equipos: {
    [jugador: string]: EquipoJugador;
  };

  setEquipos: React.Dispatch<
    React.SetStateAction<{
      [jugador: string]: EquipoJugador;
    }>
  >;

  jugadorActual: string;

  setJugadorActual: React.Dispatch<
    React.SetStateAction<string>
  >;

  cargando: boolean;
};

const FantasyContext =
  createContext<FantasyContextType | null>(
    null
  );

export function FantasyProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [
    jugadorActual,
    setJugadorActual,
  ] = useState("De la Raya Jr");

  const [
    equipos,
    setEquipos,
  ] = useState<{
    [jugador: string]: EquipoJugador;
  }>({});

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {

    const jugadorGuardado =
      localStorage.getItem(
        "usuarioLogueado"
      );

    if (jugadorGuardado) {

      setJugadorActual(
        jugadorGuardado
      );

    }

  }, []);

  useEffect(() => {

    const equiposGuardados =
      localStorage.getItem(
        "equipos"
      );

    if (equiposGuardados) {

      setEquipos(
        JSON.parse(
          equiposGuardados
        )
      );

    }

    setCargando(false);

  }, []);

  useEffect(() => {

    localStorage.setItem(
      "equipos",
      JSON.stringify(equipos)
    );

  }, [equipos]);

  useEffect(() => {

    localStorage.setItem(
      "jugadorActual",
      jugadorActual
    );

  }, [jugadorActual]);

  return (
    <FantasyContext.Provider
      value={{
        equipos,
        setEquipos,
        jugadorActual,
        setJugadorActual,
        cargando,
      }}
    >
      {children}
    </FantasyContext.Provider>
  );
}

export function useFantasy() {

  const context =
    useContext(FantasyContext);

  if (!context) {

    throw new Error(
      "useFantasy debe usarse dentro de FantasyProvider"
    );

  }

  return context;
}
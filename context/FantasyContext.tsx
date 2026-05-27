"use client";

import { supabase } from "@/lib/supabase";

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

    const cargarEquipo =
      async () => {

        const { data } =
          await supabase
            .from("equipos")
            .select("*")
            .eq(
              "usuario",
              jugadorActual
            )
            .single();

        if (data) {

          setEquipos({
            [jugadorActual]: {

              fichados:
                data.fichados || [],

              reserva:
                data.reserva,

              motor:
                data.motor,

              prediccionPiloto:
                data.prediccion_piloto,

              prediccionMotor:
                data.prediccion_motor,
            },
          });

        }

      };

    cargarEquipo();

  }, [jugadorActual]);

  useEffect(() => {

    const guardarEquipo =
      async () => {

        const equipo =
          equipos[jugadorActual];

        if (!equipo) return;

        await supabase
          .from("equipos")
          .upsert({

            usuario:
              jugadorActual,

            fichados:
              equipo.fichados,

            reserva:
              equipo.reserva,

            motor:
              equipo.motor,

            prediccion_piloto:
              equipo.prediccionPiloto,

            prediccion_motor:
              equipo.prediccionMotor,

          });

      };

    guardarEquipo();

  }, [equipos, jugadorActual]);

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
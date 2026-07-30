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

  prediccionPilotoOriginal: string | null;
  prediccionMotorOriginal: string | null;

  prediccionPilotoModificada?: boolean;
  prediccionMotorModificada?: boolean;

  constructorModificado?: boolean;
  reservaModificada?: boolean;
  cambiosPilotos?: number;
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
] = useState("");

  const [
    equipos,
    setEquipos,
  ] = useState<{
    [jugador: string]: EquipoJugador;
  }>({});

  const [cargando, setCargando] =
    useState(true);
const cargarEquiposSupabase =
  async () => {

    const { data, error } =
      await supabase
        .from("equipos")
        .select("*");

    if (error) {
      console.error(error);
      setCargando(false);
      return;
    }

    const equiposCargados: {
      [jugador: string]: EquipoJugador;
    } = {};

    data.forEach((fila) => {

      equiposCargados[
        fila.usuario
      ] = {

        fichados:
          fila.fichados || [],

        reserva:
          fila.reserva,

        motor:
          fila.motor,

        prediccionPiloto:
          fila.prediccion_piloto,

        prediccionMotor:
          fila.prediccion_motor,

          prediccionPilotoOriginal:
  fila.prediccion_piloto_original,

prediccionMotorOriginal:
  fila.prediccion_motor_original,

  prediccionPilotoModificada:
  fila.prediccion_piloto_modificada,

prediccionMotorModificada:
  fila.prediccion_motor_modificada,
  constructorModificado:
  fila.constructor_modificado ?? false,

reservaModificada:
  fila.reserva_modificada ?? false,

cambiosPilotos:
  fila.cambios_pilotos ?? 0,
      };

    });

    setEquipos(
      equiposCargados
    );

    setCargando(false);

  };
  useEffect(() => {

    const sesion = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

if (sesion.usuario) {
  setJugadorActual(sesion.usuario);
}

  }, []);

 useEffect(() => {

  cargarEquiposSupabase();

}, []);

  useEffect(() => {

  localStorage.setItem(
    "equipos",
    JSON.stringify(equipos)
  );

  if (
    Object.keys(equipos).length > 0
  ) {
    guardarEquiposSupabase();
  }

}, [equipos]);

  useEffect(() => {

    localStorage.setItem(
      "jugadorActual",
      jugadorActual
    );

  }, [jugadorActual]);
const guardarEquiposSupabase = async () => {

  console.log(
    "GUARDANDO EN SUPABASE",
    equipos
  );

  for (const jugador in equipos) {

  const equipo = equipos[jugador];

 
  const { error } =
    await supabase
      .from("equipos")
      .upsert(
    {
      usuario: jugador,
      fichados: equipo.fichados,
      reserva: equipo.reserva,
      motor: equipo.motor,
      prediccion_piloto:
        equipo.prediccionPiloto,
      prediccion_motor:
        equipo.prediccionMotor,
        prediccion_piloto_original:
  equipo.prediccionPilotoOriginal,
prediccion_motor_original:
  equipo.prediccionMotorOriginal,
  prediccion_piloto_modificada:
  equipo.prediccionPilotoModificada,

prediccion_motor_modificada:
  equipo.prediccionMotorModificada,
  constructor_modificado:
  equipo.constructorModificado,

reserva_modificada:
  equipo.reservaModificada,

cambios_pilotos:
  equipo.cambiosPilotos,
    },
    {
      onConflict: "usuario",
    }
  );
  if (error) {
  console.error(error);
}
  }
};
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
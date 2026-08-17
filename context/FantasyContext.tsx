"use client";

import { supabase } from "@/lib/supabase";
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// =====================================================
// TIPOS
// =====================================================

export type EquipoJugador = {
  fichados: string[];

  reserva: string | null;

  motor: string | null;

  puntos: number;

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

// =====================================================
// CONTEXTO
// =====================================================

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

  recargarEquipo: () => Promise<void>;
};

// =====================================================
// CONTEXT
// =====================================================

const FantasyContext =
  createContext<FantasyContextType | null>(null);

// =====================================================
// PROVIDER
// =====================================================

export function FantasyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jugadorActual, setJugadorActual] =
    useState("");

  const [equipos, setEquipos] = useState<{
    [jugador: string]: EquipoJugador;
  }>({});

  const [cargando, setCargando] =
    useState(true);

  // ===================================================
  // CARGAR EQUIPO DE LA LIGA ACTUAL
  // ===================================================

  async function cargarEquipoActual() {
    try {
      setCargando(true);

      const guardado =
        localStorage.getItem("usuario");

      // -----------------------------------------------
      // NO HAY SESIÓN
      // -----------------------------------------------

      if (!guardado) {
        setEquipos({});
        setJugadorActual("");
        return;
      }

      let sesion;

      try {
        sesion = JSON.parse(guardado);
      } catch (error) {
        console.error(
          "Error leyendo sesión:",
          error
        );

        setEquipos({});
        setJugadorActual("");
        return;
      }

      // -----------------------------------------------
      // SESIÓN INVÁLIDA
      // -----------------------------------------------

      if (!sesion.id || !sesion.usuario) {
        setEquipos({});
        setJugadorActual("");
        return;
      }

      setJugadorActual(sesion.usuario);

      // -----------------------------------------------
      // USUARIO SIN LIGA
      // -----------------------------------------------

      if (!sesion.liga_actual_id) {
        console.log(
          "Usuario sin liga activa."
        );

        setEquipos({});

        // Limpiamos también el equipo cacheado
        // porque pertenece a otra situación.
        localStorage.removeItem("equipos");

        return;
      }

      console.log(
        "Cargando equipo:",
        {
          usuario_id: sesion.id,
          liga_id: sesion.liga_actual_id,
        }
      );

      // -----------------------------------------------
      // BUSCAR EQUIPO DE USUARIO + LIGA
      // -----------------------------------------------

      const {
        data: equipo,
        error,
      } = await supabase
        .from("equipos")
        .select("*")
        .eq("usuario_id", sesion.id)
        .eq(
          "liga_id",
          sesion.liga_actual_id
        )
        .maybeSingle();

      if (error) {
        console.error(
          "Error cargando equipo actual:",
          error
        );

        setEquipos({});
        return;
      }

      // -----------------------------------------------
      // NO EXISTE EQUIPO EN ESTA LIGA
      // -----------------------------------------------

      if (!equipo) {
        console.log(
          "El usuario pertenece a la liga pero todavía no tiene equipo."
        );

        setEquipos({});

        localStorage.removeItem("equipos");

        return;
      }

      // -----------------------------------------------
      // CONVERTIR SUPABASE → CONTEXTO
      // -----------------------------------------------

      const equipoCargado: EquipoJugador = {
        fichados:
          equipo.fichados ?? [],

        reserva:
          equipo.reserva ?? null,

        motor:
          equipo.motor ?? null,

        puntos:
          equipo.puntos ?? 0,

        prediccionPiloto:
          equipo.prediccion_piloto ?? null,

        prediccionMotor:
          equipo.prediccion_motor ?? null,

        prediccionPilotoOriginal:
          equipo.prediccion_piloto_original ??
          null,

        prediccionMotorOriginal:
          equipo.prediccion_motor_original ??
          null,

        prediccionPilotoModificada:
          equipo.prediccion_piloto_modificada ??
          false,

        prediccionMotorModificada:
          equipo.prediccion_motor_modificada ??
          false,

        constructorModificado:
          equipo.constructor_modificado ??
          false,

        reservaModificada:
          equipo.reserva_modificada ??
          false,

        cambiosPilotos:
          equipo.cambios_pilotos ?? 0,
      };

      // -----------------------------------------------
      // GUARDAR SOLO EL EQUIPO DE LA LIGA ACTUAL
      // -----------------------------------------------

      setEquipos({
        [sesion.usuario]: equipoCargado,
      });

      // Guardamos también la versión correcta
      // en localStorage.
      localStorage.setItem(
        "equipos",
        JSON.stringify({
          [sesion.usuario]: equipoCargado,
        })
      );

    } catch (error) {
      console.error(
        "Error inesperado cargando equipo:",
        error
      );

      setEquipos({});
    } finally {
      setCargando(false);
    }
  }

  // ===================================================
  // GUARDAR EQUIPO ACTUAL
  // ===================================================

  async function guardarEquipoActual(
    equiposActuales: {
      [jugador: string]: EquipoJugador;
    }
  ) {
    try {
      const guardado =
        localStorage.getItem("usuario");

      if (!guardado) return;

      let sesion;

      try {
        sesion = JSON.parse(guardado);
      } catch {
        return;
      }

      // -----------------------------------------------
      // DATOS NECESARIOS
      // -----------------------------------------------

      if (
        !sesion.id ||
        !sesion.usuario ||
        !sesion.liga_actual_id
      ) {
        return;
      }

      // -----------------------------------------------
      // OBTENER EQUIPO DEL CONTEXTO
      // -----------------------------------------------

      const equipo =
        equiposActuales[sesion.usuario];

      // -----------------------------------------------
      // NO EXISTE EQUIPO
      // -----------------------------------------------

      if (!equipo) {
        return;
      }

      console.log(
        "GUARDANDO EQUIPO ACTUAL",
        {
          usuario_id: sesion.id,
          liga_id: sesion.liga_actual_id,
          usuario: sesion.usuario,
        }
      );

      // -----------------------------------------------
      // UPSERT
      //
      // MUY IMPORTANTE:
      //
      // No enviamos "puntos".
      //
      // Así:
      //
      // - equipo nuevo → Supabase usa puntos = 0
      // - equipo existente → conserva sus puntos
      //
      // -----------------------------------------------

      const { error } =
        await supabase
          .from("equipos")
          .upsert(
            {
              usuario_id:
                sesion.id,

              usuario:
                sesion.usuario,

              liga_id:
                sesion.liga_actual_id,

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

              prediccion_piloto_original:
                equipo.prediccionPilotoOriginal,

              prediccion_motor_original:
                equipo.prediccionMotorOriginal,

              prediccion_piloto_modificada:
                equipo.prediccionPilotoModificada ??
                false,

              prediccion_motor_modificada:
                equipo.prediccionMotorModificada ??
                false,

              constructor_modificado:
                equipo.constructorModificado ??
                false,

              reserva_modificada:
                equipo.reservaModificada ??
                false,

              cambios_pilotos:
                equipo.cambiosPilotos ?? 0,
            },
            {
              onConflict:
                "usuario_id,liga_id",
            }
          );

      if (error) {
        console.error(
          "Error guardando equipo:",
          error
        );
      }

    } catch (error) {
      console.error(
        "Error inesperado guardando equipo:",
        error
      );
    }
  }

  // ===================================================
  // INICIALIZACIÓN
  // ===================================================

  useEffect(() => {
    cargarEquipoActual();
  }, []);

  // ===================================================
  // GUARDAR CAMBIOS DEL EQUIPO
  // ===================================================

  useEffect(() => {
    if (cargando) return;

    // -----------------------------------------------
    // GUARDAR CACHE LOCAL
    // -----------------------------------------------

    localStorage.setItem(
      "equipos",
      JSON.stringify(equipos)
    );

    // -----------------------------------------------
    // SI NO HAY EQUIPO, NO GUARDAR
    // -----------------------------------------------

    if (
      Object.keys(equipos).length === 0
    ) {
      return;
    }

    guardarEquipoActual(equipos);

  }, [equipos, cargando]);

  // ===================================================
  // GUARDAR JUGADOR ACTUAL
  // ===================================================

  useEffect(() => {
    if (!jugadorActual) return;

    localStorage.setItem(
      "jugadorActual",
      jugadorActual
    );
  }, [jugadorActual]);

  // ===================================================
  // PROVIDER
  // ===================================================

  return (
    <FantasyContext.Provider
      value={{
        equipos,

        setEquipos,

        jugadorActual,

        setJugadorActual,

        cargando,

        recargarEquipo:
          cargarEquipoActual,
      }}
    >
      {children}
    </FantasyContext.Provider>
  );
}

// =====================================================
// HOOK
// =====================================================

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
"use client";

import {
  MarketHeader,
  MarketStatus,
  BudgetCard,
  PilotsMarket,
  ConstructorsMarket,
  SeasonPredictions,
} from "@/components/mercado";

import { useEffect, useState } from "react";

import AppLayout from "@/components/layout/AppLayout";

import { motores } from "@/data/motores";
import { pilotos } from "@/data/pilotos";

import { obtenerEstadoMercado } from "@/lib/mercado";

import {
  obtenerEstadoCambiosVentana,
  registrarCambioPiloto,
  marcarConstructorModificado,
  marcarReservaModificada,
  type EstadoCambiosVentana,
} from "@/lib/mercadoCambios";

import { getUsuarioActual } from "@/lib/session";

import { useFantasy } from "@/context/FantasyContext";

export default function MercadoPage() {
  const {
    equipos,
    setEquipos,
    jugadorActual,
    cargando,
  } = useFantasy();

  // =====================================================
  // USUARIO ACTUAL
  // =====================================================

  const usuario = getUsuarioActual();

  const usuarioId =
    usuario?.id ?? null;

  const ligaId =
    usuario?.liga_actual_id ?? null;

  // =====================================================
  // EQUIPO ACTUAL
  // =====================================================

  const equipoActual = equipos[jugadorActual] || {
    fichados: [],
    reserva: null,
    motor: null,

    puntos: 0,

    prediccionPiloto: null,
    prediccionMotor: null,

    prediccionPilotoOriginal: null,
    prediccionMotorOriginal: null,

    prediccionPilotoModificada: false,
    prediccionMotorModificada: false,

    constructorModificado: false,
    reservaModificada: false,

    cambiosPilotos: 0,
  };

  const fichados = equipoActual.fichados;
  const reserva = equipoActual.reserva;
  const motor = equipoActual.motor;

  const prediccionPiloto =
    equipoActual.prediccionPiloto;

  const prediccionMotor =
    equipoActual.prediccionMotor;

  // =====================================================
  // ESTADO DEL MERCADO
  // =====================================================

  const [mercadoAbierto, setMercadoAbierto] =
    useState(false);

  const [diasRestantes, setDiasRestantes] =
    useState<number | null>(null);

  const [estadoMercado, setEstadoMercado] =
    useState<any>(null);

  // =====================================================
  // ESTADO DE CAMBIOS DE LA VENTANA
  // =====================================================

  const [
    estadoCambiosVentana,
    setEstadoCambiosVentana,
  ] =
    useState<EstadoCambiosVentana | null>(null);

  const [
    cargandoEstadoCambios,
    setCargandoEstadoCambios,
  ] = useState(true);

  // =====================================================
  // CREACIÓN DEL EQUIPO INICIAL
  // =====================================================

  const [
    creandoEquipoInicial,
    setCreandoEquipoInicial,
  ] = useState<boolean | null>(null);

  // =====================================================
  // PILOTO PENDIENTE DE SUSTITUCIÓN
  // =====================================================

  const [
    pilotoPendienteCambio,
    setPilotoPendienteCambio,
  ] = useState<{
    nombre: string;
    eraReserva: boolean;
  } | null>(null);

  // =====================================================
  // DETECTAR CREACIÓN INICIAL
  // =====================================================

  useEffect(() => {
    if (cargando) {
      return;
    }

    setCreandoEquipoInicial(
      !equipos[jugadorActual]
    );
  }, [
    cargando,
    jugadorActual,
    equipos,
  ]);

  // =====================================================
  // CARGAR ESTADO DEL MERCADO
  // =====================================================

  useEffect(() => {
    async function cargarMercado() {
      try {
        setCargandoEstadoCambios(true);

        const estado =
          await obtenerEstadoMercado();
console.log(
  "ESTADO MERCADO:",
  estado
);
        if (!estado) {
          setEstadoMercado(null);
          setMercadoAbierto(false);
          setDiasRestantes(null);
          setEstadoCambiosVentana(null);
          return;
        }

        setEstadoMercado(estado);

        setMercadoAbierto(
          estado.mercadoAbierto
        );

        setDiasRestantes(
          estado.diasRestantes
        );

        // -------------------------------------------------
        // MERCADO CERRADO
        // -------------------------------------------------

        if (
          !estado.mercadoAbierto ||
          !estado.id ||
          !usuarioId ||
          !ligaId
        ) {
          setEstadoCambiosVentana(null);
          return;
        }

        // -------------------------------------------------
        // OBTENER ESTADO DE ESTA VENTANA
        // -------------------------------------------------

        const estadoCambios =
          await obtenerEstadoCambiosVentana(
            usuarioId,
            ligaId,
            estado.id
          );

        setEstadoCambiosVentana(
          estadoCambios
        );

      } catch (error) {
        console.error(
          "Error cargando estado del mercado:",
          error
        );

        setEstadoMercado(null);
        setMercadoAbierto(false);
        setEstadoCambiosVentana(null);

      } finally {
        setCargandoEstadoCambios(false);
      }
    }

    cargarMercado();
  }, [
    usuarioId,
    ligaId,
  ]);

  // =====================================================
  // EQUIPO INICIAL COMPLETO
  // =====================================================

  const equipoInicialCompleto = () => {
    return (
      fichados.length === 6 &&
      reserva !== null &&
      motor !== null &&
      prediccionPiloto !== null &&
      prediccionMotor !== null
    );
  };

  // =====================================================
  // PERMISO CAMBIOS DE PILOTOS
  // =====================================================

  const puedeCambiarPilotos = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    if (cargandoEstadoCambios) {
      return false;
    }

    // -------------------------------------------------
    // CREACIÓN INICIAL
    // -------------------------------------------------

    if (creandoEquipoInicial) {
      return true;
    }

    // -------------------------------------------------
    // EQUIPO YA CREADO
    // -------------------------------------------------

    if (!mercadoAbierto) {
      return false;
    }

    if (!estadoCambiosVentana) {
      return false;
    }

    const limite =
      estadoMercado?.cambiosPilotos ?? 0;

    const realizados =
      estadoCambiosVentana.cambios_pilotos;

    return realizados < limite;
  };

  // =====================================================
  // PERMISO CAMBIO DE RESERVA
  // =====================================================

  const puedeCambiarReserva = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    if (cargandoEstadoCambios) {
      return false;
    }

    // -------------------------------------------------
    // CREACIÓN INICIAL
    // -------------------------------------------------

    if (creandoEquipoInicial) {
      return true;
    }

    // -------------------------------------------------
    // EQUIPO YA CREADO
    // -------------------------------------------------

    if (!mercadoAbierto) {
      return false;
    }

    if (!estadoMercado?.cambiarReserva) {
      return false;
    }

    if (!estadoCambiosVentana) {
      return false;
    }

    // -------------------------------------------------
    // RESERVA CONSUMIBLE
    // -------------------------------------------------

    if (
      estadoCambiosVentana.reserva_modificada &&
      !estadoMercado.reservaConsumible
    ) {
      return false;
    }

    return true;
  };

  // =====================================================
  // PERMISO CAMBIO DE CONSTRUCTOR
  // =====================================================

  const puedeCambiarConstructor = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    if (cargandoEstadoCambios) {
      return false;
    }

    // -------------------------------------------------
    // CREACIÓN INICIAL
    // -------------------------------------------------

    if (creandoEquipoInicial) {
      return true;
    }

    // -------------------------------------------------
    // EQUIPO YA CREADO
    // -------------------------------------------------

    if (!mercadoAbierto) {
      return false;
    }

    if (
      !estadoMercado?.cambiarConstructor
    ) {
      return false;
    }

    if (!estadoCambiosVentana) {
      return false;
    }

    if (
      estadoCambiosVentana.constructor_modificado
    ) {
      return false;
    }

    return true;
  };

  // =====================================================
  // PERMISO PREDICCIONES
  // =====================================================

  const puedeCambiarPredicciones = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    // -------------------------------------------------
    // CREACIÓN INICIAL
    // -------------------------------------------------

    if (creandoEquipoInicial) {
      return true;
    }

    // -------------------------------------------------
    // EQUIPO YA CREADO
    // -------------------------------------------------

    if (!mercadoAbierto) {
      return false;
    }

    if (
      !estadoMercado?.cambiarPredicciones
    ) {
      return false;
    }

    return true;
  };

  // =====================================================
  // GUARDAR FICHADOS
  // =====================================================

  const setFichados = (
    nuevosFichados: string[]
  ) => {
    setEquipos((prev) => ({
      ...prev,

      [jugadorActual]: {
        ...prev[jugadorActual],
        fichados: nuevosFichados,
      },
    }));
  };

  // =====================================================
  // GUARDAR RESERVA
  // =====================================================

  const setReserva = (
    nuevaReserva: string | null
  ) => {
    setEquipos((prev) => ({
      ...prev,

      [jugadorActual]: {
        ...prev[jugadorActual],
        reserva: nuevaReserva,
      },
    }));
  };

  // =====================================================
  // GUARDAR MOTOR
  // =====================================================

  const setMotor = (
    nuevoMotor: string | null
  ) => {
    setEquipos((prev) => ({
      ...prev,

      [jugadorActual]: {
        ...prev[jugadorActual],
        motor: nuevoMotor,
      },
    }));
  };

  // =====================================================
  // PREDICCIÓN PILOTO
  // =====================================================

  const setPrediccionPiloto = (
    piloto: string
  ) => {
    if (!puedeCambiarPredicciones()) {
      return;
    }

    setEquipos((prev) => {
      const actual =
        prev[jugadorActual];

      if (!actual) {
        return prev;
      }

      const original =
        actual.prediccionPilotoOriginal ??
        piloto;

      const modificada =
        original !== piloto
          ? true
          : actual.prediccionPilotoModificada ??
            false;

      return {
        ...prev,

        [jugadorActual]: {
          ...actual,

          prediccionPiloto:
            piloto,

          prediccionPilotoOriginal:
            original,

          prediccionPilotoModificada:
            modificada,
        },
      };
    });
  };

  // =====================================================
  // PREDICCIÓN CONSTRUCTOR
  // =====================================================

  const setPrediccionMotor = (
    marca: string
  ) => {
    if (!puedeCambiarPredicciones()) {
      return;
    }

    setEquipos((prev) => {
      const actual =
        prev[jugadorActual];

      if (!actual) {
        return prev;
      }

      const original =
        actual.prediccionMotorOriginal ??
        marca;

      const modificada =
        original !== marca
          ? true
          : actual.prediccionMotorModificada ??
            false;

      return {
        ...prev,

        [jugadorActual]: {
          ...actual,

          prediccionMotor:
            marca,

          prediccionMotorOriginal:
            original,

          prediccionMotorModificada:
            modificada,
        },
      };
    });
  };

  // =====================================================
  // DATOS DEL EQUIPO
  // =====================================================

  const equipo = pilotos.filter(
    (piloto) =>
      fichados.includes(
        piloto.nombre
      )
  );

  const motorSeleccionado =
    motores.find(
      (item) =>
        item.nombre === motor
    );

  const precioMotor =
    motorSeleccionado?.precio ?? 0;

  const presupuestoUsado =
    equipo.reduce(
      (total, piloto) =>
        total + piloto.precio,
      0
    ) + precioMotor;

  const presupuestoRestante =
    172 - presupuestoUsado;

  // =====================================================
  // CAMBIO DE PILOTO
  // =====================================================

  const manejarFichaje = async (
    piloto: (typeof pilotos)[number]
  ) => {
    const fichado =
      fichados.includes(
        piloto.nombre
      );

    // -------------------------------------------------
    // QUITAR PILOTO
    // -------------------------------------------------

    if (fichado) {

      // -----------------------------------------------
      // CREACIÓN INICIAL
      // -----------------------------------------------

      if (creandoEquipoInicial) {
        setFichados(
          fichados.filter(
            (nombre) =>
              nombre !==
              piloto.nombre
          )
        );

        if (
          reserva ===
          piloto.nombre
        ) {
          setReserva(null);
        }

        return;
      }

      // -----------------------------------------------
      // EQUIPO YA CREADO
      // -----------------------------------------------

      if (!puedeCambiarPilotos()) {
        return;
      }

      const eraReserva =
        reserva === piloto.nombre;

      setPilotoPendienteCambio({
        nombre:
          piloto.nombre,

        eraReserva,
      });

      setFichados(
        fichados.filter(
          (nombre) =>
            nombre !==
            piloto.nombre
        )
      );

      if (eraReserva) {
        setReserva(null);
      }

      return;
    }

    // -------------------------------------------------
    // FICHAJE DE PILOTO NUEVO
    // -------------------------------------------------

    if (
      fichados.length >= 6
    ) {
      return;
    }

    // -------------------------------------------------
    // PRESUPUESTO
    // -------------------------------------------------

    if (
      presupuestoUsado +
        piloto.precio >
      172
    ) {
      return;
    }

    // -------------------------------------------------
    // SUSTITUCIÓN REAL
    // -------------------------------------------------

    if (
      !creandoEquipoInicial &&
      pilotoPendienteCambio
    ) {
      if (!mercadoAbierto) {
        return;
      }

      if (!estadoCambiosVentana) {
        return;
      }

      if (!puedeCambiarPilotos()) {
        return;
      }

      // -----------------------------------------------
      // REGISTRAR CAMBIO EN LA VENTANA
      // -----------------------------------------------

      try {
        const nuevoEstado =
          await registrarCambioPiloto(
            estadoCambiosVentana.id,
            estadoMercado?.cambiosPilotos ?? 0
          );

        // ---------------------------------------------
        // ACTUALIZAR ESTADO LOCAL DE LA VENTANA
        // ---------------------------------------------

        setEstadoCambiosVentana(
          nuevoEstado
        );

        // ---------------------------------------------
        // ACTUALIZAR EQUIPO
        // ---------------------------------------------

        const nuevosFichados = [
          ...fichados,
          piloto.nombre,
        ];

        setFichados(
          nuevosFichados
        );

        if (
          pilotoPendienteCambio.eraReserva
        ) {
          setReserva(
            piloto.nombre
          );
        }

        setPilotoPendienteCambio(
          null
        );

      } catch (error) {
        console.error(
          "Error registrando cambio de piloto:",
          error
        );

        return;
      }

      return;
    }

    // -------------------------------------------------
    // FICHAJE NORMAL DEL EQUIPO INICIAL
    // -------------------------------------------------

    setFichados([
      ...fichados,
      piloto.nombre,
    ]);
  };

  // =====================================================
  // RESERVA
  // =====================================================

  const manejarReserva = async (
    piloto: (typeof pilotos)[number]
  ) => {
    if (!puedeCambiarReserva()) {
      return;
    }

    if (
      reserva === piloto.nombre
    ) {
      return;
    }

    // -------------------------------------------------
    // CREACIÓN INICIAL
    // -------------------------------------------------

    if (creandoEquipoInicial) {
      setReserva(
        piloto.nombre
      );

      return;
    }

    // -------------------------------------------------
    // COMPROBAR ESTADO
    // -------------------------------------------------

    if (!estadoCambiosVentana) {
      return;
    }

    // -------------------------------------------------
    // GUARDAR RESERVA
    // -------------------------------------------------

    setReserva(
      piloto.nombre
    );

    // -------------------------------------------------
    // MARCAR CAMBIO DE RESERVA
    // -------------------------------------------------

    if (
      !estadoCambiosVentana.reserva_modificada
    ) {
      try {
        const nuevoEstado =
          await marcarReservaModificada(
            estadoCambiosVentana.id
          );

        setEstadoCambiosVentana(
          nuevoEstado
        );
      } catch (error) {
        console.error(
          "Error marcando cambio de reserva:",
          error
        );
      }
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <AppLayout>
      <MarketHeader />

      <MarketStatus
        mercadoAbierto={
          mercadoAbierto
        }
        diasRestantes={
          diasRestantes
        }
      />

      <BudgetCard
        presupuestoRestante={
          presupuestoRestante
        }
      />

      <PilotsMarket
        pilotos={pilotos}
        fichados={fichados}
        reserva={reserva}
        puedeFichar={
          puedeCambiarPilotos()
        }
        puedeQuitar={
          puedeCambiarPilotos()
        }
        puedeElegirReserva={
          puedeCambiarReserva()
        }
        onFichar={
          manejarFichaje
        }
        onReserva={
          manejarReserva
        }
      />

      <div className="mt-16">
        <ConstructorsMarket
          constructores={motores}
          constructorSeleccionado={
            motor
          }
          mercadoAbierto={
            puedeCambiarConstructor()
          }
          onSeleccionar={async (
            constructor
          ) => {
            if (
              !puedeCambiarConstructor()
            ) {
              return;
            }

            // -------------------------------------------
            // CREACIÓN INICIAL
            // -------------------------------------------

            if (creandoEquipoInicial) {
              setMotor(
                constructor.nombre
              );

              return;
            }

            // -------------------------------------------
            // EQUIPO YA CREADO
            // -------------------------------------------

            if (!estadoCambiosVentana) {
              return;
            }

            try {
              const nuevoEstado =
                await marcarConstructorModificado(
                  estadoCambiosVentana.id
                );

              setEstadoCambiosVentana(
                nuevoEstado
              );

              setMotor(
                constructor.nombre
              );

            } catch (error) {
              console.error(
                "Error registrando cambio de constructor:",
                error
              );
            }
          }}
        />
      </div>

      <SeasonPredictions
        pilotos={pilotos}
        constructores={motores}
        prediccionPiloto={
          prediccionPiloto
        }
        prediccionConstructor={
          prediccionMotor
        }
        puedeCambiarPredicciones={
          puedeCambiarPredicciones()
        }
        onSeleccionarPiloto={
          setPrediccionPiloto
        }
        onSeleccionarConstructor={
          setPrediccionMotor
        }
      />
    </AppLayout>
  );
}
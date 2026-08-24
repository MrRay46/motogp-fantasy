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

import { useFantasy } from "@/context/FantasyContext";

export default function MercadoPage() {
  const {
    equipos,
    setEquipos,
    jugadorActual,
    cargando,
  } = useFantasy();

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

  const [mercadoAbierto, setMercadoAbierto] =
    useState(false);

  const [diasRestantes, setDiasRestantes] =
    useState<number | null>(null);

  const [estadoMercado, setEstadoMercado] =
    useState<any>(null);

  /*
   * TRUE solamente mientras el usuario está
   * creando su equipo por primera vez.
   *
   * IMPORTANTE:
   * No usamos equipoInicialCompleto() para esto,
   * porque durante una sustitución el equipo puede
   * tener temporalmente 5 pilotos y sigue siendo
   * un equipo ya creado.
   */
  const [
    creandoEquipoInicial,
    setCreandoEquipoInicial,
  ] = useState<boolean | null>(null);

  /*
   * Piloto eliminado que está pendiente
   * de ser sustituido.
   */
  const [
    pilotoPendienteCambio,
    setPilotoPendienteCambio,
  ] = useState<{
    nombre: string;
    eraReserva: boolean;
  } | null>(null);

  // =====================================================
  // DETECTAR SI ESTAMOS CREANDO EL EQUIPO POR PRIMERA VEZ
  // =====================================================

  useEffect(() => {
    if (cargando) {
      return;
    }

    /*
     * Si después de cargar Supabase no existe equipo
     * para este usuario en esta liga, estamos creando
     * el equipo inicial.
     */
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
        const estado =
          await obtenerEstadoMercado();

        if (!estado) return;

        setEstadoMercado(estado);

        setMercadoAbierto(
          estado.mercadoAbierto
        );

        setDiasRestantes(
          estado.diasRestantes
        );
      } catch (error) {
        console.error(
          "Error cargando estado del mercado:",
          error
        );
      }
    }

    cargarMercado();
  }, []);

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
  // PERMISOS
  // =====================================================

  const puedeCambiarPilotos = () => {
    /*
     * Mientras todavía estamos determinando el estado
     * del equipo, bloqueamos temporalmente.
     */
    if (creandoEquipoInicial === null) {
      return false;
    }

    /*
     * CREACIÓN INICIAL
     *
     * Aquí no existe límite de cambios.
     */
    if (creandoEquipoInicial) {
      return true;
    }

    /*
     * EQUIPO YA CREADO
     */

    if (!mercadoAbierto) {
      return false;
    }

    const limite =
      estadoMercado?.cambiosPilotos ?? 0;

    const realizados =
      equipoActual.cambiosPilotos ?? 0;

    return realizados < limite;
  };

  const puedeCambiarReserva = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    /*
     * CREACIÓN INICIAL
     */
    if (creandoEquipoInicial) {
      return true;
    }

    /*
     * EQUIPO YA CREADO
     */

    if (!mercadoAbierto) {
      return false;
    }

    if (
      !estadoMercado?.cambiarReserva
    ) {
      return false;
    }

    if (
      equipoActual.reservaModificada &&
      !estadoMercado?.reservaConsumible
    ) {
      return false;
    }

    return true;
  };

  const puedeCambiarConstructor = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    /*
     * CREACIÓN INICIAL
     */
    if (creandoEquipoInicial) {
      return true;
    }

    /*
     * EQUIPO YA CREADO
     */

    if (!mercadoAbierto) {
      return false;
    }

    if (
      !estadoMercado?.cambiarConstructor
    ) {
      return false;
    }

    /*
     * Una modificación de constructor por ventana.
     */
    if (
      equipoActual.constructorModificado
    ) {
      return false;
    }

    return true;
  };

  const puedeCambiarPredicciones = () => {
    if (creandoEquipoInicial === null) {
      return false;
    }

    /*
     * CREACIÓN INICIAL
     */
    if (creandoEquipoInicial) {
      return true;
    }

    /*
     * EQUIPO YA CREADO
     */

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

  const manejarFichaje = (
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

      /*
       * CREACIÓN INICIAL
       *
       * Se puede reorganizar libremente.
       */
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

      /*
       * EQUIPO YA CREADO
       *
       * Quitar un piloto inicia una sustitución.
       */
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

    /*
     * Presupuesto.
     */
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

      if (!puedeCambiarPilotos()) {
        return;
      }

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

      setEquipos((prev) => ({
        ...prev,

        [jugadorActual]: {
          ...prev[jugadorActual],

          cambiosPilotos:
            (prev[jugadorActual]
              ?.cambiosPilotos ?? 0) +
            1,
        },
      }));

      setPilotoPendienteCambio(
        null
      );

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

  const manejarReserva = (
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

    setReserva(
      piloto.nombre
    );

    /*
     * Solo afecta a la ventana cuando
     * el equipo ya estaba creado.
     */
    if (!creandoEquipoInicial) {
      setEquipos((prev) => ({
        ...prev,

        [jugadorActual]: {
          ...prev[jugadorActual],

          reservaModificada:
            true,
        },
      }));
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
          onSeleccionar={(
            constructor
          ) => {
            if (
              !puedeCambiarConstructor()
            ) {
              return;
            }

            /*
             * Durante la creación inicial
             * podemos seleccionar libremente.
             *
             * En una ventana posterior,
             * solo permitimos una modificación.
             */
            setMotor(
              constructor.nombre
            );

            if (!creandoEquipoInicial) {
              setEquipos((prev) => ({
                ...prev,

                [jugadorActual]: {
                  ...prev[jugadorActual],

                  constructorModificado:
                    true,
                },
              }));
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
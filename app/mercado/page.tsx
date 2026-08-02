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
  } = useFantasy();

  const equipoActual =
    equipos[jugadorActual] || {
      fichados: [],
      reserva: null,
      motor: null,

      prediccionPiloto: null,
      prediccionMotor: null,

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

  const [
    mercadoAbierto,
    setMercadoAbierto,
  ] = useState(false);

  const [
    diasRestantes,
    setDiasRestantes,
  ] = useState<number | null>(null);

  const [
    estadoMercado,
    setEstadoMercado,
  ] = useState<any>(null);

  useEffect(() => {
    async function cargarMercado() {
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
    }

    cargarMercado();
  }, []);

  const setFichados = (
    nuevosFichados: string[]
  ) => {
    const nuevosEquipos = {
      ...equipos,

      [jugadorActual]: {
        ...equipos[jugadorActual],
        fichados: nuevosFichados,
      },
    };

    setEquipos(nuevosEquipos);
  };

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

  const setPrediccionPiloto = (
    piloto: string
  ) => {
    setEquipos((prev) => ({
      ...prev,

      [jugadorActual]: {
        ...prev[jugadorActual],

        prediccionPiloto: piloto,

        prediccionPilotoOriginal:
          prev[jugadorActual]
            ?.prediccionPilotoOriginal ||
          piloto,

        prediccionPilotoModificada:
          prev[jugadorActual]
            ?.prediccionPilotoOriginal &&
          prev[jugadorActual]
            ?.prediccionPilotoOriginal !==
            piloto
            ? true
            : prev[jugadorActual]
                ?.prediccionPilotoModificada ||
              false,
      },
    }));
  };

  const setPrediccionMotor = (
    marca: string
  ) => {
    setEquipos((prev) => ({
      ...prev,

      [jugadorActual]: {
        ...prev[jugadorActual],

        prediccionMotor: marca,

        prediccionMotorOriginal:
          prev[jugadorActual]
            ?.prediccionMotorOriginal ||
          marca,

        prediccionMotorModificada:
          prev[jugadorActual]
            ?.prediccionMotorOriginal &&
          prev[jugadorActual]
            ?.prediccionMotorOriginal !==
            marca
            ? true
            : prev[jugadorActual]
                ?.prediccionMotorModificada ||
              false,
      },
    }));
  };

  const equipo = pilotos.filter(
    (piloto) =>
      fichados.includes(piloto.nombre)
  );

  const motorSeleccionado =
    motores.find(
      (m) => m.nombre === motor
    );

  const precioMotor =
    motorSeleccionado?.precio || 0;

  const presupuestoUsado =
    equipo.reduce(
      (total, piloto) =>
        total + piloto.precio,
      0
    ) + precioMotor;

  const presupuestoRestante =
    172 - presupuestoUsado;

  const puedeCambiarConstructor =
    () => {
      if (!mercadoAbierto)
        return false;

      if (
        !estadoMercado?.cambiarConstructor
      )
        return false;

      if (
        equipoActual.constructorModificado
      )
        return false;

      return true;
    };

  const puedeCambiarReserva =
    () => {
      if (!mercadoAbierto)
        return false;

      if (
        !estadoMercado?.cambiarReserva
      )
        return false;

      if (
        equipoActual.reservaModificada &&
        !estadoMercado?.reservaConsumible
      ) {
        return false;
      }

      return true;
    };

  const puedeCambiarPredicciones =
    () => {
      if (!mercadoAbierto)
        return false;

      if (
        !estadoMercado?.cambiarPredicciones
      )
        return false;

      return true;
    };

  const puedeCambiarPilotos =
    () => {
      if (!mercadoAbierto)
        return false;

      if (
        (equipoActual.cambiosPilotos ??
          0) >=
        (estadoMercado?.cambiosPilotos ??
          0)
      ) {
        return false;
      }

      return true;
    };

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
        mercadoAbierto={puedeCambiarPilotos()}
        onFichar={(piloto) => {
          const fichado =
            fichados.includes(
              piloto.nombre
            );

          if (fichado) {
            setFichados(
              fichados.filter(
                (nombre) =>
                  nombre !==
                  piloto.nombre
              )
            );

            return;
          }

          if (
            fichados.length >= 6 ||
            presupuestoUsado +
              piloto.precio >
              172
          ) {
            return;
          }

          setFichados([
            ...fichados,
            piloto.nombre,
          ]);
        }}
        onReserva={(piloto) => {
          if (
            !puedeCambiarReserva()
          )
            return;

          setReserva(
            piloto.nombre
          );
        }}
      />
<div className="mt-16">
  <ConstructorsMarket
    constructores={motores}
    constructorSeleccionado={motor}
    mercadoAbierto={puedeCambiarConstructor()}
    onSeleccionar={(constructor) => {
      setMotor(constructor.nombre);

      setEquipos((prev) => ({
        ...prev,
        [jugadorActual]: {
          ...prev[jugadorActual],
          constructorModificado: true,
        },
      }));
    }}
  />
</div>

      <SeasonPredictions
        pilotos={pilotos}
        constructores={
          motores
        }
        prediccionPiloto={
          prediccionPiloto
        }
        prediccionConstructor={
          prediccionMotor
        }
        puedeCambiarPredicciones={puedeCambiarPredicciones()}
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
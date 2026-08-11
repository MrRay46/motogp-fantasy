"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { circuitos } from "@/data/circuitos";

import StatCard from "./StatCard";

type GranPremio = {
  id: number;
  codigo: string;
  nombre: string;
  temporada: number;
  orden: number;
  estado: string;
  fantasy_procesado: boolean;
};

type Circuito = {
  id: string;
  nombre: string;
  pais: string;
  fechaInicio: string;
  fechaFin: string;
  imagen: string;
};

export default function NextGPCard() {
  const [gp, setGp] = useState<GranPremio | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarGranPremio();
  }, []);

  async function cargarGranPremio() {
    try {
      setCargando(true);

      // -----------------------------------------
      // BUSCAR PRIMER GP NO PROCESADO
      // -----------------------------------------

      const { data, error } = await supabase
        .from("grandes_premios")
        .select(`
          id,
          codigo,
          nombre,
          temporada,
          orden,
          estado,
          fantasy_procesado
        `)
        .eq("temporada", 2026)
        .eq("fantasy_procesado", false)
        .order("orden", {
          ascending: true,
        })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error(
          "Error cargando próximo GP:",
          error
        );

        setGp(null);
        return;
      }

      setGp(data);
    } catch (error) {
      console.error(
        "Error inesperado cargando próximo GP:",
        error
      );

      setGp(null);
    } finally {
      setCargando(false);
    }
  }

  // -----------------------------------------
  // CARGANDO
  // -----------------------------------------

  if (cargando) {
    return (
      <StatCard title="🏁 Próximo GP">
        <div className="text-center py-8">
          <p className="text-zinc-400">
            Cargando...
          </p>
        </div>
      </StatCard>
    );
  }

  // -----------------------------------------
  // NO HAY GP
  // -----------------------------------------

  if (!gp) {
    return (
      <StatCard title="🏁 Próximo GP">
        <div className="text-center py-8">
          <p className="text-zinc-400">
            No hay Grandes Premios pendientes.
          </p>
        </div>
      </StatCard>
    );
  }

  // -----------------------------------------
  // BUSCAR INFORMACIÓN VISUAL DEL CIRCUITO
  // -----------------------------------------

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

  const nombreGP = normalizar(gp.nombre);

  const circuito = circuitos.find(
    (circuito) => {
      const nombreCircuito =
        normalizar(circuito.nombre);

      return (
        nombreCircuito === nombreGP ||
        nombreGP.includes(nombreCircuito) ||
        nombreCircuito.includes(nombreGP)
      );
    }
  ) as Circuito | undefined;

  // -----------------------------------------
  // DATOS VISUALES
  // -----------------------------------------

  const nombre =
    circuito?.nombre ?? gp.nombre;

  const pais =
    circuito?.pais ?? "";

  const imagen =
    circuito?.imagen ?? "";

  const fecha =
    circuito?.fechaInicio
      ? new Date(circuito.fechaInicio)
      : null;

  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  // -----------------------------------------
  // ESTADO DEL GP
  // -----------------------------------------

  const estaEnCurso =
    gp.estado === "en_curso";

  const estaFinalizadoPendiente =
    gp.estado === "finalizado" &&
    !gp.fantasy_procesado;

  return (
    <StatCard
      title={
        estaEnCurso
          ? `🏁 ${nombre}`
          : "🏁 Próximo GP"
      }
    >
      <div className="text-center">

        {/* IMAGEN */}

        {imagen && (
          <img
            src={imagen}
            alt={nombre}
            className="w-40 mx-auto mb-6"
          />
        )}

        {/* NOMBRE */}

        {!estaEnCurso && (
          <h3 className="text-3xl font-bold">
            {nombre}
          </h3>
        )}

        {estaEnCurso && (
          <h3 className="text-3xl font-bold">
            {nombre}
          </h3>
        )}

        {/* PAÍS */}

        {pais && (
          <p className="text-zinc-400 mt-2">
            {pais}
          </p>
        )}

        {/* ESTADO */}

        {estaEnCurso && (
          <p className="text-green-400 mt-3 font-semibold">
            🟢 En curso
          </p>
        )}

        {estaFinalizadoPendiente && (
          <p className="text-orange-400 mt-3 font-semibold">
            🟠 Pendiente de procesar
          </p>
        )}

        {!estaEnCurso &&
          !estaFinalizadoPendiente &&
          fecha && (
            <p className="text-orange-400 mt-3">
              {fecha.getDate()}{" "}
              {meses[fecha.getMonth()]}
            </p>
          )}

      </div>
    </StatCard>
  );
}
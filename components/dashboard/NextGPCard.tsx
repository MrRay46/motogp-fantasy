"use client";

import StatCard from "./StatCard";
import { circuitos } from "@/data/circuitos";

export default function NextGPCard() {

  const hoy = new Date();

  let gpActual = null;
  let proximoGP = null;

  for (const gp of circuitos) {

    const inicio = new Date(gp.fechaInicio);
    const fin = new Date(gp.fechaFin);

    if (hoy >= inicio && hoy <= fin) {
      gpActual = gp;
      break;
    }

    if (!proximoGP && hoy < inicio) {
      proximoGP = gp;
    }

  }

  const gp = gpActual || proximoGP || circuitos[0];

  const fecha = new Date(gp.fechaInicio);

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

  return (

    <StatCard
      title={
        gpActual
          ? `🏁 ${gp.nombre}`
          : "🏁 Próximo GP"
      }
    >

      <div className="text-center">

        <img
          src={gp.imagen}
          alt={gp.nombre}
          className="w-40 mx-auto mb-6"
        />


        {!gpActual && (
          <h3 className="text-3xl font-bold">
            {gp.nombre}
          </h3>
        )}

        <p className="text-zinc-400 mt-2">
          {gp.pais}
        </p>

        {gpActual ? (

          <p className="text-green-400 mt-2 font-semibold">
            En curso
          </p>

        ) : (

          <p className="text-orange-400 mt-2">
            {fecha.getDate()} {meses[fecha.getMonth()]}
          </p>

        )}

      </div>

    </StatCard>

  );

}
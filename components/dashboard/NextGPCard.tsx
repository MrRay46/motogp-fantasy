"use client";

import StatCard from "./StatCard";
import { circuitos } from "@/data/circuitos";

export default function NextGPCard() {
  const hoy = new Date();

  const proximoGP =
    circuitos.find(
      (gp) => new Date(gp.fechaInicio) > hoy
    ) || circuitos[0];

  const fecha = new Date(proximoGP.fechaInicio);

  const dia = fecha.getDate();

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
    <StatCard title="🏁 Próximo GP">

      <div className="text-center">

        <img
          src={proximoGP.imagen}
          alt={proximoGP.nombre}
          className="w-40 mx-auto mb-6"
        />

        <h3 className="text-3xl font-bold">
          {proximoGP.nombre}
        </h3>

        <p className="text-zinc-400 mt-2">
          {proximoGP.pais}
        </p>

        <p className="text-orange-400 mt-1">
          {dia} {meses[fecha.getMonth()]}
        </p>

      </div>

    </StatCard>
  );
}
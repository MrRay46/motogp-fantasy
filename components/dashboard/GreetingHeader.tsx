"use client";

import { useEffect, useState } from "react";

export default function GreetingHeader() {

  const [usuario, setUsuario] = useState("");
  const [saludo, setSaludo] = useState("");

  useEffect(() => {

    const sesion = JSON.parse(
  localStorage.getItem("usuario") || "{}"
);

setUsuario(sesion.usuario || "");

    const hora = new Date().getHours();

    if (hora < 12) {

      setSaludo("🌅 Buenos días,");

    } else if (hora < 20) {

      setSaludo("☀️ Buenas tardes,");

    } else {

      setSaludo("🌙 Buenas noches,");

    }

  }, []);

  return (

    <section className="mb-12">

      <p className="text-zinc-400 text-lg">
        {saludo}
      </p>

      <h1 className="text-5xl md:text-6xl font-black mt-2">
        {usuario}
      </h1>

    </section>

  );

}
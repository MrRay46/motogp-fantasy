"use client";

export default function GreetingHeader({

  nombre,

}:{

  nombre:string;

}) {

  const hora = new Date().getHours();

  let saludo = "Buenas noches";

  if (hora >= 6 && hora < 12)
    saludo = "Buenos días";

  else if (hora >= 12 && hora < 21)
    saludo = "Buenas tardes";

  return (

    <div className="mb-10">

      <p className="text-zinc-400 text-lg">

        👋 {saludo}

      </p>

      <h1 className="text-4xl font-black mt-2">

        {nombre}

      </h1>

    </div>

  );

}
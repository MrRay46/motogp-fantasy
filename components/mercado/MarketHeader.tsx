type MarketHeaderProps = {

  titulo?: string;

  descripcion?: string;

};



export default function MarketHeader ({

  titulo = "Mercado",

  descripcion = "Gestiona tu equipo, realiza fichajes, cambia el constructor y actualiza tus predicciones cuando el mercado esté abierto.",

}: MarketHeaderProps) {

  return (

    <header className="mb-10">

      <h1 className="text-5xl font-bold text-red-500">

        {titulo}

      </h1>



      <p className="mt-3 max-w-3xl text-lg text-zinc-400">

        {descripcion}

      </p>

    </header>

  );

}
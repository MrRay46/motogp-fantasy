import Image from "next/image";

export default function ComoJugarPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-10">

      <h1 className="text-5xl font-bold mb-4">Cómo jugar</h1>

      <p className="text-zinc-300 text-lg leading-8 mb-16">
        Conoce las principales funciones de RayonGrid y descubre dónde encontrar
        cada opción de la aplicación.
      </p>

      <h2 className="text-3xl font-bold mt-16 mb-4">Inicio</h2>

      <p className="text-zinc-300 leading-7 mb-8">
        La pantalla <strong>Inicio</strong> reúne de un vistazo la información
        más importante de tu liga. Desde aquí podrás consultar tu rendimiento,
        el resultado del último Gran Premio, el siguiente circuito del calendario
        y las noticias más recientes del Paddock.
      </p>

      <Image
        src="/capturas/inicio-tarjetas.png"
        alt="Pantalla de inicio"
        width={1400}
        height={800}
        className="w-full rounded-2xl border border-zinc-700/40 mb-8"
      />

      <div className="grid md:grid-cols-2 gap-6 mb-16">
        <div>
          <h4 className="font-semibold text-lg mb-2">① Tu rendimiento</h4>
          <p className="text-zinc-400">
            Muestra tu posición actual en la clasificación Fantasy, los puntos
            acumulados y la diferencia respecto al líder de la liga.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">② Ganador del GP</h4>
          <p className="text-zinc-400">
            Indica qué jugador consiguió más puntos en el último Gran Premio
            disputado.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">③ Próximo GP</h4>
          <p className="text-zinc-400">
            Muestra el siguiente circuito del calendario junto con la fecha en la
            que se celebrará el Gran Premio.
          </p>
        </div>
      </div>

      <Image
        src="/capturas/inicio-paddock.png"
        alt="Paddock"
        width={1400}
        height={800}
        className="w-full rounded-2xl border border-zinc-700/40 mb-8"
      />

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-lg mb-2">① Paddock</h4>
          <p className="text-zinc-400">
            Recoge las noticias más relevantes de MotoGP para que estés informado
            de todo lo que ocurre durante la temporada.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-2">② Tipo de noticia</h4>
          <p className="text-zinc-400">
            Cada noticia incluye una categoría que permite identificar rápidamente
            su contenido, como mercado, MotoGP o lesiones.
          </p>
        </div>
      </div>

    </main>
  );
}
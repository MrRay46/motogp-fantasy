"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ComoJugarPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold text-red-500 mb-4">
          📖 Cómo jugar
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-20">
          Conoce las principales funciones de RayonGrid y descubre dónde encontrar
          cada opción de la aplicación.
        </p>

        <h2 className="text-3xl font-bold mb-4">
          🏠 Inicio
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          La pantalla <strong>Inicio</strong> reúne la información más importante
          de tu liga. Desde aquí podrás consultar tu situación en la clasificación
          Fantasy, el resultado del último Gran Premio, el próximo evento del
          calendario y las noticias más recientes del Paddock.
        </p>

        <Image
          src="/capturas/inicio-tarjetas.png"
          alt="Pantalla de inicio"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Tu rendimiento
            </h3>

            <p className="text-zinc-400">
              Consulta tu posición en la clasificación Fantasy, los puntos
              acumulados y la diferencia respecto al líder de la liga.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Ganador del GP
            </h3>

            <p className="text-zinc-400">
              Muestra el jugador que obtuvo la mayor puntuación en el último Gran
              Premio.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ③ Próximo GP
            </h3>

            <p className="text-zinc-400">
              Indica el siguiente Gran Premio del calendario junto con la fecha en
              la que se disputará.
            </p>
          </div>
        </div>

        <Image
          src="/capturas/inicio-paddock.png"
          alt="Paddock"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Paddock
            </h3>

            <p className="text-zinc-400">
              Consulta las noticias más importantes relacionadas con MotoGP y
              mantente al día de todo lo que ocurre durante la temporada.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Tipo de noticia
            </h3>

            <p className="text-zinc-400">
              Cada noticia muestra una categoría que permite identificar
              rápidamente su contenido, como <strong>MotoGP</strong>,
              <strong> Mercado</strong> o <strong>Lesiones</strong>.
            </p>
          </div>
        </div>
<h2 className="text-3xl font-bold mt-20 mb-4">
  👥 Equipo
</h2>

<p className="text-zinc-300 leading-7 mb-8">
  En la pantalla <strong>Equipo</strong> podrás consultar la composición de tu
  plantilla, el motor seleccionado, las predicciones de temporada y toda la
  información relacionada con tu equipo Fantasy.
</p>

<Image
  src="/capturas/equipo-plantilla.png"
  alt="Plantilla del equipo"
  width={1400}
  height={800}
  className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
/>

<div className="grid md:grid-cols-2 gap-6 mb-16">
  <div>
    <h3 className="text-xl font-bold mb-2">
      ① Puntos GP
    </h3>

    <p className="text-zinc-400">
      Muestra los puntos obtenidos por tu equipo durante el último Gran Premio.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ② Puntos Totales
    </h3>

    <p className="text-zinc-400">
      Indica los puntos acumulados a lo largo de toda la temporada.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ③ Equipo
    </h3>

    <p className="text-zinc-400">
      Aquí se muestran los cinco pilotos titulares que forman tu equipo para cada
      Gran Premio.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ④ Suplente
    </h3>

    <p className="text-zinc-400">
      El piloto reserva aparece resaltado con un borde naranja para diferenciarlo
      del resto de titulares.
    </p>
  </div>
</div>

<Image
  src="/capturas/equipo-predicciones.png"
  alt="Motor y predicciones"
  width={1400}
  height={800}
  className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
/>

<div className="grid md:grid-cols-2 gap-6">
  <div>
    <h3 className="text-xl font-bold mb-2">
      ① Motor
    </h3>

    <p className="text-zinc-400">
      Muestra el constructor seleccionado para tu equipo Fantasy.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ② Constructor
    </h3>

    <p className="text-zinc-400">
      Indica el fabricante elegido que sumará puntos durante la temporada según
      el reglamento.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ③ Predicciones
    </h3>

    <p className="text-zinc-400">
      Agrupa las predicciones de temporada realizadas antes del inicio del campeonato.
    </p>
  </div>

  <div>
    <h3 className="text-xl font-bold mb-2">
      ④ Predicciones seleccionadas
    </h3>

    <p className="text-zinc-400">
      Muestra el piloto campeón y el constructor campeón que has elegido como
      predicción para la temporada.
    </p>
  </div>
</div>

      </div>
    </main>
  );
}


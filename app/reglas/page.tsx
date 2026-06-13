"use client";

import Navbar from "@/components/Navbar";

export default function ReglasPage() {
  return (
    <main className="min-h-screen bg-black text-white p-8">
      <Navbar />

      <h1 className="text-5xl font-bold text-red-500 mb-10">
        📜 Reglamento MotoGP Fantasy
      </h1>

      <div className="space-y-6">

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            💰 Presupuesto
          </h2>

          <p>
            Cada equipo dispone de un presupuesto máximo de <strong>172 M</strong>.
          </p>

          <p className="mt-3">
            No se podrán realizar fichajes que superen dicho límite.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            🏍️ Composición del equipo
          </h2>

          <p>
            Cada jugador deberá seleccionar:
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>5 pilotos titulares.</li>
            <li>1 piloto reserva.</li>
            <li>1 constructor (motor).</li>
          </ul>

          <p className="mt-4">
            Solo los 5 pilotos titulares puntúan cada Gran Premio.
          </p>

          <p className="mt-3">
            El piloto reserva únicamente sumará puntos si uno de los titulares obtiene 0 puntos durante ese Gran Premio.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            🔄 Mercado
          </h2>

          <p>
            Los cambios de pilotos, piloto reserva, constructor y predicciones solo podrán realizarse durante las ventanas oficiales de mercado.
          </p>

          <p className="mt-3">
            Fuera de dichas ventanas el equipo permanecerá bloqueado.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            📅 Ventanas de Mercado
          </h2>

          <h3 className="text-xl font-bold mb-2">
            Primera ventana
          </h3>

          <p>
            Permite crear el equipo inicial para disputar la temporada.
          </p>

          <h3 className="text-xl font-bold mt-6 mb-2">
            Segunda ventana
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            <li>Hasta 2 pilotos titulares.</li>
            <li>Piloto reserva.</li>
            <li>Constructor.</li>
            <li>Predicciones de temporada.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-2">
            Tercera ventana
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            <li>Hasta 2 pilotos.</li>
            <li>Pueden ser 2 titulares o 1 titular y el piloto reserva.</li>
          </ul>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
  <h2 className="text-3xl font-bold mb-4">
    ⭐ Sistema de puntuación
  </h2>

  <p>
    La puntuación fantasy de cada Gran Premio será la suma de:
  </p>

  <ul className="list-disc ml-6 mt-3 space-y-2">
    <li>Los puntos obtenidos por los 5 pilotos titulares.</li>
    <li>Los puntos del piloto reserva si sustituyen a los del titular si el titular acaba al final del Gran Premio con 0 puntos.
      ejemplo: si un piloto titular consigue 0 puntos en la carrera al sprint y 0 puntos en la carrera del domingo, si el piloto reserva consigue puntos a lo largo del fin de semana si se sumarian, pero si tu piloto titular consigue al menos 1 punto al finalizar el GP al haber puntuado en el fin de semana, los puntos conseguidos por el piloto reserversa aunque sean mas no sumarian.
    </li>
    <li>Los puntos obtenidos por el constructor seleccionado.</li>
  </ul>

  <p className="mt-4">
    Los pilotos sumarán exactamente los mismos puntos obtenidos durante el fin de semana oficial de MotoGP, incluyendo Sprint y Gran Premio.
  </p>

  <h3 className="text-xl font-bold mt-6 mb-3">
    🏁 Puntuación Sprint
  </h3>

  <div className="space-y-1">
    <p>1º → 12 pts</p>
    <p>2º → 9 pts</p>
    <p>3º → 7 pts</p>
    <p>4º → 6 pts</p>
    <p>5º → 5 pts</p>
    <p>6º → 4 pts</p>
    <p>7º → 3 pts</p>
    <p>8º → 2 pts</p>
    <p>9º → 1 pt</p>
  </div>

  <h3 className="text-xl font-bold mt-6 mb-3">
    🏆 Puntuación Gran Premio
  </h3>

  <div className="space-y-1">
    <p>1º → 25 pts</p>
    <p>2º → 20 pts</p>
    <p>3º → 16 pts</p>
    <p>4º → 13 pts</p>
    <p>5º → 11 pts</p>
    <p>6º → 10 pts</p>
    <p>7º → 9 pts</p>
    <p>8º → 8 pts</p>
    <p>9º → 7 pts</p>
    <p>10º → 6 pts</p>
    <p>11º → 5 pts</p>
    <p>12º → 4 pts</p>
    <p>13º → 3 pts</p>
    <p>14º → 2 pts</p>
    <p>15º → 1 pt</p>
  </div>

  <h3 className="text-xl font-bold mt-6 mb-3">
    🏍️ Puntuación de Constructores
  </h3>

  <p>
    Los constructores puntúan únicamente según el resultado de la carrera principal del domingo.
  </p>

  <p className="mt-3">
    Solo se tendrá en cuenta la mejor moto clasificada de cada marca.
  </p>

  <p className="mt-3">
    Si varias motos de una misma marca ocupan posiciones consecutivas, únicamente puntuará la primera de ellas.
  </p>

  <h4 className="text-lg font-bold mt-6 mb-3">
    Ejemplo
  </h4>

  <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4 mb-4">
    <p>Clasificación GP</p>

    <div className="mt-3 space-y-1">
      <p>1º (Ducati)</p>
      <p>2º (Ducati)</p>
      <p>3º (Aprilia)</p>
      <p>4º (Aprilia)</p>
      <p>5º (Yamaha)</p>
      <p>6º (KTM)</p>
      <p>7º (Honda)</p>
    </div>
  </div>

  <p className="mb-3">
    El sistema asignará:
  </p>

  <div className="bg-black/40 border border-zinc-700 rounded-2xl p-4">
    <div className="space-y-1">
      <p>Ducati = 10 pts</p>
      <p>Aprilia = 8 pts</p>
      <p>Yamaha = 6 pts</p>
      <p>KTM = 4 pts</p>
      <p>Honda = 2 pts</p>
    </div>
  </div>

  <div className="mt-6 space-y-1">
    <p>1º constructor → 10 pts</p>
    <p>2º constructor → 8 pts</p>
    <p>3º constructor → 6 pts</p>
    <p>4º constructor → 4 pts</p>
    <p>5º constructor → 2 pts</p>
  </div>

  <p className="mt-6">
    La clasificación general se calculará acumulando todos los puntos obtenidos durante la temporada.
  </p>
</section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            🎯 Predicciones
          </h2>

          <p>
            Antes del inicio de la temporada cada jugador deberá seleccionar:
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Piloto campeón del mundo.</li>
            <li>Constructor campeón del mundo.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-2">
            Bonus por acertar el campeón
          </h3>

          <ul className="list-disc ml-6 space-y-2">
            <li>Piloto campeón acertado: +37 puntos.</li>
            <li>Constructor campeón acertado: +10 puntos.</li>
          </ul>

          <h3 className="text-xl font-bold mt-6 mb-2">
            Modificación de predicciones
          </h3>

          <p>
            Las predicciones podrán modificarse únicamente durante la primera ventana de cambios.
          </p>

          <p className="mt-3">
            Cambiar una predicción reducirá la bonificación final obtenida por acertarla.
          </p>

          <ul className="list-disc ml-6 mt-3 space-y-2">
            <li>Predicción original acertada del piloto campeón: +37 puntos.</li>
            <li>Predicción modificada acertada del piloto campeón: +18,5 puntos.</li>
            <li>Predicción original acertada del constructor campeón: +10 puntos.</li>
            <li>Predicción modificada acertada del constructor campeón: +5 puntos.</li>
            <p className="mt-4">
  Las bonificaciones de predicción serán aplicadas por el administrador una única vez al finalizar la temporada.
</p>
          </ul>
        </section>
<section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
  <h2 className="text-3xl font-bold mb-4">
    👑 Administrador
  </h2>

  <p>
    La competición contará con un administrador responsable de la gestión general del MotoGP Fantasy.
  </p>

  <h3 className="text-xl font-bold mt-6 mb-2">
    Funciones del administrador
  </h3>

  <ul className="list-disc ml-6 space-y-2">
    <li>Aplicar las bonificaciones de predicción al finalizar la temporada.</li>
    <li>Resolver incidencias relacionadas con la competición.</li>
    <li>Verificar el correcto funcionamiento de la aplicación y de las clasificaciones.</li>
  </ul>

  <p className="mt-4">
    Las herramientas de administración son exclusivas del administrador y no estarán disponibles para el resto de participantes.
  </p>

  <p className="mt-3">
    Las decisiones adoptadas por el administrador para resolver incidencias serán definitivas.
  </p>
</section>
        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            🏆 Clasificación final
          </h2>

          <p>
            El campeón del MotoGP Fantasy será el jugador que finalice la temporada con más puntos acumulados.
          </p>
        </section>

        <section className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-3xl font-bold mb-4">
            ⚠️ Disposiciones generales
          </h2>

          <p>
            La organización se reserva el derecho de resolver cualquier situación no contemplada en este reglamento.
          </p>

          <p className="mt-3">
            Las decisiones de la organización serán definitivas e inapelables.
          </p>
        </section>

      </div>
    </main>
  );
}
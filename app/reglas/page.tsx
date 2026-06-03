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
            <li>Los puntos del piloto reserva si sustituye a un titular con 0 puntos.</li>
            <li>Los puntos obtenidos por el constructor seleccionado.</li>
          </ul>

          <p className="mt-4">
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
          </ul>
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
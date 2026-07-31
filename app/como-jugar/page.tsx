"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function ComoJugarPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h1 className="text-5xl font-bold text-red-500 mb-4">
          Cómo jugar
        </h1>

        <p className="text-zinc-300 text-lg leading-8 mb-20">
          Conoce las principales funciones de RayonGrid y descubre dónde encontrar
          cada opción de la aplicación.
        </p>

        {/* ===================================================== */}
        {/* INICIO */}
        {/* ===================================================== */}

        <h2 className="text-3xl font-bold mb-4">
          Inicio
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

        <div className="grid md:grid-cols-2 gap-6 mb-20">
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
              <strong> Mercado</strong> o <strong> Lesiones</strong>.
            </p>
          </div>
        </div>

        {/* ===================================================== */}
        {/* EQUIPO */}
        {/* ===================================================== */}

        <h2 className="text-3xl font-bold mb-4">
          Equipo
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          En la pantalla <strong>Equipo</strong> podrás consultar la composición
          de tu plantilla, el motor seleccionado, las predicciones de temporada y
          toda la información relacionada con tu equipo Fantasy.
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
              Muestra los puntos obtenidos por tu equipo durante el último Gran
              Premio.
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
              Aquí se muestran los cinco pilotos titulares que forman tu equipo
              para cada Gran Premio.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ④ Suplente
            </h3>

            <p className="text-zinc-400">
              El piloto reserva aparece resaltado con un borde naranja para
              diferenciarlo del resto de titulares.
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

        <div className="grid md:grid-cols-2 gap-6 mb-20">
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
              Indica el fabricante elegido que sumará puntos durante la temporada
              según el reglamento.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ③ Predicciones
            </h3>

            <p className="text-zinc-400">
              Agrupa las predicciones de temporada realizadas antes del inicio del
              campeonato.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ④ Predicciones seleccionadas
            </h3>

            <p className="text-zinc-400">
              Muestra el piloto campeón y el constructor campeón elegidos para la
              temporada.
            </p>
          </div>
        </div>
                {/* ===================================================== */}
        {/* MERCADO */}
        {/* ===================================================== */}

        <h2 className="text-3xl font-bold mb-4">
          Mercado
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          Desde la pantalla <strong>Mercado</strong> podrás gestionar tu equipo
          durante las ventanas oficiales de fichajes. Aquí podrás incorporar o
          eliminar pilotos, seleccionar el piloto reserva, elegir el constructor
          y realizar tus predicciones para la temporada.
        </p>

        <Image
          src="/capturas/mercado-listado.png"
          alt="Mercado de pilotos"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Mercado
            </h3>

            <p className="text-zinc-400">
              Muestra todos los pilotos disponibles para formar o modificar tu
              equipo Fantasy.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Estado del mercado
            </h3>

            <p className="text-zinc-400">
              Indica si el mercado se encuentra abierto o cerrado y, por tanto,
              si es posible realizar cambios en el equipo.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ③ Presupuesto restante
            </h3>

            <p className="text-zinc-400">
              Muestra el presupuesto disponible para realizar nuevos fichajes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ④ Acciones
            </h3>

            <p className="text-zinc-400">
              Permite fichar, quitar o convertir un piloto en suplente según la
              situación de tu equipo.
            </p>
          </div>
        </div>

        <Image
          src="/capturas/mercado-predicciones.png"
          alt="Motores y predicciones"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Motores
            </h3>

            <p className="text-zinc-400">
              Selecciona el constructor que formará parte de tu equipo Fantasy.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Predicciones de temporada
            </h3>

            <p className="text-zinc-400">
              Elige el piloto campeón del mundo y el constructor campeón antes del
              inicio de la temporada o durante el periodo permitido por el
              reglamento.
            </p>
          </div>
        </div>
        {/* ===================================================== */}
        {/* LIGA */}
        {/* ===================================================== */}

        <h2 className="text-3xl font-bold mb-4">
          Liga
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          La pantalla <strong>Liga</strong> reúne las diferentes clasificaciones
          de la competición y permite consultar el rendimiento de los
          participantes, pilotos y constructores durante toda la temporada.
        </p>

        <Image
          src="/capturas/liga-clasificacionfantasy.png"
          alt="Clasificación Fantasy"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Clasificación Fantasy
            </h3>

            <p className="text-zinc-400">
              Consulta la clasificación general de la liga y los puntos acumulados
              por cada participante durante la temporada.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Ver equipo rival
            </h3>

            <p className="text-zinc-400">
              Despliega la plantilla completa de cualquier participante para
              consultar su equipo Fantasy.
            </p>
          </div>
        </div>

        <Image
          src="/capturas/liga-clasificacionmotor.png"
          alt="Clasificación de Constructores"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="mb-16">
          <h3 className="text-xl font-bold mb-2">
            ① Clasificación de Constructores
          </h3>

          <p className="text-zinc-400">
            Muestra la clasificación oficial de constructores de MotoGP según los
            puntos obtenidos por cada fabricante durante la temporada.
          </p>
        </div>

        <Image
          src="/capturas/liga-clasificacionpilotos.png"
          alt="Clasificación de Pilotos"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="mb-16">
          <h3 className="text-xl font-bold mb-2">
            ① Clasificación de Pilotos
          </h3>

          <p className="text-zinc-400">
            Permite consultar la clasificación oficial del Campeonato del Mundo de
            MotoGP con los puntos acumulados por cada piloto.
          </p>
        </div>

        <Image
          src="/capturas/liga-ultimosdestacados.png"
          alt="Últimos destacados"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="mb-20">
          <h3 className="text-xl font-bold mb-2">
            ① Últimos destacados
          </h3>

          <p className="text-zinc-400">
            Resume los pilotos más destacados del último Gran Premio, incluyendo
            el ganador de la Sprint, el vencedor de la carrera principal y el
            líder actual del Campeonato del Mundo.
          </p>
        </div>
        {/* ===================================================== */}
        {/* ADMINISTRACIÓN */}
        {/* ===================================================== */}

               <h2 className="text-3xl font-bold mb-4">
          Administración
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          La pantalla <strong>Administración</strong> está disponible únicamente
          para los administradores de la liga y permite gestionar los
          participantes, las invitaciones y las bonificaciones de final de
          temporada.
        </p>

        <Image
          src="/capturas/admin-panel.png"
          alt="Panel de administración"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="grid md:grid-cols-2 gap-6 mb-12">

          <div>
            <h3 className="text-xl font-bold mb-2">
              ① Panel de Administración
            </h3>

            <p className="text-zinc-400">
              Centraliza todas las herramientas necesarias para gestionar la liga
              y sus participantes.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ② Añadir participante
            </h3>

            <p className="text-zinc-400">
              Genera un código de invitación para que nuevos jugadores puedan
              unirse a la liga.
            </p>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-2">
              ③ Gestionar participantes
            </h3>

            <p className="text-zinc-400">
              Permite activar o desactivar la participación de cualquier jugador
              de la liga cuando sea necesario.
            </p>
          </div>

        </div>

        <Image
          src="/capturas/admin-bonificaciones.png"
          alt="Bonificaciones de temporada"
          width={1400}
          height={500}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="mb-20">

          <h3 className="text-xl font-bold mb-2">
            ① Generar bonificaciones
          </h3>

          <p className="text-zinc-400 leading-7">
            Una vez finalizada la temporada, el administrador podrá pulsar este
            botón para aplicar automáticamente las bonificaciones de las
            predicciones acertadas de todos los jugadores.
            Cada bonificación solo puede aplicarse una única vez, evitando que
            los puntos puedan duplicarse por error.
          </p>

        </div>

        {/* ===================================================== */}
        {/* MENÚ LATERAL */}
        {/* ===================================================== */}

        <h2 className="text-3xl font-bold mb-4">
          Menú lateral
        </h2>

        <p className="text-zinc-300 leading-7 mb-8">
          El menú lateral reúne la información de tu perfil, la liga activa y el
          acceso a las diferentes secciones de ayuda de la aplicación.
        </p>

        <Image
          src="/capturas/menu-lateral.png"
          alt="Menú lateral"
          width={1400}
          height={800}
          className="w-full rounded-2xl border border-zinc-700/40 shadow-xl mb-8"
        />

        <div className="mb-20">
          <h3 className="text-xl font-bold mb-2">
            ① Avatar
          </h3>

          <p className="text-zinc-400">
            Pulsa sobre tu avatar para elegir una imagen diferente entre los
            avatares disponibles.
          </p>
        </div>

      </div>
    </main>
  );
}

"use client";

import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Participante {
  id: number;
  usuario: string;
  avatar: string;
  activo: boolean;
}

interface EstadoBonificaciones {
  temporada: number;
  puedeAplicar: boolean;
  mensaje: string;
  totalGP: number;
  totalEquipos: number;
  equiposPendientes: number;
  yaAplicadas: boolean;
}

export default function AdminPage() {
  const [participantes, setParticipantes] =
    useState<Participante[]>([]);

  const [codigoLiga, setCodigoLiga] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [
    procesandoBonificaciones,
    setProcesandoBonificaciones,
  ] = useState(false);

  const [
    estadoBonificaciones,
    setEstadoBonificaciones,
  ] = useState<EstadoBonificaciones | null>(null);

  useEffect(() => {
    void cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        window.location.href = "/login";
        return;
      }

      const respuestaParticipantes = await fetch(
        "/api/admin/participantes",
        {
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
        }
      );

      const resultadoParticipantes =
        await respuestaParticipantes
          .json()
          .catch(() => null);

      if (!respuestaParticipantes.ok) {
        console.error(
          "Error cargando participantes:",
          resultadoParticipantes?.error ??
            respuestaParticipantes.statusText
        );

        setParticipantes([]);
        setCodigoLiga("");
      } else {
        setCodigoLiga(
          resultadoParticipantes.codigo ?? ""
        );

        setParticipantes(
          resultadoParticipantes.participantes ?? []
        );
      }

      const respuestaEstado = await fetch(
        "/api/admin/bonificaciones",
        {
          method: "GET",
          headers: {
            Authorization:
              `Bearer ${session.access_token}`,
          },
          cache: "no-store",
        }
      );

      const resultadoEstado =
        await respuestaEstado
          .json()
          .catch(() => null);

      if (!respuestaEstado.ok) {
        setEstadoBonificaciones({
          temporada: resultadoEstado?.temporada ?? 2026,
          puedeAplicar: false,
          mensaje:
            resultadoEstado?.error ??
            "No se pudo comprobar si las bonificaciones están disponibles.",
          totalGP: 0,
          totalEquipos: 0,
          equiposPendientes: 0,
          yaAplicadas: false,
        });
      } else {
        setEstadoBonificaciones(
          resultadoEstado as EstadoBonificaciones
        );
      }
    } catch (error) {
      console.error(
        "Error cargando datos de administración:",
        error
      );

      setParticipantes([]);
      setCodigoLiga("");

      setEstadoBonificaciones({
        temporada: 2026,
        puedeAplicar: false,
        mensaje:
          "No se pudo verificar el estado de las bonificaciones.",
        totalGP: 0,
        totalEquipos: 0,
        equiposPendientes: 0,
        yaAplicadas: false,
      });
    } finally {
      setLoading(false);
    }
  }

  function generarInvitacion() {
    alert(`Código de la liga: ${codigoLiga}`);
  }

  async function generarBonificaciones() {
    if (!estadoBonificaciones?.puedeAplicar) {
      alert(
        estadoBonificaciones?.mensaje ??
          "Las bonificaciones todavía no están disponibles."
      );
      return;
    }

    const confirmar = window.confirm(
      `¿Aplicar las bonificaciones finales de la temporada ${estadoBonificaciones.temporada} a los equipos de esta liga?\n\n` +
        "Cada equipo solo puede recibirlas una vez."
    );

    if (!confirmar) return;

    try {
      setProcesandoBonificaciones(true);

      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        alert(
          "Tu sesión ha caducado. Inicia sesión de nuevo."
        );

        window.location.href = "/login";
        return;
      }

      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.liga_actual_id) {
        alert("No se ha encontrado la liga activa.");
        return;
      }

      const respuesta = await fetch(
        "/api/admin/bonificaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            liga_id: sesion.liga_actual_id,
          }),
        }
      );

      const resultado =
        await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        alert(
          resultado?.error ??
            "No se pudieron aplicar las bonificaciones."
        );

        await cargarDatos();
        return;
      }

      let mensaje =
        `${resultado.mensaje}\n\n` +
        `Equipos bonificados: ${resultado.equiposProcesados}\n` +
        `Equipos omitidos: ${resultado.equiposOmitidos}`;

      if (resultado.errores?.length > 0) {
        mensaje +=
          "\n\nEquipos con error: " +
          resultado.errores.join(", ");
      }

      alert(mensaje);
      await cargarDatos();
    } catch (error) {
      console.error(
        "Error aplicando las bonificaciones:",
        error
      );

      alert(
        "Error de conexión al aplicar las bonificaciones."
      );
    } finally {
      setProcesandoBonificaciones(false);
    }
  }

  async function cambiarEstado(
    id: number,
    activo: boolean
  ) {
    const confirmar = window.confirm(
      activo
        ? "¿Desactivar este participante?"
        : "¿Activar este participante?"
    );

    if (!confirmar) return;

    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session?.access_token) {
        alert(
          "Tu sesión ha caducado. Inicia sesión de nuevo."
        );

        window.location.href = "/login";
        return;
      }

      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.liga_actual_id) {
        alert("No se ha encontrado la liga activa.");
        return;
      }

      const respuesta = await fetch(
        "/api/admin/participantes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            usuario_id: id,
            liga_id: sesion.liga_actual_id,
            activo: !activo,
          }),
        }
      );

      const resultado =
        await respuesta.json().catch(() => null);

      if (!respuesta.ok) {
        alert(
          resultado?.error ??
            "No se pudo actualizar el usuario."
        );
        return;
      }

      await cargarDatos();
    } catch (error) {
      console.error(
        "Error cambiando el estado del participante:",
        error
      );

      alert(
        "Error de conexión al actualizar el participante."
      );
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-xl">
          Cargando panel de administración...
        </p>
      </main>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h1 className="text-4xl font-black mb-3">
            ⚙️ Panel de Administración
          </h1>

          <p className="text-zinc-400">
            Gestiona los participantes de tu liga.
          </p>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold mb-6">
            ➕ Añadir participante
          </h2>

          <button
            onClick={generarInvitacion}
            className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-xl font-bold transition"
          >
            Generar invitación
          </button>

          <div className="mt-6 bg-zinc-800 rounded-xl p-4">
            <p className="text-zinc-400 text-sm">
              Código de la liga
            </p>

            <p className="text-3xl font-black tracking-widest text-orange-400">
              {codigoLiga}
            </p>
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold mb-6">
            🚫 Gestionar participantes
          </h2>

          <div className="space-y-4">
            {participantes.map((participante) => (
              <div
                key={participante.id}
                className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/avatars/${participante.avatar}`}
                    alt={participante.usuario}
                    className="w-14 h-14 rounded-full border border-zinc-700"
                  />

                  <div>
                    <h3 className="font-bold text-lg">
                      {participante.usuario}
                    </h3>

                    <p
                      className={
                        participante.activo
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {participante.activo
                        ? "Activo"
                        : "Desactivado"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    cambiarEstado(
                      participante.id,
                      participante.activo
                    )
                  }
                  className={
                    participante.activo
                      ? "bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl font-bold transition"
                      : "bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl font-bold transition"
                  }
                >
                  {participante.activo
                    ? "Desactivar"
                    : "Activar"}
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold mb-6">
            🎯 Bonificaciones de temporada
          </h2>

          <p className="text-zinc-400 mb-4">
            Se habilitarán cuando estén configurados los campeones y todos los GP de la temporada {estadoBonificaciones?.temporada ?? 2026} hayan finalizado y sido procesados.
          </p>

          <div className="mb-6 rounded-xl border border-zinc-700 bg-zinc-950 p-4">
            <p
              className={
                estadoBonificaciones?.puedeAplicar
                  ? "text-green-400"
                  : "text-zinc-300"
              }
            >
              {estadoBonificaciones?.mensaje ??
                "Comprobando si las bonificaciones están disponibles..."}
            </p>

            {estadoBonificaciones && (
              <p className="mt-2 text-sm text-zinc-500">
                GP finalizados/procesados:{" "}
                {estadoBonificaciones.totalGP}
                {" · "}
                Equipos pendientes:{" "}
                {estadoBonificaciones.equiposPendientes}
              </p>
            )}
          </div>

          <button
            onClick={generarBonificaciones}
            disabled={
              procesandoBonificaciones ||
              !estadoBonificaciones?.puedeAplicar
            }
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-600 disabled:cursor-not-allowed disabled:opacity-60 px-6 py-3 rounded-xl font-bold transition"
          >
            {procesandoBonificaciones
              ? "Aplicando bonificaciones..."
              : estadoBonificaciones?.yaAplicadas
              ? "Bonificaciones ya aplicadas"
              : "Generar bonificaciones"}
          </button>
        </div>
      </div>
    </AppLayout>
  );
}
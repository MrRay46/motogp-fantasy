
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

export default function AdminPage() {
  const [participantes, setParticipantes] = useState<Participante[]>([]);
  const [codigoLiga, setCodigoLiga] = useState("");
  const [loading, setLoading] = useState(true);
  const [procesandoBonificaciones, setProcesandoBonificaciones] =
    useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);

    const sesion = JSON.parse(
      localStorage.getItem("usuario") || "{}"
    );

    if (!sesion.id) {
      window.location.href = "/login";
      return;
    }

    if (!sesion.liga_actual_id) {
      setLoading(false);
      return;
    }

    // Buscar liga
    const {
      data: liga,
      error: errorLiga,
    } = await supabase
      .from("ligas")
      .select("id,codigo")
      .eq("id", sesion.liga_actual_id)
      .single();

    if (errorLiga || !liga) {
      console.error(errorLiga);
      setLoading(false);
      return;
    }

    setCodigoLiga(liga.codigo);

    // Buscar miembros de esa liga
    const {
      data: relaciones,
      error: errorRelaciones,
    } = await supabase
      .from("usuarios_ligas")
      .select("usuario_id")
      .eq("liga_id", liga.id);

    if (errorRelaciones) {
      console.error(errorRelaciones);
      setLoading(false);
      return;
    }

    const ids = relaciones.map((r) => r.usuario_id);

    if (ids.length === 0) {
      setParticipantes([]);
      setLoading(false);
      return;
    }

    // Buscar datos de los participantes
    const {
      data: usuarios,
      error: errorUsuarios,
    } = await supabase
      .from("usuarios")
      .select("id,usuario,avatar,activo")
      .in("id", ids)
      .order("usuario");

    if (errorUsuarios) {
      console.error(errorUsuarios);
      setLoading(false);
      return;
    }

    setParticipantes(usuarios || []);
    setLoading(false);
  }

  async function generarInvitacion() {
    alert(`Código de la liga: ${codigoLiga}`);
  }

  // Aplicar bonificaciones mediante la API segura
  async function generarBonificaciones() {
    const confirmar = window.confirm(
      "¿Aplicar las bonificaciones finales de la temporada?\n\n" +
        "Esta acción solo debería ejecutarse una vez para esta liga."
    );

    if (!confirmar) return;

    try {
      setProcesandoBonificaciones(true);

      // Comprobar la sesión de Supabase Auth
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert(
          "Tu sesión ha caducado. Inicia sesión de nuevo."
        );

        window.location.href = "/login";
        return;
      }

      // Obtener la liga activa
      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.liga_actual_id) {
        alert("No se ha encontrado la liga activa.");
        return;
      }

      // Enviar la solicitud al servidor
      const response = await fetch(
        "/api/admin/bonificaciones",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            liga_id: sesion.liga_actual_id,
          }),
        }
      );

      const resultado = await response.json();

      if (!response.ok) {
        alert(
          resultado.error ||
            "No se pudieron aplicar las bonificaciones."
        );
        return;
      }

      // Mostrar el resultado del proceso
      if (resultado.equiposProcesados === 0) {
        alert(
          resultado.mensaje ||
            "No había equipos pendientes de bonificación."
        );
      } else {
        let mensaje =
          "Proceso de bonificaciones finalizado.\n\n" +
          `Equipos procesados: ${resultado.equiposProcesados}\n` +
          `Equipos omitidos: ${resultado.equiposOmitidos}`;

        if (
          resultado.errores &&
          resultado.errores.length > 0
        ) {
          mensaje +=
            "\n\nNo se pudieron actualizar los siguientes equipos: " +
            resultado.errores.join(", ");
        }

        alert(mensaje);
      }
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

  // Activar o desactivar un participante mediante la API segura
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
      // Comprobar la sesión de Supabase Auth
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError || !session) {
        alert(
          "Tu sesión ha caducado. Inicia sesión de nuevo."
        );

        window.location.href = "/login";
        return;
      }

      // Obtener la liga activa
      const sesion = JSON.parse(
        localStorage.getItem("usuario") || "{}"
      );

      if (!sesion.liga_actual_id) {
        alert("No se ha encontrado la liga activa.");
        return;
      }

      // Enviar la solicitud al servidor
      const response = await fetch(
        "/api/admin/participantes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            usuario_id: id,
            liga_id: sesion.liga_actual_id,
            activo: !activo,
          }),
        }
      );

      const resultado = await response.json();

      if (!response.ok) {
        alert(
          resultado.error ||
            "No se pudo actualizar el usuario."
        );
        return;
      }

      // Recargar los participantes tras la actualización
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

        {/* Cabecera */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h1 className="text-4xl font-black mb-3">
            ⚙️ Panel de Administración
          </h1>

          <p className="text-zinc-400">
            Gestiona los participantes de tu liga.
          </p>
        </div>

        {/* Añadir participante */}
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

        {/* Gestionar participantes */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold mb-6">
            🚫 Gestionar participantes
          </h2>

          <div className="space-y-4">
            {participantes.map((usuario) => (
              <div
                key={usuario.id}
                className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={`/avatars/${usuario.avatar}`}
                    alt={usuario.usuario}
                    className="w-14 h-14 rounded-full border border-zinc-700"
                  />

                  <div>
                    <h3 className="font-bold text-lg">
                      {usuario.usuario}
                    </h3>

                    <p
                      className={
                        usuario.activo
                          ? "text-green-400"
                          : "text-red-400"
                      }
                    >
                      {usuario.activo
                        ? "Activo"
                        : "Desactivado"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() =>
                    cambiarEstado(
                      usuario.id,
                      usuario.activo
                    )
                  }
                  className={
                    usuario.activo
                      ? "bg-red-600 hover:bg-red-500 px-5 py-2 rounded-xl font-bold transition"
                      : "bg-green-600 hover:bg-green-500 px-5 py-2 rounded-xl font-bold transition"
                  }
                >
                  {usuario.activo
                    ? "Desactivar"
                    : "Activar"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Bonificaciones de temporada */}
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8">
          <h2 className="text-3xl font-bold mb-6">
            🎯 Bonificaciones de temporada
          </h2>

          <p className="text-zinc-400 mb-6">
            Aplica automáticamente las bonificaciones de las predicciones
            acertadas al finalizar el campeonato.
          </p>

          <button
            onClick={generarBonificaciones}
            disabled={procesandoBonificaciones}
            className="bg-orange-600 hover:bg-orange-500 disabled:bg-zinc-600 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold transition"
          >
            {procesandoBonificaciones
              ? "Aplicando bonificaciones..."
              : "Generar bonificaciones"}
          </button>
        </div>

      </div>
    </AppLayout>
  );
}

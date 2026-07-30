"use client";
import AppLayout from "@/components/layout/AppLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { campeonTemporada } from "@/data/prediccionesTemporada";
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
async function generarBonificaciones() {
let equiposProcesados = 0;
  const confirmar = window.confirm(
    "¿Aplicar las bonificaciones finales de la temporada?\n\nEsta acción solo debería ejecutarse una vez."
  );

  if (!confirmar) return;

  const { data: equipos, error } = await supabase
    .from("equipos")
    .select("*");

  if (error) {
    console.error(error);
    alert("No se pudieron leer los equipos.");
    return;
  }

  for (const equipo of equipos) {
if (equipo.bonus_temporada_aplicado) {
  continue;
}
  let bonus = 0;

  if (
    equipo.prediccion_piloto === campeonTemporada.piloto
  ) {
    bonus += equipo.prediccion_piloto_modificada
      ? 18.5
      : 37;
  }

  if (
    equipo.prediccion_motor === campeonTemporada.constructor
  ) {
    bonus += equipo.prediccion_motor_modificada
      ? 5
      : 10;
  }

const { error: errorUpdate } = await supabase
  .from("equipos")
  .update({
    bonus_temporada: bonus,
    bonus_temporada_aplicado: true,
  })
  .eq("id", equipo.id);

if (errorUpdate) {
  console.error(
    `Error actualizando ${equipo.usuario}`,
    errorUpdate
  );
} else {
  equiposProcesados++;
  console.log(
    `${equipo.usuario}: +${bonus} puntos`
  );
}
}
if (equiposProcesados === 0) {
  alert("Las bonificaciones ya habían sido aplicadas.");
} else {
  alert(
    `Bonificaciones aplicadas correctamente.\n\nEquipos procesados: ${equiposProcesados}`
  );
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

    const { error } = await supabase
      .from("usuarios")
      .update({
        activo: !activo,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("No se pudo actualizar el usuario.");
      return;
    }

    cargarDatos();
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
  className="bg-orange-600 hover:bg-orange-500 px-6 py-3 rounded-xl font-bold transition"
>
    Generar bonificaciones
  </button>

</div>
      </div>

        </AppLayout>
  

  );
}
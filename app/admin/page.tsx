"use client";

import {
  useEffect,
  useState,
} from "react";

import Navbar from "@/components/Navbar";
import { supabase } from "@/lib/supabase";
import { campeonTemporada } from "@/data/prediccionesTemporada";

export default function AdminPage() {

  const [linkInvitacion, setLinkInvitacion] =
    useState("");

  const [usuarios, setUsuarios] =
    useState<any[]>([]);
const aplicarBonusTemporada = async () => {

  const { data, error } =
    await supabase
      .from("equipos")
      .select("*");

  if (error) {
    console.error(error);
    return;
  }

  for (const equipo of data) {

    if (
      equipo.bonus_temporada_aplicado
    ) {
      continue;
    }

    let bonus = 0;

    if (
      equipo.prediccion_piloto_original ===
      campeonTemporada.piloto
    ) {
      bonus +=
        equipo.prediccion_piloto_modificada
          ? 18.5
          : 37;
    }

    if (
      equipo.prediccion_motor_original ===
      campeonTemporada.constructor
    ) {
      bonus +=
        equipo.prediccion_motor_modificada
          ? 5
          : 10;
    }

    await supabase
      .from("equipos")
      .update({
        puntos:
          equipo.puntos + bonus,

        bonus_temporada:
          bonus,

        bonus_temporada_aplicado:
          true,
      })
      .eq(
        "usuario",
        equipo.usuario
      );

  }

  alert(
    "Bonus de temporada aplicado"
  );

};
  useEffect(() => {

    const cargarUsuarios =
      async () => {

        const {
          data,
          error,
        } = await supabase
          .from("usuarios")
          .select(
            "usuario, activo"
          )
          .order("usuario");

        if (error) {
          console.error(error);
          return;
        }

        setUsuarios(
          data || []
        );

      };

    cargarUsuarios();

  }, []);

  const generarInvitacion =
    async () => {

      const token =
        Math.random()
          .toString(36)
          .substring(2, 12)
          .toUpperCase();

      const { error } =
        await supabase
          .from(
            "invitaciones"
          )
          .insert([
            {
              token,
              usado: false,
            },
          ]);

      if (error) {
        console.error(error);
        return;
      }

      const link =
        `${window.location.origin}/registro?token=${token}`;

      setLinkInvitacion(
        link
      );

    };

  const copiarLink =
    async () => {

      await navigator.clipboard.writeText(
        linkInvitacion
      );

      alert(
        "Enlace copiado al portapapeles"
      );

    };

  const cambiarEstado =
    async (
      usuario: string,
      activo: boolean
    ) => {

      const { error } =
        await supabase
          .from("usuarios")
          .update({
            activo: !activo,
          })
          .eq(
            "usuario",
            usuario
          );

      if (error) {
        console.error(error);
        return;
      }

      setUsuarios(
        usuarios.map((u) =>
          u.usuario === usuario
            ? {
                ...u,
                activo:
                  !activo,
              }
            : u
        )
      );

    };

  return (

    <main className="min-h-screen bg-black text-white p-8">

      <Navbar />

      <h1 className="text-5xl font-bold text-yellow-500 mb-10">
        ⚙️ Panel de Administración
      </h1>

      <div className="grid gap-6 max-w-3xl">

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            ➕ Añadir participante
          </h2>

          <button
            onClick={
              generarInvitacion
            }
            className="
              bg-green-600
              hover:bg-green-500
              px-5
              py-3
              rounded-xl
              font-bold
              mb-4
            "
          >
            Generar invitación
          </button>

          {linkInvitacion && (

            <div className="space-y-3">

              <p className="text-green-400 break-all">
                {linkInvitacion}
              </p>

              <button
                onClick={
                  copiarLink
                }
                className="
                  bg-blue-600
                  hover:bg-blue-500
                  px-4
                  py-2
                  rounded-xl
                "
              >
                Copiar enlace
              </button>

            </div>

          )}

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-6">
            🚫 Gestionar participantes
          </h2>

          <div className="space-y-3">

            {usuarios.map(
              (usuario) => (

                <div
                  key={
                    usuario.usuario
                  }
                  className="
                    flex
                    justify-between
                    items-center
                    bg-zinc-800
                    rounded-xl
                    p-3
                  "
                >

                  <div>

                    <p className="font-bold">
                      {
                        usuario.usuario
                      }
                    </p>

                    <p className="text-sm text-zinc-400">

                      {usuario.activo
                        ? "Activo"
                        : "Inactivo"}

                    </p>

                  </div>

                  <button
                    onClick={() =>
                      cambiarEstado(
                        usuario.usuario,
                        usuario.activo
                      )
                    }
                    className={`px-4 py-2 rounded-xl font-bold transition ${
                      usuario.activo
                        ? "bg-red-600 hover:bg-red-500"
                        : "bg-green-600 hover:bg-green-500"
                    }`}
                  >

                    {usuario.activo
                      ? "Desactivar"
                      : "Reactivar"}

                  </button>

                </div>

              )
            )}

          </div>

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-4">
  🏆 Bonus de temporada
</h2>

<button
  onClick={aplicarBonusTemporada}
  className="
    bg-yellow-600
    hover:bg-yellow-500
    px-5
    py-3
    rounded-xl
    font-bold
  "
>
  Calcular Bonus Temporada
</button>

        </div>

        <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6">

          <h2 className="text-2xl font-bold mb-3">
            ⚠️ Resolver incidencias
          </h2>

          <p className="text-zinc-400">
            Herramientas administrativas.
          </p>

        </div>

      </div>

    </main>

  );

}
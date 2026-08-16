"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

import CreateLeagueForm from "@/components/auth/CreateLeagueForm";
import JoinLeagueForm from "@/components/auth/JoinLeagueForm";

interface Usuario {
  id: number;
  usuario: string;
  email: string;
  avatar: string;
  liga_actual_id: number | null;
}

interface Liga {
  id: number;
  nombre: string;
  codigo: string;
  admin_liga: boolean;
}

type Modo = "lista" | "crear" | "unirse";

export default function LigasPage() {
  const router = useRouter();

  const [usuario, setUsuario] =
    useState<Usuario | null>(null);

  const [ligas, setLigas] =
    useState<Liga[]>([]);

  const [modo, setModo] =
    useState<Modo>("lista");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  async function cargarDatos() {
    setLoading(true);
    setError("");

    const guardado =
      localStorage.getItem("usuario");

    if (!guardado) {
      router.replace("/registro");
      return;
    }

    try {
      const datos: Usuario =
        JSON.parse(guardado);

      setUsuario(datos);

      // ----------------------------------------
      // OBTENER LIGAS DEL USUARIO
      // ----------------------------------------

      const {
        data: relaciones,
        error: errorRelaciones,
      } = await supabase
        .from("usuarios_ligas")
        .select(`
          liga_id,
          admin_liga
        `)
        .eq("usuario_id", datos.id);

      if (errorRelaciones) {
        throw errorRelaciones;
      }

      if (!relaciones || relaciones.length === 0) {
        setLigas([]);
        setLoading(false);
        return;
      }

      const ligaIds =
        relaciones.map(
          (relacion) => relacion.liga_id
        );

      // ----------------------------------------
      // OBTENER DATOS DE LAS LIGAS
      // ----------------------------------------

      const {
        data: ligasData,
        error: errorLigas,
      } = await supabase
        .from("ligas")
        .select(`
          id,
          nombre,
          codigo
        `)
        .in("id", ligaIds);

      if (errorLigas) {
        throw errorLigas;
      }

      const resultado: Liga[] =
        (ligasData ?? []).map((liga) => {
          const relacion =
            relaciones.find(
              (r) =>
                r.liga_id === liga.id
            );

          return {
            id: liga.id,
            nombre: liga.nombre,
            codigo: liga.codigo,
            admin_liga:
              relacion?.admin_liga ?? false,
          };
        });

      setLigas(resultado);

    } catch (err) {
      console.error(err);

      setError(
        "No se pudieron cargar tus ligas."
      );
    } finally {
      setLoading(false);
    }
  }

  // ----------------------------------------
  // CAMBIAR LIGA ACTIVA
  // ----------------------------------------

  async function seleccionarLiga(
    ligaId: number
  ) {
    if (!usuario) return;

    setError("");

    const {
      error: errorUpdate,
    } = await supabase
      .from("usuarios")
      .update({
        liga_actual_id: ligaId,
      })
      .eq("id", usuario.id);

    if (errorUpdate) {
      console.error(errorUpdate);

      setError(
        "No se pudo cambiar de liga."
      );

      return;
    }

    const usuarioActualizado = {
      ...usuario,
      liga_actual_id: ligaId,
    };

    localStorage.setItem(
      "usuario",
      JSON.stringify(
        usuarioActualizado
      )
    );

    setUsuario(usuarioActualizado);

    router.push("/dashboard");
  }

  // ----------------------------------------
  // CARGANDO
  // ----------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-zinc-400">
          Cargando tus ligas...
        </div>
      </main>
    );
  }

  // ----------------------------------------
  // USUARIO NO ENCONTRADO
  // ----------------------------------------

  if (!usuario) {
    return null;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-12">

      <div className="max-w-3xl mx-auto">

        {/* ---------------------------------- */}
        {/* CABECERA */}
        {/* ---------------------------------- */}

        <div className="mb-10">

          <button
            type="button"
            onClick={() =>
              router.push("/dashboard")
            }
            className="
              text-zinc-400
              hover:text-white
              transition
              mb-6
            "
          >
            ← Volver
          </button>

          <h1 className="text-4xl md:text-5xl font-black">
            🏁 Mis ligas
          </h1>

          <p className="mt-3 text-zinc-400">
            Gestiona tus ligas y elige en
            cuál quieres competir.
          </p>

        </div>

        {/* ---------------------------------- */}
        {/* ERROR */}
        {/* ---------------------------------- */}

        {error && (
          <div
            className="
              mb-6
              rounded-xl
              border
              border-red-700
              bg-red-900/30
              p-4
              text-red-400
            "
          >
            {error}
          </div>
        )}

        {/* ---------------------------------- */}
        {/* CREAR / UNIRSE */}
        {/* ---------------------------------- */}

        {modo !== "lista" ? (

          <section
            className="
              bg-zinc-900
              border
              border-zinc-800
              rounded-3xl
              p-8
              mb-8
            "
          >

            <div className="flex items-center justify-between mb-8">

              <h2 className="text-2xl font-bold">
                {modo === "crear"
                  ? "➕ Crear una liga"
                  : "🔑 Unirme a una liga"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setModo("lista")
                }
                className="
                  text-zinc-400
                  hover:text-white
                  transition
                "
              >
                ✕
              </button>

            </div>

            {modo === "crear" ? (
              <CreateLeagueForm
                usuario={usuario}
              />
            ) : (
              <JoinLeagueForm
                usuario={usuario}
              />
            )}

          </section>

        ) : (

          <>
            {/* -------------------------------- */}
            {/* LISTA DE LIGAS */}
            {/* -------------------------------- */}

            {ligas.length === 0 ? (

              <section
                className="
                  bg-zinc-900
                  border
                  border-zinc-800
                  rounded-3xl
                  p-8
                  text-center
                "
              >

                <div className="text-5xl mb-5">
                  🏁
                </div>

                <h2 className="text-2xl font-bold">
                  Todavía no perteneces a ninguna liga
                </h2>

                <p className="mt-3 text-zinc-400">
                  Crea una liga con tus amigos
                  o únete a una liga existente
                  mediante su código.
                </p>

              </section>

            ) : (

              <section>

                <div className="space-y-4">

                  {ligas.map((liga) => {

                    const activa =
                      usuario.liga_actual_id ===
                      liga.id;

                    return (
                      <div
                        key={liga.id}
                        className={`
                          rounded-2xl
                          border
                          p-5
                          transition-all
                          ${
                            activa
                              ? "border-orange-500 bg-orange-500/10"
                              : "border-zinc-800 bg-zinc-900 hover:border-zinc-600"
                          }
                        `}
                      >

                        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                          <div>

                            <div className="flex items-center gap-3">

                              <h2 className="text-xl font-bold">
                                🏆 {liga.nombre}
                              </h2>

                              {activa && (
                                <span
                                  className="
                                    rounded-full
                                    bg-orange-500
                                    px-3
                                    py-1
                                    text-xs
                                    font-bold
                                  "
                                >
                                  ACTIVA
                                </span>
                              )}

                            </div>

                            <div className="mt-2 flex flex-wrap gap-3 text-sm text-zinc-400">

                              <span>
                                {liga.admin_liga
                                  ? "👑 Administrador"
                                  : "👤 Participante"}
                              </span>

                              <span>
                                Código: {liga.codigo}
                              </span>

                            </div>

                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              seleccionarLiga(
                                liga.id
                              )
                            }
                            disabled={activa}
                            className="
                              rounded-xl
                              bg-orange-500
                              px-5
                              py-3
                              font-bold
                              transition
                              hover:bg-orange-600
                              disabled:cursor-default
                              disabled:opacity-40
                            "
                          >
                            {activa
                              ? "Liga activa"
                              : "Entrar en liga →"}
                          </button>

                        </div>

                      </div>
                    );
                  })}

                </div>

              </section>

            )}

            {/* -------------------------------- */}
            {/* ACCIONES */}
            {/* -------------------------------- */}

            <section className="grid gap-4 sm:grid-cols-2 mt-8">

              <button
                type="button"
                onClick={() =>
                  setModo("crear")
                }
                className="
                  rounded-2xl
                  border
                  border-orange-500/40
                  bg-orange-500/10
                  p-6
                  text-left
                  transition
                  hover:border-orange-500
                  hover:bg-orange-500/20
                "
              >

                <div className="text-3xl mb-3">
                  ➕
                </div>

                <h2 className="text-xl font-bold">
                  Crear una liga
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Crea una nueva liga y
                  conviértete en administrador.
                </p>

              </button>

              <button
                type="button"
                onClick={() =>
                  setModo("unirse")
                }
                className="
                  rounded-2xl
                  border
                  border-blue-500/40
                  bg-blue-500/10
                  p-6
                  text-left
                  transition
                  hover:border-blue-500
                  hover:bg-blue-500/20
                "
              >

                <div className="text-3xl mb-3">
                  🔑
                </div>

                <h2 className="text-xl font-bold">
                  Unirme a una liga
                </h2>

                <p className="mt-2 text-sm text-zinc-400">
                  Introduce el código de
                  invitación de una liga.
                </p>

              </button>

            </section>

          </>
        )}

      </div>

    </main>
  );
}
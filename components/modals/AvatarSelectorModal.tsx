"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";

type Props = {
  open: boolean;
  avatarActual: string;
  saving: boolean;
  onClose: () => void;
  onSave: (avatar: string) => void;
};

const AVATARES = [
  "avatar1.png",
  "avatar2.png",
  "avatar3.png",
  "avatar4.png",
  "avatar5.png",
  "avatar6.png",
  "avatar7.png",
  "avatar8.png",
  "avatar9.png",
  "avatar10.png",
  "avatar11.png",
  "avatar12.png",
  "avatar13.png",
];

export default function AvatarSelectorModal({
  open,
  avatarActual,
  saving,
  onClose,
  onSave,
}: Props) {
  const [seleccionado, setSeleccionado] = useState(avatarActual);

  useEffect(() => {
    if (open) {
      setSeleccionado(avatarActual);
    }
  }, [open, avatarActual]);

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">

        <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-700 shadow-2xl">

          <div className="p-6">

            <h2 className="text-2xl font-bold text-center mb-2">
              Cambiar avatar
            </h2>

            <p className="text-zinc-400 text-center mb-6">
              Elige el avatar que más te represente.
            </p>

            <div className="grid grid-cols-3 gap-5">

              {AVATARES.map((avatar) => {

                const activo = avatar === seleccionado;

                return (
                  <button
                    key={avatar}
                    onClick={() => setSeleccionado(avatar)}
                    className={`
                      relative rounded-full transition-all duration-200
                      ${
                        activo
                          ? "scale-105 ring-4 ring-orange-500"
                          : "hover:scale-105"
                      }
                    `}
                  >
                    <img
                      src={`/avatars/${avatar}`}
                      alt={avatar}
                      className="w-24 h-24 rounded-full object-cover"
                    />

                    {activo && (
                      <div className="absolute -top-1 -right-1 bg-orange-500 rounded-full p-1">
                        <Check size={16} />
                      </div>
                    )}
                  </button>
                );
              })}

            </div>

            <div className="flex justify-end gap-3 mt-8">

              <button
                onClick={() => {
  if (!saving) onClose();
}}
disabled:opacity-50
disabled:cursor-not-allowed
                className="px-5 py-2 rounded-xl bg-zinc-700 hover:bg-zinc-600 transition"
              >
                Cancelar
              </button>

              <button
    onClick={() => onSave(seleccionado)}
    disabled={seleccionado === avatarActual || saving}
                className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                {saving ? "Guardando..." : "Guardar"}
              </button>

            </div>

          </div>

        </div>

      </div>
    </>
  );
}
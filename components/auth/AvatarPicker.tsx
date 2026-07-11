"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
}

const avatars = [
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

export default function AvatarPicker({
  value,
  onChange,
}: AvatarPickerProps) {
  return (
    <div>

      <h3 className="text-lg font-semibold text-center mb-6">
        Elige tu avatar
      </h3>

      <div className="grid grid-cols-4 gap-4">

        {avatars.map((avatar) => {

          const seleccionado = value === avatar;

          return (

            <motion.button
              key={avatar}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onChange(avatar)}
              className={`
                rounded-2xl
                overflow-hidden
                border-2
                transition-all
                ${
                  seleccionado
                    ? "border-orange-500 shadow-lg shadow-orange-500/30"
                    : "border-zinc-700 hover:border-orange-400"
                }
              `}
            >

              <Image
                src={`/avatars/${avatar}`}
                alt={avatar}
                width={90}
                height={90}
                className="w-full h-auto"
              />

            </motion.button>

          );

        })}

      </div>

    </div>
  );
}
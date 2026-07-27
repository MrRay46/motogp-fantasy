"use client";

import {
  BookOpen,
  CircleHelp,
  Info,
  Mail,
} from "lucide-react";

import MenuItem from "./MenuItem";

export default function HelpCard() {
  return (
    <div className="bg-zinc-900 rounded-2xl p-3 shadow-lg">

      <MenuItem
        icon={<BookOpen size={18} />}
        title="Cómo jugar"
      />

      <MenuItem
        icon={<BookOpen size={18} />}
        title="Reglamento"
      />

      <MenuItem
        icon={<CircleHelp size={18} />}
        title="FAQ"
      />

      <MenuItem
        icon={<Mail size={18} />}
        title="Contacto"
      />

      <MenuItem
        icon={<Info size={18} />}
        title="Versión RayonGrid"
      />

    </div>
  );
}
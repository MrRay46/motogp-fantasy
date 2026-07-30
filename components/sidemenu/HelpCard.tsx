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
  href="/como-jugar"
/>

      <MenuItem
    icon={<BookOpen size={18} />}
    title="Reglamento"
    href="/reglas"
/>

      <MenuItem
        icon={<CircleHelp size={18} />}
        title="FAQ"
      />

     <MenuItem
  icon={<Mail size={18} />}
  title="Contacto"
  href="/contacto"
/>

      <MenuItem
  icon={<Info size={18} />}
  title="Versión RayonGrid"
  href="/version"
/>

    </div>
  );
}
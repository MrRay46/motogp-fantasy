"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
};

export default function MenuItem({
  icon,
  title,
  href,
  onClick,
  disabled = false,
}: MenuItemProps) {
  const contenido = (
    <>
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>

      <ChevronRight
        size={18}
        className="text-zinc-500"
      />
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="w-full flex items-center justify-between rounded-xl px-3 py-3 hover:bg-zinc-800 transition"
      >
        {contenido}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full flex items-center justify-between rounded-xl px-3 py-3 hover:bg-zinc-800 transition disabled:opacity-50"
    >
      {contenido}
    </button>
  );
}
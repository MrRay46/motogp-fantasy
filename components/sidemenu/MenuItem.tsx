"use client";

import { ChevronRight } from "lucide-react";

type MenuItemProps = {
  icon: React.ReactNode;
  title: string;
  onClick?: () => void;
};

export default function MenuItem({
  icon,
  title,
  onClick,
}: MenuItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between rounded-xl px-3 py-3 hover:bg-zinc-800 transition"
    >
      <div className="flex items-center gap-3">
        {icon}
        <span>{title}</span>
      </div>

      <ChevronRight
        size={18}
        className="text-zinc-500"
      />
    </button>
  );
}
"use client";

import UserCard from "./sidemenu/UserCard";
import LeagueCard from "./sidemenu/LeagueCard";
import HelpCard from "./sidemenu/HelpCard";

type SideMenuProps = {
  abierto: boolean;
  onClose: () => void;
};

export default function SideMenu({
  abierto,
  onClose,
}: SideMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${
            abierto
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }
        `}
      />

      {/* Drawer */}
      <aside
        className={`
          fixed top-0 left-0 z-50
          h-screen w-[75%] max-w-[360px]
          bg-zinc-950 border-r border-zinc-800
          transition-transform duration-300
          ${
            abierto
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <div className="h-full overflow-y-auto p-6">
          <div className="space-y-6">
            <UserCard />

            <LeagueCard />

            <HelpCard />
          </div>
        </div>
      </aside>
    </>
  );
}
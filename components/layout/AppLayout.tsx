"use client";

import { ReactNode } from "react";
import Navbar from "@/components/Navbar";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({
  children,
}: AppLayoutProps) {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-14">
        {children}
      </section>
    </main>
  );
}
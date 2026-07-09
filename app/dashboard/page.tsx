"use client";

import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-10">

        <div className="space-y-2">

          <p className="text-zinc-400 text-lg">
            👋 Buenos días
          </p>

          <h1 className="text-5xl font-black">
            De la Raya Jr
          </h1>

        </div>

      </section>

    </main>
  );
}
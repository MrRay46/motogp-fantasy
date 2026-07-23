"use client";

import Navbar from "@/components/Navbar";
import PaddockFeed from "@/components/dashboard/PaddockFeed";

export default function PaddockPage() {

  return (

    <main className="min-h-screen bg-black text-white">

      <Navbar />

      <section className="max-w-5xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-black mb-10">
          🏍 PADDOCK
        </h1>

        <PaddockFeed limit={false} />

      </section>

    </main>

  );

}
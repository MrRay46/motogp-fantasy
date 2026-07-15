"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegistroPage() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-8">

      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 w-full max-w-lg">

        <RegisterForm />

      </div>

    </main>
  );
}
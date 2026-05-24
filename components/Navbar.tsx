export default function Navbar() {
  return (
    <nav className="bg-zinc-900/80 backdrop-blur border border-zinc-700 rounded-2xl p-4 flex gap-8 mb-10 text-xl font-semibold">
      <a
        href="/"
        className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-400 transition"
      >
        Inicio
      </a>

      <a
        href="/equipo"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Mi Equipo
      </a>

      <a
        href="/mercado"
        className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
      >
        Mercado
  
      </a>
      <a
  href="/clasificacion"
  className="bg-zinc-800 px-4 py-2 rounded-xl hover:bg-zinc-700 transition"
>
  Clasificaciones
</a>
    </nav>
  );
}
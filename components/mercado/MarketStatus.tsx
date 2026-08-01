type MarketStatusProps = {
  mercadoAbierto: boolean;
  diasRestantes: number | null;
};

export default function MarketStatus({
  mercadoAbierto,
  diasRestantes,
}: MarketStatusProps) {
  if (mercadoAbierto) {
    return (
      <p className="text-xl mb-6 text-green-400 font-semibold">
        🟢 Mercado abierto
      </p>
    );
  }

  return (
    <div className="mb-6 space-y-2">
      <p className="text-xl text-yellow-400 font-semibold">
        🔒 Mercado cerrado
      </p>

      {diasRestantes !== null && (
        <p className="text-lg text-zinc-300">
          ⏳ Abre en {diasRestantes}{" "}
          {diasRestantes === 1 ? "día" : "días"}
        </p>
      )}
    </div>
  );
}
type BudgetCardProps = {
  presupuestoRestante: number;
};

export default function BudgetCard({
  presupuestoRestante,
}: BudgetCardProps) {
  return (
    <p className="text-xl mb-8">
      💰 Presupuesto restante:{" "}
      {presupuestoRestante.toFixed(1)} M
    </p>
  );
}
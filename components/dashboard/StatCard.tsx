interface StatCardProps {
  title: string;
  children: React.ReactNode;
  color?: "neutral" | "success" | "danger" | "gold";
}

export default function StatCard({
  title,
  children,
  color = "neutral",
}: StatCardProps) {

  const styles = {
    neutral:
      "bg-zinc-900/70 border-zinc-800",

    success:
      "bg-green-500/10 border-green-500/30",

    danger:
      "bg-red-500/10 border-red-500/30",

    gold:
      "bg-yellow-500/10 border-yellow-500/30",
  };

  return (

    <div
      className={`
        rounded-3xl
        border
        p-8
        backdrop-blur
        transition-all
        duration-300
        hover:scale-[1.02]
        hover:border-orange-500/40
        ${styles[color]}
      `}
    >

      <h2 className="text-xl font-bold text-zinc-300 mb-6">

        {title}

      </h2>

      {children}

    </div>

  );

}
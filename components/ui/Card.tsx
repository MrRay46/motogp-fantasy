type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Card({
  children,
  className = "",
}: CardProps) {

  return (

    <div
      className={`
        bg-zinc-900
        rounded-3xl
        border
        border-zinc-800
        p-6
        transition-all
        duration-300
        hover:border-orange-500/40
        hover:-translate-y-1
        ${className}
      `}
    >
      {children}
    </div>

  );

}
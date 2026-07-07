"use client";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
};

export default function Button({
  children,
  onClick,
  variant = "primary",
  className = "",
}: ButtonProps) {

  const base =
    "w-full rounded-2xl py-4 px-6 font-bold transition-all duration-300";

  const primary =
    "bg-orange-500 hover:bg-orange-400 text-white shadow-lg shadow-orange-500/20";

  const secondary =
    "border border-zinc-700 hover:border-orange-500 hover:bg-zinc-900";

  return (

    <button
      onClick={onClick}
      className={`${base} ${variant === "primary" ? primary : secondary} ${className}`}
    >
      {children}
    </button>

  );

}
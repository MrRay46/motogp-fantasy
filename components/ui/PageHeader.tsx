import Logo from "./Logo";

type PageHeaderProps = {
  logoSize?: number;
};

export default function PageHeader({
  logoSize = 280,
}: PageHeaderProps) {

  return (

    <div className="flex flex-col items-center">

      <Logo size={logoSize} />

      <p
        className="
          mt-8
          text-center
          text-base
          md:text-lg
          text-zinc-400
          tracking-wide
          max-w-xl
        "
      >
        Tu equipo · Tus decisiones · Tu campeonato
      </p>

    </div>

  );

}
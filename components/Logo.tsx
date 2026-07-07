import Image from "next/image";

type LogoProps = {
  size?: number;
};

export default function Logo({
  size = 260,
}: LogoProps) {

  return (

    <Image
      src="/images/rayongrid-logo.png"
      alt="RayonGrid"
      width={size}
      height={size}
      priority
      className="h-auto"
    />

  );

}
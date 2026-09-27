import Image from "next/image";

interface LogoProps {
  variant?: "full" | "mark" | "icon";
  className?: string;
}

export default function Logo({ variant = "full", className = "h-9" }: LogoProps) {
  const src =
    variant === "full"
      ? "/logo-full.png"
      : variant === "mark"
        ? "/logo-mark.png"
        : "/logo-icon.png";

  return (
    <Image
      src={src}
      alt="XtoX Logistics"
      width={variant === "full" ? 480 : 400}
      height={variant === "full" ? 480 : 400}
      priority
      className={className}
    />
  );
}

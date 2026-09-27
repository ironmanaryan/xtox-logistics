import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  variant?: "full" | "mark" | "icon";
  className?: string;
  href?: string | null;
}

export default function Logo({
  variant = "full",
  className = "h-14 w-auto",
  href = "/",
}: LogoProps) {
  const src =
    variant === "full"
      ? "/logo-full.png"
      : variant === "mark"
        ? "/logo-mark.png"
        : "/logo-icon.png";

  const img = (
    <Image
      src={src}
      alt="XtoX Logistics"
      width={512}
      height={512}
      priority
      className={className}
    />
  );

  if (!href) return img;

  return (
    <Link href={href} aria-label="XtoX Logistics home" className="flex items-center">
      {img}
    </Link>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { SiteImage } from "@/data/images";

interface ServiceLayoutProps {
  icon?: React.ReactNode;
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  image?: SiteImage;
  children: React.ReactNode;
}

export default function ServiceLayout({
  icon,
  eyebrow,
  title,
  highlight,
  description,
  image,
  children,
}: ServiceLayoutProps) {
  return (
    <>
      <section className="dot-grid border-b border-line">
        <div className="section-pad grid items-center gap-10 py-14 lg:grid-cols-[1.2fr_1fr] lg:py-20">
          <div>
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">{title}</span>
            </nav>

            <span className="chip-yellow mt-6">
              {icon}
              {eyebrow}
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {title}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{highlight}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow"
                />
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {description}
            </p>
          </div>

          {image && (
            <div className="relative h-64 overflow-hidden rounded-3xl border border-line shadow-hero lg:h-80">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      <div className="section-pad py-14">{children}</div>
    </>
  );
}

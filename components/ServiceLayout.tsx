import Link from "next/link";

interface ServiceLayoutProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
  children: React.ReactNode;
}

export default function ServiceLayout({
  eyebrow,
  title,
  highlight,
  description,
  children,
}: ServiceLayoutProps) {
  return (
    <>
      <section className="dot-grid border-b border-line">
        <div className="section-pad py-14 lg:py-20">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
            <Link href="/" className="hover:text-brand-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-brand-black">{title}</span>
          </nav>

          <span className="chip-yellow mt-6">{eyebrow}</span>
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
      </section>

      <div className="section-pad py-14">{children}</div>
    </>
  );
}

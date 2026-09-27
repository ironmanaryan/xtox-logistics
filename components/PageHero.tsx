interface PageHeroProps {
  eyebrow: string;
  title: string;
  highlight: string;
  description: string;
}

export default function PageHero({ eyebrow, title, highlight, description }: PageHeroProps) {
  return (
    <section className="dot-grid border-b border-line">
      <div className="section-pad py-14 lg:py-20">
        <span className="chip-yellow">{eyebrow}</span>
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
  );
}

import Link from "next/link";
import { Package, Ship, Truck, Wheat, ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import { services } from "@/data/services";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "packers-movers": Package,
  "import-export": Ship,
  "sme-transport": Truck,
  "agri-export": Wheat,
};

const PRIMARY_KEYS = ["sme-transport", "packers-movers"];
const SECONDARY_KEYS = ["import-export", "agri-export"];

const primaryCopy: Record<string, string> = {
  "sme-transport":
    "Full-truck and part-load freight for growing businesses — on-demand or on a contracted lane, with digital PODs and one invoice.",
  "packers-movers":
    "Home and office relocations with trained crews, graded packing material, a named move manager and insured transit.",
};

const primaryCta: Record<string, string> = {
  "sme-transport": "Get a lane rate",
  "packers-movers": "Plan my move",
};

export default function ServiceGrid() {
  const primary = PRIMARY_KEYS.map((k) => services.find((s) => s.key === k)!).filter(Boolean);
  const secondary = SECONDARY_KEYS.map((k) => services.find((s) => s.key === k)!).filter(Boolean);

  return (
    <section id="services" className="section-pad py-20">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">What we move</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Two core services.
              <br className="sm:hidden" /> Two specialist divisions.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Every division runs on the same tracking, billing and support stack —
            so you scale with one partner, not four vendors.
          </p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {primary.map((s, i) => {
          const Icon = icons[s.key];
          return (
            <Reveal key={s.key} delay={i * 90}>
              <Link
                href={s.slug}
                className="card group flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hero sm:p-8"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-105">
                    {Icon && <Icon className="h-7 w-7" aria-hidden />}
                  </span>
                  <span className="chip">Primary service</span>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">{s.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {primaryCopy[s.key] ?? s.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-black">
                  {primaryCta[s.key] ?? "Explore"}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>

      <div className="mt-5 grid gap-5 sm:grid-cols-2">
        {secondary.map((s, i) => {
          const Icon = icons[s.key];
          return (
            <Reveal key={s.key} delay={i * 90}>
              <Link
                href={s.slug}
                className="card group flex h-full items-start gap-4 p-5 transition-all duration-300 hover:border-brand-black"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-brand-black">
                  {Icon && <Icon className="h-5 w-5" aria-hidden />}
                </span>
                <div>
                  <h3 className="font-extrabold">{s.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.description}</p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold">
                    Explore
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

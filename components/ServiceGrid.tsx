"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Package, Ship, Truck, Wheat } from "lucide-react";
import Reveal from "./Reveal";
import { services } from "@/data/services";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "packers-movers": Package,
  "import-export": Ship,
  "sme-transport": Truck,
  "agri-export": Wheat,
};

export default function ServiceGrid() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="services" className="section-pad py-20">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">What we move</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Four divisions. One network.
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">
            Every division runs on the same tracking, billing and support stack —
            so you scale with one partner, not four vendors.
          </p>
        </div>
      </Reveal>

      <div
        ref={ref}
        className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4"
      >
        {services.map((s, i) => {
          const Icon = icons[s.key];
          return (
          <Link
            key={s.key}
            href={s.slug}
            className={`card group flex flex-col p-6 transition-all duration-500 ${
              visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ transitionDelay: `${i * 90}ms` }}
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-110">
              {Icon && <Icon className="h-6 w-6" aria-hidden />}
            </span>
            <h3 className="mt-4 text-lg font-extrabold">{s.name}</h3>
            <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
              {s.description}
            </p>
            <ul className="mt-4 space-y-1.5">
              {s.points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-muted">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                  {p}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-brand-black">
              Explore
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
          );
        })}
      </div>
    </section>
  );
}

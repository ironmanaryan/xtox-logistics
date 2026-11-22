"use client";

import Link from "next/link";
import { Package, Ship, Truck, Wheat, ArrowRight, Check } from "lucide-react";
import Reveal from "./Reveal";
import { useI18n } from "./LanguageProvider";
import { services } from "@/data/services";
import type { TKey } from "@/lib/i18n";
import type { LucideIcon } from "lucide-react";

const icons: Record<string, LucideIcon> = {
  "packers-movers": Package,
  "import-export": Ship,
  "sme-transport": Truck,
  "agri-export": Wheat,
};

const PRIMARY_KEYS = ["sme-transport", "packers-movers"];
const SECONDARY_KEYS = ["import-export", "agri-export"];

const COPY: Record<string, { copy: TKey; cta: TKey; points: TKey[] }> = {
  "sme-transport": {
    copy: "svc.sme.copy",
    cta: "svc.sme.cta",
    points: ["svc.sme.p1", "svc.sme.p2", "svc.sme.p3"],
  },
  "packers-movers": {
    copy: "svc.pm.copy",
    cta: "svc.pm.cta",
    points: ["svc.pm.p1", "svc.pm.p2", "svc.pm.p3"],
  },
};

const NAME: Record<string, TKey> = {
  "packers-movers": "svc.pm.name",
  "import-export": "svc.ie.name",
  "sme-transport": "svc.sme.name",
  "agri-export": "svc.agri.name",
};

const DESC: Record<string, TKey> = {
  "import-export": "svc.ie.desc",
  "agri-export": "svc.agri.desc",
};

export default function ServiceGrid() {
  const { t } = useI18n();
  const primary = PRIMARY_KEYS.map((k) => services.find((s) => s.key === k)!).filter(Boolean);
  const secondary = SECONDARY_KEYS.map((k) => services.find((s) => s.key === k)!).filter(Boolean);

  return (
    <section id="services" className="section-pad py-20">
      <Reveal>
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">{t("home.servicesEyebrow")}</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {t("home.servicesTitle")}
              <br className="sm:hidden" /> {t("home.servicesTitle2")}
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted">{t("home.servicesLead")}</p>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        {primary.map((s, i) => {
          const Icon = icons[s.key];
          const copy = COPY[s.key];
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
                  <span className="chip">{t("home.primaryBadge")}</span>
                </div>
                <h3 className="mt-5 text-2xl font-extrabold tracking-tight">
                  {NAME[s.key] ? t(NAME[s.key]) : s.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {copy ? t(copy.copy) : s.description}
                </p>
                <ul className="mt-5 space-y-2">
                  {(copy ? copy.points.map((p) => t(p)) : s.points).map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                      {p}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-black">
                  {copy ? t(copy.cta) : t("common.explore")}
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
                  <h3 className="font-extrabold">{NAME[s.key] ? t(NAME[s.key]) : s.name}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {DESC[s.key] ? t(DESC[s.key]) : s.description}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-sm font-bold">
                    {t("common.explore")}
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

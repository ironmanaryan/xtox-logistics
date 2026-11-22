"use client";

import Link from "next/link";
import { Check, MapPin, PhoneCall, Truck } from "lucide-react";
import { useI18n } from "./LanguageProvider";
import { corridorCopy, cityBlurbs, fill } from "@/lib/corridor-i18n";

interface Lane {
  slug: string;
  fromName: string;
  toName: string;
}

export default function CorridorContent({
  fromSlug,
  fromName,
  fromState,
  fromAreas,
  toSlug,
  toName,
  toState,
  toAreas,
  km,
  days,
  citiesCount,
  otherLanes,
  phone,
  phoneE164,
  callbackPromise,
  claimDays,
}: {
  fromSlug: string;
  fromName: string;
  fromState: string;
  fromAreas: string[];
  toSlug: string;
  toName: string;
  toState: string;
  toAreas: string[];
  km: string;
  days: number;
  citiesCount: number;
  otherLanes: Lane[];
  phone: string;
  phoneE164: string;
  callbackPromise: string;
  claimDays: number;
}) {
  const { locale } = useI18n();
  const c = (key: keyof typeof corridorCopy, vars: Record<string, string | number> = {}) =>
    fill(corridorCopy[key][locale] ?? corridorCopy[key].en, vars);

  const vars = { from: fromName, to: toName, km, days };
  const blurb = cityBlurbs[toSlug]?.[locale] ?? cityBlurbs[toSlug]?.en ?? "";

  const factors = [
    c("factorSize"),
    c("factorAccess"),
    c("factorPacking"),
    c("factorInsurance"),
    c("factorDate"),
    c("factorTolls"),
  ];
  const includes = [c("inc1"), c("inc2"), c("inc3"), c("inc4"), c("inc5"), c("inc6")];
  const faqs = [
    { q: c("faq1q", vars), a: c("faq1a", vars) },
    { q: c("faq2q", vars), a: c("faq2a", { promise: callbackPromise }) },
    { q: c("faq3q"), a: c("faq3a", { days: claimDays }) },
  ];

  return (
    <main>
      <section className="section-pad pt-14">
        <p className="eyebrow">
          {c("eyebrow", { fromState, toState })}
        </p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {c("h1", vars)}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
          {c("intro", vars)}
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/services/packers-movers/book" className="btn-primary">
            {c("fixedQuote")}
          </Link>
          <a href={`tel:${phoneE164}`} className="btn-secondary">
            <PhoneCall className="h-4 w-4" aria-hidden /> {phone}
          </a>
        </div>
      </section>

      <section className="section-pad grid gap-8 pb-16 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 className="text-2xl font-extrabold tracking-tight">{c("quoteHeading", vars)}</h2>
          <p className="mt-2 text-sm text-muted">{c("quoteLead")}</p>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {factors.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
          <div className="mt-6 rounded-2xl bg-brand-yellow p-6">
            <p className="text-lg font-extrabold text-brand-black">{c("priceTitle")}</p>
            <p className="mt-1 text-sm text-brand-black/70">
              {c("priceBody", { promise: callbackPromise })}
            </p>
            <Link href="/services/packers-movers/book" className="btn-secondary mt-4">
              {c("startQuote")}
            </Link>
          </div>

          <h2 className="mt-10 text-2xl font-extrabold tracking-tight">{c("includesHeading")}</h2>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {includes.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <aside className="card h-fit p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold">
            <Truck className="h-5 w-5" aria-hidden /> {c("routeNotes")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted">{blurb}</p>
          <p className="mt-3 text-sm">{c("transit", { days })}</p>
          <h3 className="mt-6 flex items-center gap-2 text-sm font-extrabold">
            <MapPin className="h-4 w-4" aria-hidden /> {c("toAreas", { to: toName })}
          </h3>
          <p className="mt-2 text-sm text-muted">{toAreas.join(", ")}</p>
          <h3 className="mt-5 flex items-center gap-2 text-sm font-extrabold">
            <MapPin className="h-4 w-4" aria-hidden /> {c("fromAreas", { from: fromName })}
          </h3>
          <p className="mt-2 text-sm text-muted">{fromAreas.join(", ")}</p>
        </aside>
      </section>

      <section className="section-pad pb-16">
        <h2 className="text-2xl font-extrabold tracking-tight">{c("faqHeading", vars)}</h2>
        <div className="mt-4 max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group p-5">
              <summary className="cursor-pointer font-bold">{f.q}</summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="section-pad pb-20">
        <h2 className="text-xl font-extrabold tracking-tight">{c("otherLanes")}</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {otherLanes.map((lane) => (
            <Link
              key={lane.slug}
              href={`/packers-movers/${lane.slug}`}
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand-black"
            >
              {lane.fromName} → {lane.toName}
            </Link>
          ))}
          <Link
            href="/packers-movers"
            className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand-black"
          >
            {c("allCities", { count: citiesCount })}
          </Link>
        </div>
      </section>
    </main>
  );
}

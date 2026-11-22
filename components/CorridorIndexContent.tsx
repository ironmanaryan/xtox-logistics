"use client";

import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useI18n } from "./LanguageProvider";
import { corridorCopy, fill } from "@/lib/corridor-i18n";

interface City {
  slug: string;
  name: string;
  state: string;
  areas: string[];
}

interface Corridor {
  slug: string;
  from: City;
  to: City;
}

export default function CorridorIndexContent({
  cities,
  corridors,
  phone,
  phoneE164,
}: {
  cities: City[];
  corridors: Corridor[];
  phone: string;
  phoneE164: string;
}) {
  const { locale } = useI18n();
  const c = (key: keyof typeof corridorCopy, vars: Record<string, string | number> = {}) =>
    fill(corridorCopy[key][locale] ?? corridorCopy[key].en, vars);

  return (
    <main>
      <section className="section-pad pt-14">
        <p className="eyebrow">{c("indexEyebrow")}</p>
        <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          {c("indexH1")}
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">{c("indexLead")}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/services/packers-movers/book" className="btn-primary">
            {c("fixedQuote")} <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <a href={`tel:${phoneE164}`} className="btn-secondary">
            <PhoneCall className="h-4 w-4" aria-hidden /> {phone}
          </a>
        </div>
      </section>

      <section className="section-pad grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
        {cities.map((city) => (
          <div key={city.slug} className="card p-5">
            <h2 className="text-lg font-extrabold">{c("fromCity", { city: city.name })}</h2>
            <p className="mt-1 text-xs text-muted">
              {city.state} · {city.areas.slice(0, 3).join(", ")}
            </p>
            <ul className="mt-3 space-y-1.5">
              {corridors
                .filter((lane) => lane.from.slug === city.slug)
                .map((lane) => (
                  <li key={lane.slug}>
                    <Link
                      href={`/packers-movers/${lane.slug}`}
                      className="text-sm font-semibold underline-offset-2 hover:underline"
                    >
                      {c("routeLink", { from: lane.from.name, to: lane.to.name })}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </section>
    </main>
  );
}

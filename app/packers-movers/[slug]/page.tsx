import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { cities, corridors, corridorDistance } from "@/data/cities";
import { company } from "@/data/company";
import { socialMetadata, absoluteUrl } from "@/lib/site";
import { Check, MapPin, PhoneCall, Truck } from "lucide-react";

export function generateStaticParams() {
  return corridors.map((c) => ({ slug: c.slug }));
}

export const dynamicParams = false;

function findCorridor(slug: string) {
  return corridors.find((c) => c.slug === slug);
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const corridor = findCorridor(params.slug);
  if (!corridor) return {};
  const { from, to } = corridor;
  const title = `Packers and Movers ${from.name} to ${to.name}`;
  const description = `House and office shifting from ${from.name} to ${to.name} — free survey, graded packing material, transit insurance and a tracked delivery. Get a callback within ${company.callbackPromise}.`;
  return { title, description, ...socialMetadata({ title, description, path: `/packers-movers/${corridor.slug}` }) };
}

const QUOTE_FACTORS = [
  "Home or office size and actual volume of goods",
  "Floor and lift access at both addresses",
  "Packing material needed for fragile items",
  "Declared value for transit insurance",
  "Shifting date and pickup flexibility",
  "Tolls, permits and any storage in transit",
];

export default function CorridorPage({ params }: { params: { slug: string } }) {
  const corridor = findCorridor(params.slug);
  if (!corridor) notFound();
  const { from, to } = corridor;
  const km = corridorDistance(from, to);
  const days = Math.max(1, Math.round(km / 400));

  const url = absoluteUrl(`/packers-movers/${corridor.slug}`);

  const faqs = [
    {
      q: `How long does a move from ${from.name} to ${to.name} take?`,
      a: `The road distance is roughly ${km.toLocaleString("en-IN")} km. Most household moves on this lane reach ${to.name} in about ${days} ${days === 1 ? "day" : "days"} after loading, depending on vehicle type and any part-load consolidation.`,
    },
    {
      q: `What does a ${from.name} to ${to.name} move cost?`,
      a: `We share your price after a free survey that counts actual volume, floor and lift access, packing material and insurance value. Add your move details in the quote form and an executive confirms the fixed amount within ${company.callbackPromise}.`,
    },
    {
      q: `Is my goods protected during transit?`,
      a: `Yes — transit insurance is offered on every move and the declared value of your goods is agreed before loading. Damage claims are accepted in writing within ${company.legal.claimWindowDays} days of delivery, with photographs and the delivery receipt.`,
    },
  ];

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: `Packers and Movers ${from.name} to ${to.name}`,
          serviceType: "Packers and Movers",
          provider: { "@type": "MovingCompany", name: company.brandName, url: absoluteUrl("/") },
          areaServed: [
            { "@type": "City", name: from.name },
            { "@type": "City", name: to.name },
          ],
          url,
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Packers & Movers", item: absoluteUrl("/services/packers-movers") },
            { "@type": "ListItem", position: 3, name: `${from.name} to ${to.name}`, item: url },
          ],
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }}
      />
      <Navbar />
      <main>
        <section className="section-pad pt-14">
          <p className="eyebrow">
            Packers &amp; Movers · {from.state} → {to.state}
          </p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Packers and movers from {from.name} to {to.name}
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Door-to-door household and office shifting on the {from.name}–{to.name} lane, about{" "}
            {km.toLocaleString("en-IN")} km by road. Survey first, fixed quote second, tracked
            delivery last — with a single coordinator for the whole move.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/packers-movers/book" className="btn-primary">
              Get a fixed quote
            </Link>
            <a href={`tel:${company.phoneE164}`} className="btn-secondary">
              <PhoneCall className="h-4 w-4" aria-hidden /> {company.phone}
            </a>
          </div>
        </section>

        <section className="section-pad grid gap-8 pb-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              How your {from.name} → {to.name} quote is built
            </h2>
            <p className="mt-2 text-sm text-muted">
              Every move is priced after we see the actual requirement — not from a printed
              rate card.
            </p>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {QUOTE_FACTORS.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-2xl bg-brand-yellow p-6">
              <p className="text-lg font-extrabold text-brand-black">
                Get your exact price for this lane.
              </p>
              <p className="mt-1 text-sm text-brand-black/70">
                Add your home size, floors and shifting date — our move desk calls back within{" "}
                {company.callbackPromise} with a fixed quote.
              </p>
              <Link href="/services/packers-movers/book" className="btn-secondary mt-4">
                Start my quote
              </Link>
            </div>

            <h2 className="mt-10 text-2xl font-extrabold tracking-tight">What the move includes</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {[
                "Free video or in-person survey before quoting",
                "Multi-layer packing: bubble wrap, foam, corrugated sheets",
                "Dedicated closed-body vehicle for household goods",
                "Loading, unloading and basic reassembly",
                "Transit insurance at declared value",
                "GST invoice and digital proof of delivery",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <aside className="card h-fit p-6">
            <h2 className="flex items-center gap-2 text-lg font-extrabold">
              <Truck className="h-5 w-5" aria-hidden /> Route notes
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{to.blurb}</p>
            <p className="mt-3 text-sm">
              <strong>Transit estimate:</strong> ~{days} {days === 1 ? "day" : "days"} after loading
            </p>
            <h3 className="mt-6 flex items-center gap-2 text-sm font-extrabold">
              <MapPin className="h-4 w-4" aria-hidden /> {to.name} areas we cover
            </h3>
            <p className="mt-2 text-sm text-muted">{to.areas.join(", ")}</p>
            <h3 className="mt-5 flex items-center gap-2 text-sm font-extrabold">
              <MapPin className="h-4 w-4" aria-hidden /> Pickup areas in {from.name}
            </h3>
            <p className="mt-2 text-sm text-muted">{from.areas.join(", ")}</p>
          </aside>
        </section>

        <section className="section-pad pb-16">
          <h2 className="text-2xl font-extrabold tracking-tight">
            {from.name} to {to.name} moving questions
          </h2>
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
          <h2 className="text-xl font-extrabold tracking-tight">Other lanes</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {corridors
              .filter((c) => c.from.slug === from.slug && c.to.slug !== to.slug)
              .slice(0, 8)
              .map((c) => (
                <Link
                  key={c.slug}
                  href={`/packers-movers/${c.slug}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand-black"
                >
                  {c.from.name} → {c.to.name}
                </Link>
              ))}
            <Link
              href="/packers-movers"
              className="rounded-full border border-line px-3 py-1.5 text-xs font-semibold hover:border-brand-black"
            >
              All {cities.length} cities
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

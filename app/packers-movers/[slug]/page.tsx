import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import CorridorContent from "@/components/CorridorContent";
import { cities, corridors, corridorDistance } from "@/data/cities";
import { company } from "@/data/company";
import { socialMetadata, absoluteUrl } from "@/lib/site";

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

  const otherLanes = corridors
    .filter((c) => c.from.slug === from.slug && c.to.slug !== to.slug)
    .slice(0, 8)
    .map((c) => ({ slug: c.slug, fromName: c.from.name, toName: c.to.name }));

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
      <CorridorContent
        fromSlug={from.slug}
        fromName={from.name}
        fromState={from.state}
        fromAreas={from.areas}
        toSlug={to.slug}
        toName={to.name}
        toState={to.state}
        toAreas={to.areas}
        km={km.toLocaleString("en-IN")}
        days={days}
        citiesCount={cities.length}
        otherLanes={otherLanes}
        phone={company.phone}
        phoneE164={company.phoneE164}
        callbackPromise={company.callbackPromise}
        claimDays={company.legal.claimWindowDays}
      />
      <Footer />
    </>
  );
}

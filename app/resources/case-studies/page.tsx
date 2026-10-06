import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { Building2, TrendingUp } from "lucide-react";
import { caseStudies as fallback } from "@/data/resources";
import { getPublishedResources } from "@/lib/resources-db";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Real results from XtoX clients: faster customs clearance, scheduled fleet contracts, agri-export success and zero-downtime office moves.",
};

export const revalidate = 60;

function parseExtra(extra: string): { client: string; result: string } {
  try {
    const o = JSON.parse(extra);
    return { client: o.client ?? "", result: o.result ?? "" };
  } catch {
    return { client: "", result: extra };
  }
}

export default async function CaseStudiesPage() {
  const rows = await getPublishedResources("case-study");
  const list =
    rows.length > 0
      ? rows.map((r) => {
          const { client, result } = parseExtra(r.extra);
          return { key: r.id, title: r.title, excerpt: r.excerpt, industry: r.tag || "Logistics", client, result };
        })
      : fallback.map((c) => ({
          key: c.slug,
          title: c.title,
          excerpt: c.excerpt,
          industry: c.industry,
          client: c.client,
          result: c.result,
        }));

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Resources · Case Studies"
          title="Proof, not"
          highlight="promises."
          description="How we move the numbers for clients across textiles, FMCG, agri and tech."
        />
        <div className="section-pad grid gap-5 pb-20 md:grid-cols-2">
          {list.map((c) => (
            <article key={c.key} className="card flex flex-col p-6">
              <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                <span className="flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5" aria-hidden /> {c.industry}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-extrabold leading-snug">{c.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{c.excerpt}</p>
              {c.result && (
                <div className="mt-4 flex items-center gap-2 rounded-xl bg-neutral-50 px-4 py-3">
                  <TrendingUp className="h-4 w-4 shrink-0 text-brand-black" aria-hidden />
                  <p className="text-sm font-bold">{c.result}</p>
                </div>
              )}
              {c.client && <p className="mt-3 text-xs text-muted">{c.client}</p>}
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

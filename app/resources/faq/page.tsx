import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { ChevronDown } from "lucide-react";
import { faqCategories as fallback } from "@/data/resources";
import { getPublishedResources } from "@/lib/resources-db";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about XtoX services: packers & movers, import/export, SME transport, agri-export and driver partnerships.",
};

export const revalidate = 60;

export default async function FaqPage() {
  const rows = await getPublishedResources("faq");
  const cats =
    rows.length > 0
      ? Array.from(
          rows.reduce((m, r) => {
            const name = r.tag || "General";
            if (!m.has(name)) m.set(name, []);
            m.get(name)!.push({ q: r.title, a: r.body });
            return m;
          }, new Map<string, { q: string; a: string }[]>()),
          ([name, items]) => ({ name, items })
        )
      : fallback;

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Resources · FAQ"
          title="Questions,"
          highlight="answered."
          description="Can't find what you're looking for? Our desk replies within 2 business hours."
        />
        <div className="section-pad max-w-3xl pb-20">
          {cats.map((cat) => (
            <section key={cat.name} className="mt-10 first:mt-0">
              <h2 className="text-xl font-extrabold tracking-tight">{cat.name}</h2>
              <div className="mt-4 space-y-3">
                {cat.items.map((f) => (
                  <details key={f.q} className="card group p-5 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="flex cursor-pointer items-center justify-between gap-4 font-bold">
                      {f.q}
                      <ChevronDown
                        className="h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-180"
                        aria-hidden
                      />
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}

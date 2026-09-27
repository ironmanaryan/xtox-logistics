import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { ChevronDown } from "lucide-react";
import { faqCategories } from "@/data/resources";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about XtoX services: packers & movers, import/export, SME transport, agri-export and driver partnerships.",
};

export default function FaqPage() {
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
          {faqCategories.map((cat) => (
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

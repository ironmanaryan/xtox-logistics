import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { ArrowRight, CalendarDays, Clock3 } from "lucide-react";
import { articles } from "@/data/resources";

export const metadata: Metadata = {
  title: "Articles",
  description:
    "Practical guides on vehicle selection, customs documentation, damage-free moving and cold-chain logistics from the XtoX desk.",
};

export default function ArticlesPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Resources · Articles"
          title="Guides from the"
          highlight="logistics desk."
          description="No fluff — field-tested playbooks on shipping, moving and exporting from India."
        />
        <div className="section-pad grid gap-5 pb-20 md:grid-cols-2">
          {articles.map((a) => (
            <article key={a.slug} className="card flex flex-col p-6">
              <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                <span className="rounded-full bg-brand-yellow px-3 py-1 text-brand-black">{a.category}</span>
                <span className="flex items-center gap-1">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden /> {a.readTime}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {a.date}
                </span>
              </div>
              <h2 className="mt-4 text-lg font-extrabold leading-snug">{a.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{a.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-black">
                Read article
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
              </span>
            </article>
          ))}
        </div>

        <div className="section-pad pb-20">
          <div className="rounded-3xl border border-line bg-neutral-50 p-8 text-center">
            <p className="text-sm text-muted">Have a topic you want covered?</p>
            <Link href="/#cta" className="btn-primary mt-3">
              Ask our desk →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

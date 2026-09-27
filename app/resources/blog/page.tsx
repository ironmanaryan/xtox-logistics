import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { blogPosts } from "@/data/resources";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "News, operations playbooks and industry analysis from XtoX Logistics — monsoon shipping, APEDA updates, GST explainers and more.",
};

export default function BlogPage() {
  const [featured, ...rest] = blogPosts;

  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Resources · Blog"
          title="From the"
          highlight="frontlines."
          description="What we're learning moving India's goods — published regularly."
        />

        <div className="section-pad pb-20">
          <article className="card p-8 lg:p-10">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold text-muted">
              <span className="rounded-full bg-brand-yellow px-3 py-1 text-brand-black">{featured.tag}</span>
              <span className="flex items-center gap-1">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {featured.date}
              </span>
              <span>Featured</span>
            </div>
            <h2 className="mt-4 max-w-2xl text-2xl font-extrabold leading-snug sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">{featured.excerpt}</p>
          </article>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {rest.map((b) => (
              <article key={b.slug} className="card flex flex-col p-6">
                <div className="flex items-center gap-3 text-xs font-semibold text-muted">
                  <span className="rounded-full bg-brand-yellow px-3 py-1 text-brand-black">{b.tag}</span>
                  <span className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" aria-hidden /> {b.date}
                  </span>
                </div>
                <h3 className="mt-4 font-extrabold leading-snug">{b.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{b.excerpt}</p>
              </article>
            ))}
          </div>

          <div className="mt-10 rounded-3xl border border-line bg-neutral-50 p-8 text-center">
            <p className="text-sm text-muted">Want these in your inbox?</p>
            <Link href="/#cta" className="btn-primary mt-3">
              Get updates →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

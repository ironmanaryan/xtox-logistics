import Link from "next/link";
import { FileText, Mail, MessageCircle, ShieldCheck } from "lucide-react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import type { LegalDoc } from "@/data/legal";

/**
 * Shared shell for legal pages (Terms, Privacy, Refund).
 * Renders a breadcrumb + hero, a sticky "on this page" table of contents
 * on desktop, and the policy sections with anchor links.
 */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">
                Home
              </Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Legal</span>
            </nav>

            <span className="chip-yellow mt-6">
              <FileText className="h-3.5 w-3.5" aria-hidden />
              Legal &amp; compliance
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              {doc.title}{" "}
              <span className="relative inline-block">
                <span className="relative z-10">{doc.highlight}</span>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow"
                />
              </span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              {doc.description}
            </p>
            <p className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">
              Last updated: {doc.updated}
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-10 py-12 lg:grid-cols-[260px_1fr] lg:py-16">
          {/* Table of contents */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 rounded-2xl border border-line bg-white p-5 shadow-card">
              <p className="eyebrow">On this page</p>
              <nav aria-label="Table of contents" className="mt-4 space-y-1.5">
                {doc.sections.map((s) => (
                  <a
                    key={s.id}
                    href={`#${s.id}`}
                    className="block rounded-lg px-2 py-1 text-sm font-medium text-muted transition-colors duration-200 hover:bg-neutral-50 hover:text-brand-black"
                  >
                    {s.heading}
                  </a>
                ))}
              </nav>
              <div className="mt-5 border-t border-line pt-5">
                <p className="text-xs font-semibold text-muted">
                  Need help with a booking?
                </p>
                <Link href="/support" className="btn-secondary mt-3 w-full !px-4 !py-2.5">
                  Contact support
                </Link>
              </div>
            </div>
          </aside>

          {/* Policy body */}
          <div className="max-w-3xl">
            <div className="rounded-2xl border border-line bg-neutral-50 p-5 sm:p-6">
              {doc.intro.map((p, i) => (
                <p
                  key={i}
                  className="text-sm leading-relaxed text-muted [&:not(:first-child)]:mt-3"
                >
                  {p}
                </p>
              ))}
            </div>

            {doc.sections.map((s) => (
              <section key={s.id} id={s.id} className="mt-10 scroll-mt-24">
                <h2 className="text-xl font-extrabold tracking-tight text-brand-black">
                  {s.heading}
                </h2>
                {s.paragraphs?.map((p, i) => (
                  <p
                    key={i}
                    className="mt-3 text-sm leading-relaxed text-muted sm:text-[15px]"
                  >
                    {p}
                  </p>
                ))}
                {s.bullets && (
                  <ul className="mt-4 space-y-2.5">
                    {s.bullets.map((b, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm leading-relaxed text-muted sm:text-[15px]"
                      >
                        <span
                          aria-hidden
                          className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow ring-1 ring-brand-black/20"
                        />
                        {b}
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

            {/* Footer actions */}
            <div className="mt-12 rounded-3xl border border-line bg-white p-6 shadow-card sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                <ShieldCheck className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="mt-4 text-lg font-extrabold tracking-tight">
                Questions about this policy?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                Our team is available Monday–Sunday, 8 AM – 10 PM, and replies to
                emails within 2 business hours. Please quote your booking or LR
                reference so we can help faster.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <a href="mailto:xtoxlogistics.info@gmail.com" className="btn-primary">
                  <Mail className="h-4 w-4" aria-hidden />
                  Email us
                </a>
                <a
                  href="https://wa.me/917875488307"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden />
                  WhatsApp
                </a>
                <Link href="/support" className="btn-secondary">
                  All contact options
                </Link>
              </div>
              <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 border-t border-line pt-5 text-sm">
                <Link href="/terms" className="font-semibold text-muted hover:text-brand-black">
                  Terms &amp; Conditions
                </Link>
                <Link href="/privacy" className="font-semibold text-muted hover:text-brand-black">
                  Privacy Policy
                </Link>
                <Link href="/refund-policy" className="font-semibold text-muted hover:text-brand-black">
                  Refund &amp; Cancellation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

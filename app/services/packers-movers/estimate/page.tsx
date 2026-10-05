import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackersCalculator from "@/components/PackersCalculator";
import { Calculator, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Moving Cost Calculator",
  description:
    "Calculate your packers & movers cost instantly — home size, distance, packing and insurance with full GST breakup.",
};

export default function PackersEstimatePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services/packers-movers" className="hover:text-brand-black">Packers &amp; Movers</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Cost Estimate</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Calculator className="h-3.5 w-3.5" aria-hidden />
              Instant estimate
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Moving cost{" "}
              <span className="relative inline-block">
                <span className="relative z-10">calculator.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Adjust home size, distance, packing and insurance to see your full
              price with GST. Final locked price comes after your free survey.
            </p>
          </div>
        </section>

        <div className="section-pad mx-auto max-w-3xl py-12 lg:py-16">
          <PackersCalculator />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Free pre-move survey", "No hidden charges", "GST bill included"].map((t) => (
              <div key={t} className="card flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-xs font-bold">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/services/packers-movers/book" className="btn-primary">
              Lock this price — get quote →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

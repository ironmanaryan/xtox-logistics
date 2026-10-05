import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmeRateCalculator from "@/components/SmeRateCalculator";
import { Calculator, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Freight Rate Calculator",
  description:
    "Calculate SME freight rates instantly — truck size, distance, part/full load, handling and insurance with full GST breakup.",
};

export default function SmeEstimatePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services/sme-transport" className="hover:text-brand-black">SME Transport</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Rate Calculator</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Calculator className="h-3.5 w-3.5" aria-hidden />
              Instant rates
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Freight rate{" "}
              <span className="relative inline-block">
                <span className="relative z-10">calculator.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Pick a truck, enter distance, toggle handling &amp; insurance —
              see the full GST breakup and per-km cost instantly.
            </p>
          </div>
        </section>

        <div className="section-pad mx-auto max-w-3xl py-12 lg:py-16">
          <SmeRateCalculator />
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {["Live GPS on every trip", "Digital POD in 24 hrs", "GST invoice included"].map((t) => (
              <div key={t} className="card flex items-center gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                  <ShieldCheck className="h-4 w-4" aria-hidden />
                </span>
                <p className="text-xs font-bold">{t}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/services/sme-transport/on-demand" className="btn-primary">
              Book at this rate →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

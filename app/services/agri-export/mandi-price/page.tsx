import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MandiPriceWidget from "@/components/MandiPriceWidget";
import { LineChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Mandi vs Export Prices",
  description:
    "Compare mandi and direct-export realizations for 12 crops — see the extra you earn, top buyer markets and export seasons.",
};

export default function AgriMandiPricePage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services/agri-export" className="hover:text-brand-black">Agri-Export</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Mandi Prices</span>
            </nav>
            <span className="chip-yellow mt-6">
              <LineChart className="h-3.5 w-3.5" aria-hidden />
              Price intelligence
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Mandi vs export,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">crop by crop.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Apni fasal select karo — mandi bhav vs direct-export realization,
              buyer markets aur season ek screen par.
            </p>
          </div>
        </section>

        <div className="section-pad py-12 lg:py-16">
          <MandiPriceWidget />
        </div>
      </main>
      <Footer />
    </>
  );
}

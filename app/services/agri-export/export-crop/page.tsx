import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriForm from "@/components/AgriForm";
import { Wheat, IndianRupee, FileCheck2, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Export Your Crop",
  description:
    "Export your harvest directly — crop, quantity and target market form with live export-vs-mandi realization, cold-chain and pack-house support.",
};

const NEXT = [
  { icon: IndianRupee, t: "Best-price plan", d: "Agri-expert confirms grade-wise export realization on call." },
  { icon: FileCheck2, t: "APEDA + lab papers", d: "RCMC, phytosanitary and residue testing arranged for your crop." },
  { icon: Truck, t: "Farm-gate pickup", d: "Reefer or dry truck at your farm, port freight and buyer delivery handled." },
];

export default function AgriExportCropPage() {
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
              <span className="text-brand-black">Export Crop</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Wheat className="h-3.5 w-3.5" aria-hidden />
              Farm to world
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Export your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">harvest.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              12 export crops, live mandi-vs-export calculation, cold-chain and
              pack-house support — middlemen skip karo, global price pao.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <AgriForm mode="export" />
          <aside className="space-y-4">
            <h2 className="text-xl font-extrabold">What happens next?</h2>
            {NEXT.map(({ icon: Icon, t, d }, i) => (
              <div key={t} className="card flex gap-4 p-5">
                <span className="text-xl font-extrabold text-brand-yellow [-webkit-text-stroke:1px_#111]">
                  0{i + 1}
                </span>
                <div>
                  <p className="flex items-center gap-2 font-bold">
                    <Icon className="h-4 w-4" aria-hidden /> {t}
                  </p>
                  <p className="mt-1 text-sm text-muted">{d}</p>
                </div>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-black p-6 text-white">
              <p className="font-extrabold text-brand-yellow">Papers pending?</p>
              <p className="mt-1 text-sm text-white/80">IEC, APEDA, phytosanitary — hum banwa denge.</p>
              <Link href="/services/agri-export/govt-docs" className="btn-primary mt-4 w-full">
                Govt. documents help
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

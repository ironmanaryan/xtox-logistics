import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EximForm from "@/components/EximForm";
import { Send, Globe2, FileCheck2, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Start Your Export",
  description:
    "Start an export shipment — APEDA registration help, phytosanitary and certificate of origin support, cold-chain for perishables, plus domestic outward movement.",
};

const NEXT = [
  { icon: Globe2, t: "Buyer-ready paperwork", d: "Invoice, packing list, origin & phytosanitary certificates prepared." },
  { icon: FileCheck2, t: "Shipping bill filed", d: "Customs clearance with drawback and RoDTEP documentation." },
  { icon: Truck, t: "Sailed & tracked", d: "FCL/LCL/air uplift with milestone updates till delivery." },
];

export default function ExportPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services/import-export" className="hover:text-brand-black">Import / Export</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Start Export</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Send className="h-3.5 w-3.5" aria-hidden />
              Goods outward
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Start your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">export.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              From farm gate or factory to global buyers — APEDA help,
              cold-chain for perishables, and drawback documentation included.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <EximForm mode="export" />
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
              <p className="font-extrabold text-brand-yellow">Documents ready?</p>
              <p className="mt-1 text-sm text-white/80">
                Upload invoice &amp; packing list — images auto-compress under 2 MB.
              </p>
              <Link href="/services/import-export/documents" className="btn-primary mt-4 w-full">
                Upload documents
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

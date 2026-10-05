import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmeForm from "@/components/SmeForm";
import { Zap, Timer, MapPin, FileCheck2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Book an On-Demand Truck",
  description:
    "Book a truck on demand for your business — Tata Ace to 32-ft container, live estimate, loading help and transit insurance options.",
};

const NEXT = [
  { icon: Timer, t: "Truck in 2–6 hrs", d: "Dispatcher confirms vehicle & driver on your phone." },
  { icon: MapPin, t: "Live GPS tracking", d: "Tracking link on WhatsApp from pickup to delivery." },
  { icon: FileCheck2, t: "Digital POD + GST bill", d: "POD within 24 hrs, GST invoice for your books." },
];

export default function SmeOnDemandPage() {
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
              <span className="text-brand-black">On-Demand</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Zap className="h-3.5 w-3.5" aria-hidden />
              Pay per trip
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Book a truck{" "}
              <span className="relative inline-block">
                <span className="relative z-10">on demand.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              One trip today, no commitment. Live estimate as you fill the form —
              Tata Ace to 32-ft container, part-load or full truck.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <SmeForm mode="on-demand" />
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
              <p className="font-extrabold text-brand-yellow">Regular lane?</p>
              <p className="mt-1 text-sm text-white/80">Lock monthly rates with a scheduled fleet contract.</p>
              <Link href="/services/sme-transport/contract" className="btn-primary mt-4 w-full">
                Get contract pricing
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

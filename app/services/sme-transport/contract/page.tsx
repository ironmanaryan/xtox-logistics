import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SmeForm from "@/components/SmeForm";
import { CalendarClock, UserCheck, Receipt, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Scheduled Fleet Contract",
  description:
    "Contract a scheduled fleet for fixed routes — locked monthly rates, priority peak capacity, named account manager and consolidated billing.",
};

const PERKS = [
  { icon: ShieldCheck, t: "Locked rates", d: "No surge for the full contract period." },
  { icon: UserCheck, t: "Named account manager", d: "One owner with weekly SLA reports." },
  { icon: Receipt, t: "Consolidated billing", d: "Single weekly/monthly GST invoice for all trips." },
];

export default function SmeContractPage() {
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
              <span className="text-brand-black">Contract Fleet</span>
            </nav>
            <span className="chip-yellow mt-6">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden />
              Most popular
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Contract your{" "}
              <span className="relative inline-block">
                <span className="relative z-10">scheduled fleet.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Fixed routes, recurring volume? Get dedicated vehicles on schedule
              with locked rates — enterprise-grade transport, SME-friendly cost.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <SmeForm mode="contract" />
          <aside className="space-y-4">
            <h2 className="text-xl font-extrabold">Every contract includes</h2>
            {PERKS.map(({ icon: Icon, t, d }, i) => (
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
              <p className="font-extrabold text-brand-yellow">Just one trip?</p>
              <p className="mt-1 text-sm text-white/80">No commitment — book a single truck on demand.</p>
              <Link href="/services/sme-transport/on-demand" className="btn-primary mt-4 w-full">
                Book on-demand
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

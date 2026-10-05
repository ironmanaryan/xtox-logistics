import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { images } from "@/data/images";
import { TRUCKS } from "@/data/fleet";
import {
  Zap,
  Calculator,
  CalendarClock,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "SME Transport Support",
  description:
    "On-demand trucks, instant freight rates and scheduled fleet contracts for SMEs — live tracking, digital PODs and GST billing.",
};

const entryCards = [
  {
    href: "/services/sme-transport/on-demand",
    icon: Zap,
    title: "On-Demand Truck",
    desc: "One trip, no commitment. Live estimate as you fill — truck at gate in 2–6 hrs.",
    meta: "Pay per trip",
  },
  {
    href: "/services/sme-transport/estimate",
    icon: Calculator,
    title: "Rate Calculator",
    desc: "Truck, distance, part/full load — full GST breakup and per-km cost instantly.",
    meta: "Free • 30 seconds",
  },
  {
    href: "/services/sme-transport/contract",
    icon: CalendarClock,
    title: "Contract Fleet",
    desc: "Fixed routes on schedule. Locked rates, priority capacity, account manager.",
    meta: "Most popular",
  },
];

const modes = [
  {
    name: "On-Demand",
    tag: "Pay per trip",
    best: "Best for fluctuating, ad-hoc loads",
    icon: Zap,
    features: [
      "Vehicle at your gate in 2–6 hrs",
      "Full fleet menu: Tata Ace to 32-ft SXL",
      "Per-trip transparent pricing",
      "Live GPS tracking link on WhatsApp",
      "Digital POD within 24 hrs of delivery",
      "No monthly commitment",
    ],
    highlight: false,
  },
  {
    name: "Scheduled Fleet",
    tag: "Contracted lanes",
    best: "Best for fixed routes & recurring volume",
    icon: CalendarClock,
    features: [
      "Dedicated vehicles on fixed schedules",
      "Locked monthly rates — no surge",
      "Priority capacity in peak season",
      "Named account manager & SLA reports",
      "Consolidated monthly billing",
      "Custom vehicle branding available",
    ],
    highlight: true,
  },
];

const faqs = [
  {
    q: "How fast can I get a truck?",
    a: "On-demand bookings are dispatched in 2–6 hours in most cities. Open the on-demand page, fill your lane and timing — the dispatcher confirms driver details on your phone.",
  },
  {
    q: "What is part-load (PTL) vs full truck (FTL)?",
    a: "FTL reserves the whole truck for your goods. PTL shares truck space with other shipments on the same lane — roughly 40% cheaper, with 1–2 extra days in transit.",
  },
  {
    q: "How do contract rates work?",
    a: "You lock a per-trip rate for the contract period (1–12 months). No surge in peak season, priority vehicles, one consolidated GST invoice and a named account manager.",
  },
  {
    q: "Do I get POD and GST bills?",
    a: "Yes — digital POD within 24 hours of every delivery and a proper GST invoice for your books, on both on-demand trips and contracts.",
  },
  {
    q: "Can I track my goods live?",
    a: "Every truck is GPS-tracked. You get a live tracking link on WhatsApp from pickup to delivery, plus milestone updates for contract lanes.",
  },
  {
    q: "Do you handle loading and unloading?",
    a: "Yes — add loading/unloading help while booking or in the rate calculator. Trained helpers come with the vehicle, charged upfront with no surprises.",
  },
];

export default function SmeTransportPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-brand-black text-white">
          <Image
            src={images.loadingDock.src}
            alt={images.loadingDock.alt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/80" />
          <div className="section-pad relative pb-28 pt-14 sm:pt-16 lg:pb-32 lg:pt-20">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-white/60">
              <Link href="/" className="hover:text-white">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link href="/#services" className="hover:text-white">
                Services
              </Link>
              <span className="mx-2">/</span>
              <span className="text-brand-yellow">SME Transport</span>
            </nav>

            <h1 className="mx-auto mt-6 max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Your growth partner on{" "}
              <span className="bg-brand-yellow px-2 text-brand-black">every lane.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80 sm:text-base">
              One truck today or a contracted fleet every Monday — enterprise-grade
              transport without enterprise overheads.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/services/sme-transport/on-demand" className="btn-primary !px-8 !py-4">
                <Zap className="h-5 w-5" aria-hidden />
                Book On-Demand
              </Link>
              <Link
                href="/services/sme-transport/contract"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
              >
                <CalendarClock className="h-5 w-5" aria-hidden />
                Contract Fleet
              </Link>
            </div>
          </div>
        </section>

        {/* ---------- Entry cards (each opens its own page) ---------- */}
        <div className="section-pad relative z-10 -mt-20 lg:-mt-24">
          <div className="grid gap-4 md:grid-cols-3">
            {entryCards.map(({ href, icon: Icon, title, desc, meta }) => (
              <Link key={href} href={href} className="card group p-6 sm:p-7">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h2 className="mt-4 text-lg font-extrabold">{title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{desc}</p>
                <p className="mt-3 flex items-center justify-between">
                  <span className="chip-yellow">{meta}</span>
                  <span className="inline-flex items-center gap-1 text-sm font-extrabold transition-transform duration-300 group-hover:translate-x-1">
                    Open <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* ---------- On-demand vs scheduled ---------- */}
        <section className="section-pad py-14">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Choose your fleet model
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            Start per-trip, upgrade to contract when your lane repeats — same
            account, same tracking, same POD discipline.
          </p>
          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            {modes.map((m) => (
              <div
                key={m.name}
                className={`card relative p-7 ${m.highlight ? "border-brand-black ring-2 ring-brand-yellow" : ""}`}
              >
                {m.highlight && (
                  <span className="absolute -top-3 right-6 rounded-full bg-brand-yellow px-3 py-1 text-xs font-extrabold">
                    MOST POPULAR
                  </span>
                )}
                <div className="flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                    <m.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-xl font-extrabold">{m.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{m.tag}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-semibold">{m.best}</p>
                <ul className="mt-4 space-y-2.5">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-extrabold text-brand-black">
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href={m.highlight ? "/services/sme-transport/contract" : "/services/sme-transport/on-demand"}
                  className={m.highlight ? "btn-primary mt-6 w-full" : "btn-secondary mt-6 w-full"}
                >
                  {m.highlight ? "Get contract pricing" : "Book on-demand"}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Fleet table ---------- */}
        <section className="border-y border-line bg-neutral-50/60">
          <div className="section-pad py-14">
            <h2 className="text-2xl font-extrabold tracking-tight">Fleet we deploy</h2>
            <div className="card mt-6 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                    <th className="px-5 py-3.5 font-bold">Vehicle</th>
                    <th className="px-5 py-3.5 font-bold">Capacity</th>
                    <th className="hidden px-5 py-3.5 font-bold sm:table-cell">Typical use</th>
                  </tr>
                </thead>
                <tbody>
                  {TRUCKS.map((f) => (
                    <tr key={f.key} className="border-b border-line last:border-0 transition-colors hover:bg-neutral-50">
                      <td className="px-5 py-3.5 font-semibold">{f.name}</td>
                      <td className="px-5 py-3.5 text-muted">{f.capacity}</td>
                      <td className="hidden px-5 py-3.5 text-muted sm:table-cell">{f.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="section-pad py-14">
          <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {faqs.map((f) => (
              <div key={f.q} className="card p-6">
                <h3 className="font-bold">{f.q}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section className="section-pad pb-20">
          <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand-black p-8 text-white sm:flex-row sm:p-10">
            <div>
              <h3 className="text-xl font-extrabold sm:text-2xl">
                Tell us your lane — <span className="text-brand-yellow">we&apos;ll price it in minutes.</span>
              </h3>
              <p className="mt-1.5 text-sm text-white/70">
                Average response time: under 2 business hours.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services/sme-transport/on-demand" className="btn-primary">
                Book a truck
              </Link>
              <Link
                href="/services/sme-transport/estimate"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-yellow hover:text-brand-yellow"
              >
                Check rates
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PackersQuoteForm from "@/components/PackersQuoteForm";
import { ClipboardList, PhoneCall, FileText, Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Get Your Moving Quote",
  description:
    "Get a fixed quote for your home or office move — pickup, drop, date and home size. Free survey, GST billing, 10–20% advance only.",
};

const NEXT_STEPS = [
  { icon: PhoneCall, t: "Survey call", d: "Executive calls within 2 business hours for a video survey." },
  { icon: FileText, t: "Locked GST bill", d: "Item-wise quotation — packing, loading, transport, insurance." },
  { icon: Truck, t: "Move & track", d: "10–20% advance, live GPS tracking, pay balance after delivery." },
];

export default function PackersBookPage() {
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
              <span className="text-brand-black">Get Quote</span>
            </nav>
            <span className="chip-yellow mt-6">
              <ClipboardList className="h-3.5 w-3.5" aria-hidden />
              Full home shifting
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Get your fixed{" "}
              <span className="relative inline-block">
                <span className="relative z-10">moving quote.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Fill pickup &amp; drop, shifting date and home size — 60 seconds,
              no OTP, no spam. Starting at <strong className="text-brand-black">₹7,499</strong>.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <PackersQuoteForm />
          <aside className="space-y-4">
            <h2 className="text-xl font-extrabold">What happens next?</h2>
            {NEXT_STEPS.map(({ icon: Icon, t, d }, i) => (
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
              <p className="font-extrabold text-brand-yellow">Prefer to talk?</p>
              <p className="mt-1 text-sm text-white/80">
                Call our moving desk — we&apos;ll fill the form with you on the call.
              </p>
              <Link href="/support" className="btn-primary mt-4 w-full">
                Contact support
              </Link>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

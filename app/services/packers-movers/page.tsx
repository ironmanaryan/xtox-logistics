import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceCtaBand from "@/components/ServiceCtaBand";
import PackersCalculator from "@/components/PackersCalculator";
import PackersInquiryBar from "@/components/PackersInquiryBar";
import TruckBookingWidget from "@/components/TruckBookingWidget";
import { images } from "@/data/images";
import {
  ClipboardList,
  PhoneCall,
  FileText,
  CreditCard,
  Truck,
  ShieldCheck,
  IndianRupee,
  Users,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Packers & Movers",
  description:
    "Stress-free house & office shifting with XtoX — instant quote, free survey, GST billing and GPS-tracked moves across India.",
};

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "100% Damage-Free Shifting",
    text: "Safety at every step — graded packing material and trained crews on all moves.",
  },
  {
    icon: IndianRupee,
    title: "Affordable & Assured",
    text: "Reliable packers and movers services at economical prices with transit insurance.",
  },
  {
    icon: Users,
    title: "Expert Handling",
    text: "Professionally trained experts for damage-free packing, loading and setup.",
  },
];

const steps = [
  {
    n: "01",
    icon: ClipboardList,
    title: "Submit Your Inquiry",
    text: "Fill in your pickup & drop locations, shifting date, home size (1/2/3 BHK) and contact number. It takes less than a minute.",
  },
  {
    n: "02",
    icon: PhoneCall,
    title: "Instant Quote & Survey Call",
    text: "Get a rough estimate instantly. Our executive then calls you for a quick video or in-person survey to discuss exact requirements.",
  },
  {
    n: "03",
    icon: FileText,
    title: "Official GST Bill & Pricing",
    text: "We confirm your item list and share a final quotation — packing, loading, transport and insurance, billed transparently with GST.",
  },
  {
    n: "04",
    icon: CreditCard,
    title: "Advance & Slot Booking",
    text: "Pay just 10–20% advance to lock your slot. Instant confirmation on WhatsApp & Email with your vehicle number.",
  },
  {
    n: "05",
    icon: Truck,
    title: "Shifting Day & Live Tracking",
    text: "Our team arrives on time for packing & loading. Track your move live on GPS, verify everything at delivery, then pay the balance.",
  },
];

const faqs = [
  {
    q: "How is the cost calculated?",
    a: "Move size, distance, packing material and insurance. The bar above gives an instant starting price and the calculator below a detailed range — final price is locked after the free survey.",
  },
  {
    q: "How much advance do I need to pay?",
    a: "Only 10–20% advance to book your slot. The balance is paid after delivery, once you have checked all your goods.",
  },
  {
    q: "How fast can you move?",
    a: "Local city moves: same/next day. Intercity: pickup within 48 hrs of confirmation on most lanes.",
  },
  {
    q: "Is my goods' safety guaranteed?",
    a: "Every move carries all-risk transit insurance and a named move manager reachable on WhatsApp through the move.",
  },
  {
    q: "Can I track my shipment live?",
    a: "Yes — every vehicle is GPS-tracked. You get a live tracking link on moving day and the vehicle number in advance on WhatsApp & Email.",
  },
  {
    q: "Do I get a proper bill?",
    a: "Yes. You receive an official GST bill/quotation with item-wise breakup of packing, loading, transport and insurance charges.",
  },
];

export default function PackersMoversPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero (Porter-style, XtoX theme) ---------- */}
        <section className="relative overflow-hidden bg-brand-black text-white">
          <Image
            src={images.movingBoxes.src}
            alt={images.movingBoxes.alt}
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
              <span className="text-brand-yellow">Packers &amp; Movers</span>
            </nav>

            <h1 className="mx-auto mt-6 max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Best Packers and Movers{" "}
              <span className="bg-brand-yellow px-2 text-brand-black">in India</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80 sm:text-base">
              Stress-free house shifting with XtoX Packers and Movers.
              Starting at <strong className="text-brand-yellow">₹7,499</strong>.
            </p>
          </div>
        </section>

        {/* ---------- Inquiry bar overlapping hero ---------- */}
        <div id="inquiry" className="section-pad relative z-10 -mt-20 scroll-mt-24 lg:-mt-24">
          <PackersInquiryBar />
        </div>

        {/* ---------- Trust badges ---------- */}
        <section className="section-pad py-14">
          <h2 className="text-center text-2xl font-extrabold tracking-tight sm:text-3xl">
            House Shifting Services with the Best Packers and Movers in India
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {trustPoints.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card p-6 text-center">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-extrabold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- 5-step booking process ---------- */}
        <section className="border-y border-line bg-neutral-50/60">
          <div className="section-pad py-14">
            <p className="eyebrow">How it works</p>
            <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
              From inquiry to delivery in{" "}
              <span className="bg-brand-yellow px-2">5 simple steps</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
              Transparent pricing, one move manager, and live tracking —
              you always know what happens next.
            </p>

            <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n} className="card flex gap-4 p-5 sm:p-6">
                  <span className="text-2xl font-extrabold text-brand-yellow [-webkit-text-stroke:1px_#111]">
                    {s.n}
                  </span>
                  <div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                      <s.icon className="h-5 w-5" aria-hidden />
                    </span>
                    <h3 className="mt-3 font-extrabold">{s.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
                  </div>
                </li>
              ))}
              <li className="flex flex-col justify-between gap-4 rounded-2xl bg-brand-black p-5 text-white sm:p-6">
                <div>
                  <p className="text-2xl font-extrabold text-brand-yellow">Ready?</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/80">
                    Check your starting price in 60 seconds — no OTP, no spam calls.
                  </p>
                </div>
                <a href="#inquiry" className="btn-primary w-full">
                  Start my inquiry
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </li>
            </ol>
          </div>
        </section>

        {/* ---------- Express truck booking ---------- */}
        <section id="express" className="section-pad scroll-mt-24 py-14">
          <p className="eyebrow">Express option</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
            Only need a truck? Book in{" "}
            <span className="bg-brand-yellow px-2">4 quick steps</span>
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            Pick your vehicle — 3-Wheeler, Tata Ace, 14ft Truck or full BHK
            shifting — see the fixed price upfront, add helpers if needed, and
            track your truck live. No hidden charges, ever.
          </p>
          <div className="mt-8">
            <TruckBookingWidget />
          </div>
        </section>

        {/* ---------- Detailed calculator + FAQ ---------- */}
        <section id="estimate" className="section-pad scroll-mt-24 py-14">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <p className="eyebrow">Detailed estimate</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Fine-tune your moving cost
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
                Your home size from the inquiry above is carried over automatically.
                Adjust distance, packing and insurance to see the full GST breakup —
                the final locked price comes after your free survey.
              </p>
              <div className="mt-6 space-y-4">
                {[
                  "Free pre-move video survey",
                  "GPS-tracked fleet on every move",
                  "All-risk transit insurance available",
                ].map((t) => (
                  <div key={t} className="card flex items-center gap-4 p-5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                      <ShieldCheck className="h-5 w-5" aria-hidden />
                    </span>
                    <p className="text-sm font-bold">{t}</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <PackersCalculator />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {faqs.map((f) => (
                <div key={f.q} className="card p-6">
                  <h3 className="font-bold">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ServiceCtaBand message="Planning a move? Lock your slot this week." />
      </main>
      <Footer />
    </>
  );
}

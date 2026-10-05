import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { images } from "@/data/images";
import {
  Wheat,
  Landmark,
  LineChart,
  Snowflake,
  Warehouse,
  FileBarChart2,
  Leaf,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Farmer Agri-Export",
  description:
    "Export your crop directly, get government document help, and compare mandi vs export prices — cold-chain from farm gate to foreign shelf.",
};

const entryCards = [
  {
    href: "/services/agri-export/export-crop",
    icon: Wheat,
    title: "Export My Crop",
    desc: "Crop, quantity, target market — live export-vs-mandi calculation + cold-chain.",
    meta: "12 export crops",
  },
  {
    href: "/services/agri-export/govt-docs",
    icon: Landmark,
    title: "Govt. Documents",
    desc: "IEC, APEDA, FSSAI, phytosanitary — tick what you need, upload Aadhaar/7-12.",
    meta: "8 docs handled",
  },
  {
    href: "/services/agri-export/mandi-price",
    icon: LineChart,
    title: "Mandi Prices",
    desc: "Mandi bhav vs direct-export price, buyer markets and seasons, crop by crop.",
    meta: "Free intelligence",
  },
];

const coldChain = [
  { icon: Snowflake, t: "Pre-cool & reefer fleet", d: "Produce pre-cooled at farm gate, moved in 2–8°C / 0–4°C reefer trucks with live temperature logging." },
  { icon: Warehouse, t: "Cold storage buffers", d: "Partner cold rooms at major mandis and ports to absorb market-day delays without quality loss." },
  { icon: FileBarChart2, t: "Temperature proof", d: "Digital temperature records shared with buyers — premium compliance for EU/US produce." },
  { icon: Leaf, t: "Shelf-life extension", d: "Controlled transit cuts spoilage from 20–30% to under 5% on perishables like grapes, bananas and vegetables." },
];

const benefits = [
  { t: "APEDA registration support", d: "End-to-end help: RCMC, phytosanitary certificate, residue testing and buyer documentation." },
  { t: "Inter-state market pricing", d: "Daily mandi price feeds from 60+ markets so you sell where realization is highest." },
  { t: "Direct buyer connect", d: "Skip 3–4 middle layers — verified exporters and importers for your crop and season." },
  { t: "Export incentives guidance", d: "RoDTEP and duty-drawback documentation handled with your bank and CHA." },
  { t: "Shared container cost", d: "Small lots consolidated into LCL / mixed reefer containers — export economics without full-container volume." },
  { t: "Payment security", d: "Structured milestones with escrow advisory so farmers are paid before title transfers." },
];

const faqs = [
  {
    q: "Mere paas IEC/APEDA nahi hai. Kya export ho sakta hai?",
    a: "Haan. Govt. documents page par jo chahiye tick karo — hum IEC aur APEDA RCMC banwane me poori madad karte hain, sirf sarkari fees aapki.",
  },
  {
    q: "Chhota kisan hoon — 50 quintal se export possible hai?",
    a: "Bilkul. Chhote lots ko LCL / mixed reefer containers me consolidate karte hain — poore container ka kharcha nahi, phir bhi export price.",
  },
  {
    q: "Kaunse documents upload karne honge?",
    a: "Crop ke liye fasal/farm ki photos; documents ke liye Aadhaar, PAN aur 7/12 ya land papers. Photos auto-compress hokar 2 MB ke andar upload hoti hain.",
  },
  {
    q: "Payment kaise milega? Dhokha to nahi hoga?",
    a: "Structured milestones + escrow advisory — title transfer se pehle payment. Har step par hamara agri-expert aapke saath rehta hai.",
  },
  {
    q: "Cold-chain meri fasal ke liye zaroori hai?",
    a: "Grapes, mango, banana, pomegranate jaise fresh produce ke liye haan — reefer farm gate se lagta hai. Grains aur spices ke liye dry container kaafi hai.",
  },
  {
    q: "Mandi se kitna zyada milega?",
    a: "Crop par nirbhar — grapes me ~2x tak ka antar hota hai. Mandi-price page par apni fasal select karke live comparison dekho.",
  },
];

export default function AgriExportPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-brand-black text-white">
          <Image
            src={images.wheatField.src}
            alt={images.wheatField.alt}
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
              <span className="text-brand-yellow">Agri-Export</span>
            </nav>

            <h1 className="mx-auto mt-6 max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Your harvest deserves{" "}
              <span className="bg-brand-yellow px-2 text-brand-black">global prices.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80 sm:text-base">
              Middlemen skip karo — direct export, sarkari kagaz me madad, aur
              mandi-vs-export price intelligence. Pehli call bilkul free.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/services/agri-export/export-crop" className="btn-primary !px-8 !py-4">
                <Wheat className="h-5 w-5" aria-hidden />
                Export My Crop
              </Link>
              <Link
                href="/services/agri-export/mandi-price"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
              >
                <LineChart className="h-5 w-5" aria-hidden />
                Check Mandi Prices
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

        {/* ---------- Cold-chain ---------- */}
        <section className="section-pad py-14">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Cold-chain that protects every rupee
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {coldChain.map(({ icon: Icon, t, d }) => (
              <div key={t} className="card p-6">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-extrabold">{t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- Benefits ---------- */}
        <section className="border-y border-line bg-neutral-50/60">
          <div className="section-pad py-14">
            <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
              APEDA + market pricing benefits
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
              Built for FPOs, farmer-producer companies and agri-traders moving
              from mandi sales to direct export contracts.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b) => (
                <div key={b.t} className="card p-6">
                  <span className="chip-yellow">BENEFIT</span>
                  <h3 className="mt-3 font-extrabold">{b.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{b.d}</p>
                </div>
              ))}
            </div>

            <div className="mt-10 rounded-3xl bg-brand-black p-8 text-white">
              <h2 className="text-xl font-extrabold tracking-tight">
                Farm → Port → World, <span className="text-brand-yellow">in 5 steps</span>
              </h2>
              <div className="mt-6 grid gap-6 sm:grid-cols-5">
                {["Harvest & pre-cool", "Collection centre QC", "Pack-house & docs", "Reefer to port", "Export & payment"].map(
                  (s, i) => (
                    <div key={s} className="text-center">
                      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-yellow text-sm font-extrabold text-brand-black">
                        {i + 1}
                      </span>
                      <p className="mt-2 text-sm font-bold">{s}</p>
                    </div>
                  )
                )}
              </div>
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
                Harvest season coming? <span className="text-brand-yellow">Set up your export lane now.</span>
              </h3>
              <p className="mt-1.5 text-sm text-white/70">
                Pehli call free — price, papers aur plan ek saath.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services/agri-export/export-crop" className="btn-primary">
                Export my crop
              </Link>
              <Link
                href="/services/agri-export/govt-docs"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-yellow hover:text-brand-yellow"
              >
                Govt. docs help
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

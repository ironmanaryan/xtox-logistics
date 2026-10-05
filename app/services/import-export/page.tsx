import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { images } from "@/data/images";
import {
  Ship,
  Send,
  FileUp,
  FileCheck2,
  Timer,
  Globe2,
  Warehouse,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Import / Export Assistance",
  description:
    "End-to-end EXIM support: start import/export shipments, upload documents with auto-compression, customs clearance, FCL/LCL/air freight and door-to-door delivery.",
};

const entryCards = [
  {
    href: "/services/import-export/import",
    icon: Ship,
    title: "Start Import",
    desc: "International inward with IEC, AD code & duty help — or domestic inward with GST support.",
    meta: "FCL · LCL · Air",
  },
  {
    href: "/services/import-export/export",
    icon: Send,
    title: "Start Export",
    desc: "APEDA help, origin & phytosanitary certificates, cold-chain for perishables.",
    meta: "Drawback included",
  },
  {
    href: "/services/import-export/documents",
    icon: FileUp,
    title: "Upload Documents",
    desc: "Invoice, packing list, BL & certificates. Photos auto-compress under 2 MB.",
    meta: "PDF · JPG · PNG",
  },
];

const roadmap = [
  { step: "Step 1", title: "IEC & compliance setup", text: "Importer Exporter Code, GST, AD-code registration and HS-code classification guidance before first shipment." },
  { step: "Step 2", title: "Documentation", text: "Commercial invoice, packing list, bill of lading / AWB, certificate of origin — prepared and double-checked by our EXIM desk." },
  { step: "Step 3", title: "Customs clearance", text: "Licensed CHB files the bill of entry / shipping bill; duty computation, examination and out-of-charge handled." },
  { step: "Step 4", title: "Freight booking", text: "FCL, LCL or air uplift on the best transit-vs-cost lane from our carrier contracts." },
  { step: "Step 5", title: "Port handling", text: "Container pickup, stuffing/de-stuffing, CHA coordination and port storage minimised." },
  { step: "Step 6", title: "Door delivery", text: "Final-mile trucking to your warehouse with POD closure and duty-drawback documentation support." },
];

const faqs = [
  {
    q: "I don't have an IEC. Can I still import/export?",
    a: "Yes. Start your shipment on the import/export page without an IEC — our desk files it for you (usually 2–3 working days) while freight is being arranged.",
  },
  {
    q: "Which documents do I need to upload?",
    a: "Commercial invoice, packing list and bill of lading / AWB for every shipment, plus IEC and GST once. Exports may need certificate of origin and phytosanitary papers — the documents page shows the full checklist.",
  },
  {
    q: "My scanned photos are 5–8 MB. Will upload fail?",
    a: "No. JPG/PNG photos are auto-compressed to 1–2 MB in your browser before upload. Only PDFs must already be under 2 MB, since PDFs can't be compressed in-browser.",
  },
  {
    q: "Do you handle domestic (India) movements too?",
    a: "Yes. Both import and export forms have a Domestic scope — interstate transport with GST billing, e-way bill support and part/full truck options.",
  },
  {
    q: "How long does customs clearance take?",
    a: "Typically 48 hours with pre-alerts filed before cargo arrival. Our CHB tracks examination and out-of-charge so port storage stays minimal.",
  },
  {
    q: "Can you export perishables and farm produce?",
    a: "Yes — reefer containers, APEDA registration guidance and phytosanitary certification are built into the export flow for agri and food products.",
  },
];

export default function ImportExportPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ---------- Hero ---------- */}
        <section className="relative overflow-hidden bg-brand-black text-white">
          <Image
            src={images.containerCrane.src}
            alt={images.containerCrane.alt}
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
              <span className="text-brand-yellow">Import / Export</span>
            </nav>

            <h1 className="mx-auto mt-6 max-w-3xl text-center text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Customs, freight, paperwork —{" "}
              <span className="bg-brand-yellow px-2 text-brand-black">fully handled.</span>
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-center text-sm leading-relaxed text-white/80 sm:text-base">
              One EXIM desk for imports and exports — international customs or
              domestic movement, with live milestone updates on every shipment.
            </p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/services/import-export/import" className="btn-primary !px-8 !py-4">
                <Ship className="h-5 w-5" aria-hidden />
                Start Import
              </Link>
              <Link
                href="/services/import-export/export"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 px-8 py-4 text-base font-bold text-white transition-all duration-300 hover:border-brand-yellow hover:bg-brand-yellow hover:text-brand-black"
              >
                <Send className="h-5 w-5" aria-hidden />
                Start Export
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

        {/* ---------- Roadmap ---------- */}
        <section className="section-pad py-14">
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            Customs clearance roadmap
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-muted sm:text-base">
            First shipment or fiftieth — this is the exact path every XtoX
            consignment follows, with owners and timelines at each step.
          </p>

          <ol className="mt-8 space-y-0">
            {roadmap.map((r, i) => (
              <li key={r.step} className="relative flex gap-5 pb-8 last:pb-0">
                {i < roadmap.length - 1 && (
                  <span aria-hidden className="absolute left-[19px] top-10 h-full w-0.5 bg-line" />
                )}
                <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow text-sm font-extrabold">
                  {i + 1}
                </span>
                <div className="card flex-1 p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-muted">{r.step}</p>
                  <h3 className="mt-1 font-extrabold">{r.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: FileCheck2, t: "100% doc accuracy check", d: "Every file verified against HS code and LUT before filing." },
              { icon: Timer, t: "48-hr typical clearance", d: "Pre-alerts and PNOR tracking keep customs dwell low." },
              { icon: Globe2, t: "FCL · LCL · Air", d: "Carrier contracts on 40+ global trade lanes." },
              { icon: Warehouse, t: "True door-to-door", d: "Factory to buyer's warehouse on a single invoice." },
            ].map(({ icon: Icon, t, d }) => (
              <div key={t} className="card p-5">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-3 text-sm font-extrabold">{t}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- FAQ ---------- */}
        <section className="border-t border-line bg-neutral-50/60">
          <div className="section-pad py-14">
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

        {/* ---------- CTA ---------- */}
        <section className="section-pad py-14">
          <div className="flex flex-col items-center justify-between gap-5 rounded-3xl bg-brand-black p-8 text-white sm:flex-row sm:p-10">
            <div>
              <h3 className="text-xl font-extrabold sm:text-2xl">
                Shipping your first container? <span className="text-brand-yellow">We&apos;ll clear the path.</span>
              </h3>
              <p className="mt-1.5 text-sm text-white/70">
                IEC help, duty estimate and freight options in one call.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/services/import-export/import" className="btn-primary">
                Start Import
              </Link>
              <Link
                href="/services/import-export/documents"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:border-brand-yellow hover:text-brand-yellow"
              >
                Upload documents
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

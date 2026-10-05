import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgriForm from "@/components/AgriForm";
import { Landmark, PhoneCall, FileCheck2, BadgeCheck } from "lucide-react";
import { GOVT_DOCS } from "@/data/agri";

export const metadata: Metadata = {
  title: "Government Documents Help",
  description:
    "IEC, APEDA RCMC, FSSAI, phytosanitary, certificate of origin and lab reports — pick what you need, upload Aadhaar/PAN/7-12, we handle the filing.",
};

const HOW = [
  { icon: PhoneCall, t: "Free guidance call", d: "APEDA mitra explains exactly which papers your crop needs." },
  { icon: FileCheck2, t: "We file for you", d: "Applications, lab slots and follow-ups handled end-to-end." },
  { icon: BadgeCheck, t: "Certificates delivered", d: "Digital + courier copies, tracked in your shipment file." },
];

export default function AgriGovtDocsPage() {
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
              <span className="text-brand-black">Govt. Documents</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Landmark className="h-3.5 w-3.5" aria-hidden />
              Sarkari kagaz, zero tension
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Government documents,{" "}
              <span className="relative inline-block">
                <span className="relative z-10">fully assisted.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              IEC se lekar phytosanitary tak — kaunsa document chahiye tick karo,
              Aadhaar/PAN/7-12 upload karo. Filing hum karenge, sirf sarkari fees aapki.
            </p>
          </div>
        </section>

        <div className="section-pad py-12 lg:py-16">
          <h2 className="text-xl font-extrabold">8 documents we handle for farmers</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {GOVT_DOCS.map((d) => (
              <div key={d.key} className="card p-5">
                <span className="chip-yellow">{d.who}</span>
                <h3 className="mt-2.5 text-sm font-extrabold">{d.name}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted">{d.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr]">
            <AgriForm mode="govt-docs" />
            <aside className="space-y-4">
              <h2 className="text-xl font-extrabold">How it works</h2>
              {HOW.map(({ icon: Icon, t, d }, i) => (
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
                <p className="font-extrabold text-brand-yellow">Papers ready?</p>
                <p className="mt-1 text-sm text-white/80">Start your crop export right away.</p>
                <Link href="/services/agri-export/export-crop" className="btn-primary mt-4 w-full">
                  Export my crop
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

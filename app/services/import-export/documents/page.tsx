import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DocumentUploader from "@/components/DocumentUploader";
import { FileUp, Ship, Send } from "lucide-react";

export const metadata: Metadata = {
  title: "Upload Shipment Documents",
  description:
    "Upload commercial invoice, packing list, bill of lading and certificates. Photos auto-compress to under 2 MB right in your browser.",
};

const CHECKLIST: { title: string; docs: string[] }[] = [
  {
    title: "For imports",
    docs: ["Commercial invoice", "Packing list", "Bill of Lading / AWB", "IEC copy (one-time)", "GST registration (one-time)", "Insurance policy (if CIF)"],
  },
  {
    title: "For exports",
    docs: ["Commercial invoice", "Packing list", "Certificate of Origin", "Phytosanitary (agri goods)", "APEDA / export promotion copy", "LUT / GST refund papers"],
  },
];

export default function DocumentsPage() {
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
              <span className="text-brand-black">Documents</span>
            </nav>
            <span className="chip-yellow mt-6">
              <FileUp className="h-3.5 w-3.5" aria-hidden />
              Paperwork, minus the pain
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Upload shipment{" "}
              <span className="relative inline-block">
                <span className="relative z-10">documents.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              Photos bigger than 2 MB are <strong className="text-brand-black">auto-compressed to 1–2 MB</strong> in
              your browser before upload. PDFs must already be under 2 MB.
            </p>
          </div>
        </section>

        <div className="section-pad grid gap-8 py-12 lg:grid-cols-[1.4fr_1fr] lg:py-16">
          <DocumentUploader />
          <aside className="space-y-4">
            {CHECKLIST.map(({ title, docs }) => (
              <div key={title} className="card p-6">
                <p className="flex items-center gap-2 font-extrabold">
                  {title === "For imports" ? <Ship className="h-4 w-4" aria-hidden /> : <Send className="h-4 w-4" aria-hidden />}
                  {title}
                </p>
                <ul className="mt-3 space-y-2">
                  {docs.map((d) => (
                    <li key={d} className="flex items-start gap-2 text-sm text-muted">
                      <span aria-hidden className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-yellow ring-1 ring-brand-black/20" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="rounded-2xl bg-brand-black p-6 text-white">
              <p className="font-extrabold text-brand-yellow">No shipment yet?</p>
              <p className="mt-1 text-sm text-white/80">Start one first — documents attach to your reference.</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <Link href="/services/import-export/import" className="btn-primary !px-3">Import</Link>
                <Link href="/services/import-export/export" className="btn-primary !px-3">Export</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    </>
  );
}

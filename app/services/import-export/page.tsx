import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceCtaBand from "@/components/ServiceCtaBand";
import { Ship, FileCheck2, Timer, Globe2, Warehouse } from "lucide-react";

export const metadata: Metadata = {
  title: "Import / Export Assistance",
  description:
    "End-to-end EXIM support: customs clearance, documentation, FCL/LCL/air freight and door-to-door delivery.",
};

const roadmap = [
  { step: "Step 1", title: "IEC & compliance setup", text: "Importer Exporter Code, GST, AD-code registration and HS-code classification guidance before first shipment." },
  { step: "Step 2", title: "Documentation", text: "Commercial invoice, packing list, bill of lading / AWB, certificate of origin — prepared and double-checked by our EXIM desk." },
  { step: "Step 3", title: "Customs clearance", text: "Licensed CHB files the bill of entry / shipping bill; duty computation, examination and out-of-charge handled." },
  { step: "Step 4", title: "Freight booking", text: "FCL, LCL or air uplift on the best transit-vs-cost lane from our carrier contracts." },
  { step: "Step 5", title: "Port handling", text: "Container pickup, stuffing/de-stuffing, CHA coordination and port storage minimised." },
  { step: "Step 6", title: "Door delivery", text: "Final-mile trucking to your warehouse with POD closure and duty-drawback documentation support." },
];

export default function ImportExportPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServiceLayout
          icon={<Ship className="h-3.5 w-3.5" />}
          eyebrow="Import / Export"
          title="Customs, freight, paperwork —"
          highlight="fully handled."
          description="One EXIM desk for your imports and exports: classification, documentation, customs clearance and door delivery, with live milestone updates on every shipment."
        >
          {/* Customs clearance roadmap */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Customs clearance roadmap
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              First shipment or fiftieth — this is the exact path every XtoX
              consignment follows, with owners and timelines at each step.
            </p>

            <ol className="mt-8 space-y-0">
              {roadmap.map((r, i) => (
                <li key={r.step} className="relative flex gap-5 pb-8 last:pb-0">
                  {/* connector line */}
                  {i < roadmap.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute left-[19px] top-10 h-full w-0.5 bg-line"
                    />
                  )}
                  <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-black bg-brand-yellow text-sm font-extrabold">
                    {i + 1}
                  </span>
                  <div className="card flex-1 p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted">
                      {r.step}
                    </p>
                    <h3 className="mt-1 font-extrabold">{r.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{r.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

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
        </ServiceLayout>

        <ServiceCtaBand message="Shipping your first container? We'll clear the path." />
      </main>
      <Footer />
    </>
  );
}

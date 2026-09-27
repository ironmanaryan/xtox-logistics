import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceCtaBand from "@/components/ServiceCtaBand";
import { Wheat, Snowflake, Warehouse, FileBarChart2, Leaf } from "lucide-react";

export const metadata: Metadata = {
  title: "Farmer Agri-Export",
  description:
    "Cold-chain logistics, APEDA registration support and inter-state market pricing so farmers export directly at better realizations.",
};

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

export default function AgriExportPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServiceLayout
          icon={<Wheat className="h-3.5 w-3.5" />}
          eyebrow="Farmer Agri-Export"
          title="Your harvest deserves"
          highlight="global prices."
          description="Cold-chain from farm gate to foreign shelf, APEDA paperwork handled, and market intelligence that tells you exactly where your crop earns the most."
        >
          {/* Cold-chain section */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
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
          </div>

          {/* APEDA & pricing benefits */}
          <div className="mt-14">
            <h2 className="text-2xl font-extrabold tracking-tight">
              APEDA + market pricing benefits
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-muted">
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
          </div>

          {/* Journey strip */}
          <div className="mt-14 rounded-3xl border border-line bg-neutral-50 p-8">
            <h2 className="text-xl font-extrabold tracking-tight">
              Farm → Port → World, in 5 steps
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-5">
              {["Harvest & pre-cool", "Collection centre QC", "Pack-house & docs", "Reefer to port", "Export & payment"].map(
                (s, i) => (
                  <div key={s} className="text-center">
                    <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand-black text-sm font-extrabold text-brand-yellow">
                      {i + 1}
                    </span>
                    <p className="mt-2 text-sm font-bold">{s}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </ServiceLayout>

        <ServiceCtaBand message="Harvest season coming? Set up your export lane now." />
      </main>
      <Footer />
    </>
  );
}

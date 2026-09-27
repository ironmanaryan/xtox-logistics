import type { Metadata } from "next";
import { ClipboardList, FileText, Lock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MetricsBand from "@/components/MetricsBand";
import ServiceGrid from "@/components/ServiceGrid";
import Industries from "@/components/Industries";
import DriverCta from "@/components/DriverCta";
import QuoteForm from "@/components/QuoteForm";

export const metadata: Metadata = {
  title: "XtoX Logistics — B2B Logistics, Moving & Agri-Export Partner",
  description:
    "Packers & Movers, Import/Export, SME transport and farmer agri-export — one door-to-door logistics partner.",
};

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <MetricsBand />
        <ServiceGrid />
        <Industries />
        <DriverCta />

        <section id="cta" className="section-pad grid gap-10 py-16 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <p className="eyebrow">Get started</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Tell us what moves.
              <br />
              We&apos;ll move it <span className="bg-brand-yellow px-2">X to X.</span>
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
              Share your lane and cargo details — a dedicated logistics manager
              will call you back with the best route, vehicle and price.
            </p>
            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow text-brand-black">
                  <ClipboardList className="h-4 w-4" aria-hidden />
                </span>
                Single point of contact for all 4 services
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow text-brand-black">
                  <FileText className="h-4 w-4" aria-hidden />
                </span>
                Transparent digital billing & PODs
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-yellow text-brand-black">
                  <Lock className="h-4 w-4" aria-hidden />
                </span>
                Insurance & compliance handled end-to-end
              </li>
            </ul>
          </div>
          <QuoteForm />
        </section>
      </main>
      <Footer />
    </>
  );
}

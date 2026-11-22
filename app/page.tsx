import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import JsonLd, { organizationSchema } from "@/components/JsonLd";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MetricsBand from "@/components/MetricsBand";
import ServiceGrid from "@/components/ServiceGrid";
import HowItWorks from "@/components/HowItWorks";
import Testimonials from "@/components/Testimonials";
import Industries from "@/components/Industries";
import DriverCta from "@/components/DriverCta";
import QuoteCtaSection from "@/components/QuoteCtaSection";

export const metadata: Metadata = {
  title: "XtoX Logistics — B2B Logistics, Moving & Agri-Export Partner",
  description:
    "Packers & Movers, Import/Export, SME transport and farmer agri-export — one door-to-door logistics partner.",
};

export default function HomePage() {
  return (
    <>
      <JsonLd data={organizationSchema} />
      <Navbar />
      <main>
        <Hero />
        <ServiceGrid />
        <MetricsBand />
        <HowItWorks />
        <Testimonials />
        <Industries />
        <DriverCta />
        <QuoteCtaSection />
      </main>
      <Footer />
    </>
  );
}

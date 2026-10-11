import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverApp from "@/components/DriverApp";
import { Truck, Plus } from "lucide-react";

export const metadata: Metadata = {
  title: "Driver App",
  description: "XtoX driver app — find loads, accept trips, upload PODs and track earnings. Install it on your phone.",
};

export default function DriverPage() {
  return (
    <>
      <Navbar />
      <main className="bg-neutral-50/60">
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/drivers" className="hover:text-brand-black">Drivers</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Driver App</span>
            </nav>
            <span className="chip-yellow mt-5">
              <Truck className="h-3.5 w-3.5" aria-hidden />
              Driver app · works on any phone
            </span>
            <h1 className="mt-3 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
              Loads, trips & earnings —{" "}
              <span className="bg-brand-yellow px-2">in your pocket.</span>
            </h1>
            <p className="mt-3 flex max-w-2xl flex-wrap items-center gap-1.5 text-sm text-muted">
              <Plus className="h-4 w-4" aria-hidden />
              Tip: open your browser menu → “Add to Home Screen” to install this as an app.
            </p>
          </div>
        </section>
        <div className="section-pad py-8 lg:py-12">
          <DriverApp />
        </div>
      </main>
      <Footer />
    </>
  );
}

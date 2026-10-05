import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import TruckBookingWidget from "@/components/TruckBookingWidget";
import { Truck } from "lucide-react";

export const metadata: Metadata = {
  title: "Express Truck Booking",
  description:
    "Book a mini-truck in 4 quick steps — 3-Wheeler, Tata Ace, 14ft Truck. Fixed price upfront, helpers & insurance add-ons, OTP pickup, live GPS tracking.",
};

export default function PackersExpressPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-12 lg:py-16">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <Link href="/services/packers-movers" className="hover:text-brand-black">Packers &amp; Movers</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Express Booking</span>
            </nav>
            <span className="chip-yellow mt-6">
              <Truck className="h-3.5 w-3.5" aria-hidden />
              Express option
            </span>
            <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
              Book a truck in{" "}
              <span className="relative inline-block">
                <span className="relative z-10">4 quick steps.</span>
                <span aria-hidden className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow" />
              </span>
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
              3-Wheeler, Tata Ace or 14ft Truck — fixed price upfront, online or
              cash-on-delivery payment, OTP-verified pickup and live GPS tracking.
            </p>
          </div>
        </section>

        <div className="section-pad py-12 lg:py-16">
          <TruckBookingWidget />
        </div>
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CustomerDashboard from "@/components/CustomerDashboard";
import { LayoutDashboard } from "lucide-react";

export const metadata: Metadata = {
  title: "My Dashboard",
  description: "Your XtoX bookings, invoices and order tracking in one place.",
};

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="dot-grid border-b border-line">
          <div className="section-pad py-10 lg:py-14">
            <nav aria-label="Breadcrumb" className="text-xs font-semibold text-muted">
              <Link href="/" className="hover:text-brand-black">Home</Link>
              <span className="mx-2">/</span>
              <span className="text-brand-black">Dashboard</span>
            </nav>
            <span className="chip-yellow mt-5">
              <LayoutDashboard className="h-3.5 w-3.5" aria-hidden />
              Customer dashboard
            </span>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Namaste! Your logistics,{" "}
              <span className="bg-brand-yellow px-2">one screen.</span>
            </h1>
          </div>
        </section>
        <div className="section-pad py-8 lg:py-12">
          <CustomerDashboard />
        </div>
      </main>
      <Footer />
    </>
  );
}

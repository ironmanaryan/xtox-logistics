import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { terms } from "@/data/legal";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "The terms governing XtoX Logistics quotes, bookings, shipments and driver partnerships — pricing, payments, liability, insurance, customs and complaints.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}

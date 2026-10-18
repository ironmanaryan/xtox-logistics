import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { refund } from "@/data/legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy",
  description:
    "XtoX Logistics refund and cancellation terms across Packers & Movers, SME Transport, Import/Export and Agri-Export — deductions, timelines and how to request a refund.",
  alternates: { canonical: "/refund-policy" },
};

export default function RefundPolicyPage() {
  return <LegalPage doc={refund} />;
}

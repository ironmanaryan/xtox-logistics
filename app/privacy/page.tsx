import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { privacy } from "@/data/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How XtoX Logistics collects, uses, shares, stores and protects your personal information and documents, and the rights you have over your data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}

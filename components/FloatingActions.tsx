"use client";

import Link from "next/link";
import { Phone, FileText } from "lucide-react";
import { track } from "@/lib/analytics";
import { company } from "@/data/company";
import { useI18n } from "./LanguageProvider";

const WA_NUMBER = company.whatsapp;
const WA_TEXT = encodeURIComponent("Hi XtoX! I need a logistics quote.");

function WhatsAppIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.1 3.2 5.1 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.76-.72 2.01-1.42.25-.7.25-1.29.17-1.42-.07-.13-.27-.2-.57-.35M12.05 21.79h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 9.88 9.89c0 5.45-4.44 9.88-9.89 9.88M20.5 3.49A11.8 11.8 0 0 0 12.04 0C5.5 0 .16 5.34.16 11.9c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.9 11.9 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.9 0-3.18-1.24-6.16-3.44-8.41" />
    </svg>
  );
}

/** Floating WhatsApp button (desktop; the mobile bar covers phones). */
export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      onClick={() => track("whatsapp_click", { location: "floating" })}
      className="fixed bottom-20 left-4 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-hero transition-all duration-300 hover:scale-105 sm:bottom-5 sm:left-5 sm:flex"
    >
      <WhatsAppIcon />
    </a>
  );
}

/** Sticky mobile conversion bar: Call | WhatsApp | Get Quote. */
export function MobileCallBar() {
  const { t } = useI18n();

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-px border-t border-line bg-white sm:hidden">
      <a
        href={`tel:${company.phoneE164}`}
        onClick={() => track("call_click", { location: "mobile_bar" })}
        className="flex min-h-[60px] items-center justify-center gap-2 bg-brand-black text-sm font-extrabold text-white"
      >
        <Phone className="h-4 w-4 text-brand-yellow" aria-hidden />
        {t("common.call")}
      </a>
      <a
        href={`https://wa.me/${WA_NUMBER}?text=${WA_TEXT}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("whatsapp_click", { location: "mobile_bar" })}
        className="flex min-h-[60px] items-center justify-center gap-2 bg-[#25D366] text-sm font-extrabold text-white"
      >
        <WhatsAppIcon className="h-5 w-5" />
        {t("common.whatsapp")}
      </a>
      <Link
        href="/#cta"
        className="flex min-h-[60px] items-center justify-center gap-2 bg-brand-yellow text-sm font-extrabold text-brand-black"
      >
        <FileText className="h-4 w-4" aria-hidden />
        {t("common.quote")}
      </Link>
    </div>
  );
}

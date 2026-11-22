"use client";

import { useI18n } from "./LanguageProvider";
import { LOCALES } from "@/lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full border border-line bg-neutral-50 p-1 ${className}`}
      role="group"
      aria-label={t("nav.language")}
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          title={l.label}
          className={`rounded-full px-3 py-1.5 text-[11px] font-bold tracking-wide transition-all duration-200 ${
            locale === l.code
              ? "bg-brand-black text-white shadow-sm"
              : "text-muted hover:bg-white hover:text-brand-black"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

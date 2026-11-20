"use client";

import { useI18n } from "./LanguageProvider";
import { LOCALES } from "@/lib/i18n";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useI18n();

  return (
    <div
      className={`inline-flex items-center rounded-xl border border-line bg-white p-0.5 ${className}`}
      role="group"
      aria-label="Choose language"
    >
      {LOCALES.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLocale(l.code)}
          aria-pressed={locale === l.code}
          title={l.label}
          className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-colors ${
            locale === l.code
              ? "bg-brand-black text-white"
              : "text-muted hover:text-brand-black"
          }`}
        >
          {l.short}
        </button>
      ))}
    </div>
  );
}

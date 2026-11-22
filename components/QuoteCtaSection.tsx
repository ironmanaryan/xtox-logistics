"use client";

import { ClipboardList, FileText, Lock } from "lucide-react";
import Reveal from "./Reveal";
import QuoteForm from "./QuoteForm";
import { useI18n } from "./LanguageProvider";

export default function QuoteCtaSection() {
  const { t } = useI18n();
  const points = [
    { icon: ClipboardList, text: t("home.ctaPoint1") },
    { icon: FileText, text: t("home.ctaPoint2") },
    { icon: Lock, text: t("home.ctaPoint3") },
  ];

  return (
    <section id="cta" className="section-pad grid scroll-mt-24 gap-10 py-16 lg:grid-cols-[1fr_1.1fr]">
      <Reveal>
        <div>
          <p className="eyebrow">{t("home.ctaEyebrow")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("home.ctaTitle1")}
            <br />
            {t("home.ctaTitle2")}{" "}
            <span className="bg-brand-yellow px-2">{t("home.ctaHighlight")}</span>
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted sm:text-base">
            {t("home.ctaBody")}
          </p>
          <ul className="mt-6 space-y-3 text-sm">
            {points.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-yellow text-brand-black">
                  <Icon className="h-4 w-4" aria-hidden />
                </span>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
      <Reveal delay={120}>
        <QuoteForm />
      </Reveal>
    </section>
  );
}

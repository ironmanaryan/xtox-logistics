"use client";

import { ClipboardList, Truck, Radar, PackageCheck } from "lucide-react";
import Reveal from "./Reveal";
import { useI18n } from "./LanguageProvider";
import type { TKey } from "@/lib/i18n";

const steps: { icon: typeof ClipboardList; title: TKey; text: TKey }[] = [
  { icon: ClipboardList, title: "hiw.s1t", text: "hiw.s1d" },
  { icon: Truck, title: "hiw.s2t", text: "hiw.s2d" },
  { icon: Radar, title: "hiw.s3t", text: "hiw.s3d" },
  { icon: PackageCheck, title: "hiw.s4t", text: "hiw.s4d" },
];

export default function HowItWorks() {
  const { t } = useI18n();

  return (
    <section id="how-it-works" className="border-b border-line bg-neutral-50/60">
      <div className="section-pad py-16 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">{t("hiw.eyebrow")}</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {t("hiw.title")}
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">{t("hiw.lead")}</p>
        </Reveal>

        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 90}>
              <li className="card relative h-full p-6">
                <span
                  aria-hidden
                  className="absolute right-5 top-4 text-4xl font-extrabold text-neutral-100"
                >
                  {i + 1}
                </span>
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-yellow text-brand-black">
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-extrabold">{t(s.title)}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(s.text)}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

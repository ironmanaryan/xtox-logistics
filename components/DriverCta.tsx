"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { images } from "@/data/images";
import { useI18n } from "./LanguageProvider";

export default function DriverCta() {
  const { t } = useI18n();

  return (
    <section id="driver-cta" className="section-pad py-16">
      <div className="relative overflow-hidden rounded-3xl bg-brand-black px-8 py-12 text-white sm:px-12 lg:px-16">
        <Image
          src={images.truckSunset.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 100vw, 0px"
          className="object-cover opacity-25"
          aria-hidden
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/80 to-brand-black/40" />
        <div
          aria-hidden
          className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-brand-yellow/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute -bottom-28 left-1/4 h-72 w-72 rounded-full bg-brand-yellow/10 blur-3xl"
        />

        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="chip-yellow">{t("driver.badge")}</span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-400 px-3 py-1 text-xs font-extrabold text-brand-black">
                {t("driver.offer")}
              </span>
            </div>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              {t("driver.title1")}
              <span className="text-brand-yellow">{t("driver.title2")}</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              {t("driver.body")}
            </p>
            <ul className="mt-5 grid max-w-lg gap-2 text-sm text-white/80 sm:grid-cols-2">
              {[t("driver.p1"), t("driver.p2"), t("driver.p3"), t("driver.p4")].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white/90">{t("driver.steps")}</p>
            <ol className="mt-3 space-y-3 text-sm text-white/70">
              {[t("driver.s1"), t("driver.s2"), t("driver.s3")].map((step, i) => (
                <li key={step} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-extrabold text-brand-black">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Link href="/drivers" className="btn-yellow-lg mt-6 w-full !px-8 !py-4 !text-lg">
              {t("driver.cta")} →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

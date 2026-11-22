"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";
import Reveal from "./Reveal";
import { clients, rating, testimonials } from "@/data/proof";
import { features, visibleComplianceBadges } from "@/data/company";
import { useI18n } from "./LanguageProvider";

export default function Testimonials() {
  const { t: tr } = useI18n();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const badges = visibleComplianceBadges();

  useEffect(() => {
    if (paused || testimonials.length < 2) return;
    const iv = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(iv);
  }, [paused]);

  if (!features.testimonials) return null;

  const hasQuotes = testimonials.length > 0;
  if (!hasQuotes && clients.length === 0 && !rating && badges.length === 0) {
    // Nothing verifiable to show yet — omit the section instead of inventing proof.
    return null;
  }

  const safeIndex = Math.min(index, Math.max(0, testimonials.length - 1));
  const t = testimonials[safeIndex];

  return (
    <section className="section-pad py-16 lg:py-20" aria-label="Trust and social proof">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">{tr("trust.eyebrow")}</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {tr("trust.title")}
        </h2>
        {rating ? (
          <a
            href={rating.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold"
          >
            <span className="flex" aria-label={`${rating.score} out of 5 stars`}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" aria-hidden />
              ))}
            </span>
            {rating.score} · {rating.count} {rating.platform} reviews
          </a>
        ) : null}
      </Reveal>

      {hasQuotes && t && (
        <Reveal delay={120}>
          <div
            className="card mx-auto mt-8 max-w-3xl p-6 sm:p-8"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div key={safeIndex} className="animate-fadeUp">
              <div className="flex" aria-hidden>
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
                ))}
              </div>
              <blockquote className="mt-4 text-base font-medium leading-relaxed sm:text-lg">
                “{t.quote}”
              </blockquote>
              <div className="mt-5 flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-black text-sm font-extrabold text-brand-yellow">
                  {t.initials}
                </span>
                <div>
                  <p className="text-sm font-extrabold">{t.name}</p>
                  <p className="text-xs text-muted">{t.company}</p>
                </div>
              </div>
            </div>

            {testimonials.length > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="flex gap-2">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setIndex(i)}
                      aria-label={`Go to testimonial ${i + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === safeIndex ? "w-7 bg-brand-black" : "w-2 bg-neutral-300 hover:bg-neutral-400"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setIndex((safeIndex - 1 + testimonials.length) % testimonials.length)
                    }
                    aria-label="Previous testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-all hover:border-brand-black hover:bg-brand-black hover:text-white"
                  >
                    <ChevronLeft className="h-5 w-5" aria-hidden />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIndex((safeIndex + 1) % testimonials.length)}
                    aria-label="Next testimonial"
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-all hover:border-brand-black hover:bg-brand-black hover:text-white"
                  >
                    <ChevronRight className="h-5 w-5" aria-hidden />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      )}

      {clients.length > 0 && (
        <div className="mt-10">
          <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted">
            {tr("trust.clients")}
          </p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {clients.map((c) => (
              <span
                key={c}
                className="text-sm font-extrabold uppercase tracking-wide text-neutral-400 sm:text-base"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      )}

      {badges.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {badges.map((b) => (
            <span
              key={b.key}
              className="inline-flex items-center gap-1.5 rounded-full bg-brand-black px-3.5 py-1.5 text-xs font-bold text-white"
            >
              <BadgeCheck className="h-3.5 w-3.5 text-brand-yellow" aria-hidden />
              {b.label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

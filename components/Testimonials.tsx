"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Star, BadgeCheck } from "lucide-react";
import Reveal from "./Reveal";

const testimonials = [
  {
    quote:
      "Surat se Mumbai weekly material jata hai. Pehle transporter har baar naya rate bolta tha — XtoX ke baad fixed lane rate, POD time par, billing ekdum clean.",
    name: "Rakesh Sharma",
    company: "Sharma Textiles, Surat",
    initials: "RS",
  },
  {
    quote:
      "2BHK shift kiya Bengaluru me. Packing dekh ke laga apna saamaan hai hi nahi — zero scratch, team time par, GPS par truck dikhta raha.",
    name: "Priya Nair",
    company: "Home shifting, Bengaluru",
    initials: "PN",
  },
  {
    quote:
      "Hamare FPO ke angur EU gaye — pre-cooling, reefer, APEDA papers sab inhone sambhala. Mandi se 3 guna realization mila.",
    name: "Dnyaneshwar Patil",
    company: "Grape FPO, Nashik",
    initials: "DP",
  },
];

const clients = [
  "Sharma Textiles",
  "Nashik Agro FPO",
  "Pune FMCG Distributors",
  "BrightTech Systems",
  "Gujarat Ceramics Co.",
  "Malabar Spices",
];

const certificates = ["GST Registered", "IEC Certified", "APEDA Support", "Insured Transit", "Verified Fleet"];

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const iv = setInterval(() => setIndex((i) => (i + 1) % testimonials.length), 6000);
    return () => clearInterval(iv);
  }, [paused]);

  const t = testimonials[index];

  return (
    <section className="section-pad py-16 lg:py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="eyebrow justify-center">Trust & social proof</p>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          Log kya kehte hain
        </h2>
        <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-1.5 text-sm font-bold">
          <span className="flex" aria-label="4.8 out of 5 stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" aria-hidden />
            ))}
          </span>
          4.8 · 2,300+ Google reviews
        </div>
      </Reveal>

      {/* Carousel */}
      <Reveal delay={120}>
        <div
          className="card mx-auto mt-8 max-w-3xl p-6 sm:p-8"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div key={index} className="animate-fadeUp">
            <div className="flex" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-brand-yellow text-brand-yellow" />
              ))}
            </div>
            <blockquote className="mt-4 text-base leading-relaxed font-medium sm:text-lg">
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
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === index ? "w-7 bg-brand-black" : "w-2 bg-neutral-300 hover:bg-neutral-400"}`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setIndex((index - 1 + testimonials.length) % testimonials.length)}
                aria-label="Previous testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-all hover:border-brand-black hover:bg-brand-black hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" aria-hidden />
              </button>
              <button
                type="button"
                onClick={() => setIndex((index + 1) % testimonials.length)}
                aria-label="Next testimonial"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-line transition-all hover:border-brand-black hover:bg-brand-black hover:text-white"
              >
                <ChevronRight className="h-5 w-5" aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Client logos */}
      <div className="mt-10">
        <p className="text-center text-xs font-bold uppercase tracking-[0.18em] text-muted">
          Inke saath kaam karte hain
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {clients.map((c) => (
            <span
              key={c}
              className="text-sm font-extrabold uppercase tracking-wide text-neutral-300 transition-colors duration-300 hover:text-brand-black sm:text-base"
            >
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* Certificates */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
        {certificates.map((c) => (
          <span key={c} className="inline-flex items-center gap-1.5 rounded-full bg-brand-black px-3.5 py-1.5 text-xs font-bold text-white">
            <BadgeCheck className="h-3.5 w-3.5 text-brand-yellow" aria-hidden />
            {c}
          </span>
        ))}
      </div>
    </section>
  );
}

"use client";

import { ClipboardList, Truck, Radar, PackageCheck } from "lucide-react";
import Reveal from "./Reveal";

const steps = [
  {
    icon: ClipboardList,
    title: "Quote maango",
    text: "City, service aur phone batao — 2 ghante me fixed price callback.",
  },
  {
    icon: Truck,
    title: "Vehicle assign",
    text: "Sahi gaadi + trained crew, slot lock with vehicle number.",
  },
  {
    icon: Radar,
    title: "Live track karo",
    text: "GPS link WhatsApp par — maal kahan hai, hamesha pata.",
  },
  {
    icon: PackageCheck,
    title: "Deliver + POD",
    text: "Check karke lo delivery, digital POD turant, balance baad me.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="border-b border-line bg-neutral-50/60">
      <div className="section-pad py-16 lg:py-20">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="eyebrow justify-center">How it works</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            4 steps. Zero confusion.
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">
            Quote se POD tak — har step par tumhe pata rahega aage kya hoga.
          </p>
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
                <h3 className="mt-4 font-extrabold">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

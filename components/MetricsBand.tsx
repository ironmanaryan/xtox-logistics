"use client";

import { useEffect, useRef, useState } from "react";
import { metrics } from "@/data/proof";

function useCountUp(target: string, active: boolean) {
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!active) return;
    const match = target.match(/^([\d.]+)(.*)$/);
    if (!match) return;
    const end = parseFloat(match[1]);
    const suffix = match[2];
    const decimals = (match[1].split(".")[1] || "").length;
    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay((end * eased).toFixed(decimals) + suffix);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active]);

  return display;
}

function Metric({
  value,
  label,
  active,
}: {
  value: string;
  label: string;
  active: boolean;
}) {
  const shown = useCountUp(value, active);
  const match = shown.match(/^([\d.]+)(.*)$/);
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
        {match ? match[1] : shown}
        {match && match[2] ? <span className="text-brand-yellow">{match[2]}</span> : null}
      </p>
      <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-white/60">
        {label}
      </p>
    </div>
  );
}

/**
 * Renders only when real, verifiable metrics exist in data/proof.ts.
 * This intentionally hides the whole band rather than showing placeholder
 * numbers on the live site.
 */
export default function MetricsBand() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  if (metrics.length === 0) return null;

  return (
    <section className="bg-brand-black" aria-label="Company statistics">
      <div
        ref={ref}
        className="section-pad grid grid-cols-2 gap-8 py-12 lg:grid-cols-4"
      >
        {metrics.map((m) => (
          <Metric key={m.label} value={m.value} label={m.label} active={active} />
        ))}
      </div>
    </section>
  );
}

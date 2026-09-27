"use client";

import { useEffect, useRef, useState } from "react";
import { heroMetrics } from "@/data/metrics";

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

function Metric({ value, label, active }: { value: string; label: string; active: boolean }) {
  const shown = useCountUp(value, active);
  return (
    <div className="flex flex-col items-center text-center">
      <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{shown}</p>
      <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">{label}</p>
    </div>
  );
}

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

  return (
    <section className="border-y border-line bg-white">
      <div ref={ref} className="section-pad grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {heroMetrics.map((m) => (
          <Metric key={m.label} value={m.value} label={m.label} active={active} />
        ))}
      </div>
    </section>
  );
}

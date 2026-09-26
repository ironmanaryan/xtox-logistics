import Link from "next/link";
import { heroMetrics } from "@/data/metrics";

export default function MetricsBand() {
  return (
    <section className="border-y border-line bg-white">
      <div className="section-pad grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {heroMetrics.map((m) => (
          <div key={m.label} className="flex flex-col items-center text-center">
            <p className="text-3xl font-extrabold tracking-tight sm:text-4xl">{m.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-muted">
              {m.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

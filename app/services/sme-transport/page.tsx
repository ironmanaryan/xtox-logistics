import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceCtaBand from "@/components/ServiceCtaBand";

export const metadata: Metadata = {
  title: "SME Transport Support",
  description:
    "On-demand and scheduled fleet options for small and mid-sized businesses — FTL, PTL, live tracking and digital PODs.",
};

const modes = [
  {
    name: "On-Demand",
    tag: "Pay per trip",
    best: "Best for fluctuating, ad-hoc loads",
    icon: "⚡",
    features: [
      "Vehicle at your gate in 2–6 hrs",
      "Full fleet menu: Tata Ace to 32-ft SXL",
      "Per-trip transparent pricing",
      "Live GPS tracking link on WhatsApp",
      "Digital POD within 24 hrs of delivery",
      "No monthly commitment",
    ],
    highlight: false,
  },
  {
    name: "Scheduled Fleet",
    tag: "Contracted lanes",
    best: "Best for fixed routes & recurring volume",
    icon: "🗓️",
    features: [
      "Dedicated vehicles on fixed schedules",
      "Locked monthly rates — no surge",
      "Priority capacity in peak season",
      "Named account manager & SLA reports",
      "Consolidated monthly billing",
      "Custom vehicle branding available",
    ],
    highlight: true,
  },
];

const fleet = [
  { v: "Tata Ace / Chhota Hathi", cap: "0.75 T · 7 ft", use: "City last-mile, light parcels" },
  { v: "Ashok Leyland Dost", cap: "1.5 T · 8 ft", use: "SME local distribution" },
  { v: "Eicher 14-ft / 17-ft", cap: "4–7 T", use: "Intercity PTL & FTL" },
  { v: "32-ft SXL / MXL", cap: "9–16 T", use: "Long-haul full truckload" },
  { v: "Container 20ft / 40ft", cap: "18–28 T", use: "Port runs, EXIM legs" },
  { v: "Reefer 14-ft / 32-ft", cap: "4–16 T", use: "Cold-chain & agri cargo" },
];

export default function SmeTransportPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServiceLayout
          eyebrow="🚛 SME Transport"
          title="Your growth partner on"
          highlight="every lane."
          description="Whether it's one truck today or a contracted fleet every Monday — SMEs get enterprise-grade transport without enterprise overheads."
        >
          {/* On-demand vs scheduled */}
          <div>
            <h2 className="text-2xl font-extrabold tracking-tight">
              Choose your fleet model
            </h2>
            <div className="mt-6 grid gap-5 lg:grid-cols-2">
              {modes.map((m) => (
                <div
                  key={m.name}
                  className={`card relative p-7 ${m.highlight ? "border-brand-black ring-2 ring-brand-yellow" : ""}`}
                >
                  {m.highlight && (
                    <span className="absolute -top-3 right-6 rounded-full bg-brand-yellow px-3 py-1 text-xs font-extrabold">
                      MOST POPULAR
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-2xl">
                      {m.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-extrabold">{m.name}</h3>
                      <p className="text-xs font-bold uppercase tracking-wider text-muted">{m.tag}</p>
                    </div>
                  </div>
                  <p className="mt-3 text-sm font-semibold">{m.best}</p>
                  <ul className="mt-4 space-y-2.5">
                    {m.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm text-muted">
                        <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-[10px] font-extrabold text-brand-black">
                          ✓
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Fleet table */}
          <div className="mt-14">
            <h2 className="text-2xl font-extrabold tracking-tight">Fleet we deploy</h2>
            <div className="card mt-6 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-line bg-neutral-50 text-xs uppercase tracking-wider text-muted">
                    <th className="px-5 py-3.5 font-bold">Vehicle</th>
                    <th className="px-5 py-3.5 font-bold">Capacity</th>
                    <th className="hidden px-5 py-3.5 font-bold sm:table-cell">Typical use</th>
                  </tr>
                </thead>
                <tbody>
                  {fleet.map((f) => (
                    <tr key={f.v} className="border-b border-line last:border-0 transition-colors hover:bg-neutral-50">
                      <td className="px-5 py-3.5 font-semibold">{f.v}</td>
                      <td className="px-5 py-3.5 text-muted">{f.cap}</td>
                      <td className="hidden px-5 py-3.5 text-muted sm:table-cell">{f.use}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ServiceLayout>

        <ServiceCtaBand message="Tell us your lane — we'll price it in minutes." />
      </main>
      <Footer />
    </>
  );
}

import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ServiceLayout from "@/components/ServiceLayout";
import ServiceCtaBand from "@/components/ServiceCtaBand";
import PackersCalculator from "@/components/PackersCalculator";

export const metadata: Metadata = {
  title: "Packers & Movers",
  description:
    "Zero-damage home and office shifting with instant cost calculator, trained crews and insured, GPS-tracked moves.",
};

const steps = [
  { n: "01", title: "Free survey", text: "Video or in-person survey within 24 hrs, with a written lock-in quote." },
  { n: "02", title: "Graded packing", text: "Multi-layer packing — foam, bubble, corrugated, waterproof lamination." },
  { n: "03", title: "Insured transit", text: "GPS-tracked vehicles with all-risk transit insurance included." },
  { n: "04", title: "Unpack & set up", text: "Doorstep delivery, unpacking, debris removal and basic installation." },
];

const faqs = [
  {
    q: "How is the cost calculated?",
    a: "Move size, distance, packing material and insurance. Our calculator gives an instant indicative range; final price is locked after survey.",
  },
  {
    q: "How fast can you move?",
    a: "Local city moves: same/next day. Intercity: pickup within 48 hrs of confirmation on most lanes.",
  },
  {
    q: "Is my goods' safety guaranteed?",
    a: "Every move carries all-risk transit insurance and a named move manager reachable on WhatsApp through the move.",
  },
];

export default function PackersMoversPage() {
  return (
    <>
      <Navbar />
      <main>
        <ServiceLayout
          eyebrow="📦 Packers & Movers"
          title="Shifting homes or offices?"
          highlight="Move damage-free."
          description="From a 1BHK across town to a 400-seat office across states — trained crews, graded packing material and insured, GPS-tracked fleets on every move."
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">How your move runs</h2>
              <div className="mt-6 space-y-4">
                {steps.map((s) => (
                  <div key={s.n} className="card flex gap-4 p-5">
                    <span className="text-xl font-extrabold text-brand-yellow [-webkit-text-stroke:1px_#111]">
                      {s.n}
                    </span>
                    <div>
                      <h3 className="font-bold">{s.title}</h3>
                      <p className="mt-1 text-sm text-muted">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <PackersCalculator />
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-2xl font-extrabold tracking-tight">Frequently asked</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {faqs.map((f) => (
                <div key={f.q} className="card p-6">
                  <h3 className="font-bold">{f.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
        </ServiceLayout>

        <ServiceCtaBand message="Planning a move? Lock your slot this week." />
      </main>
      <Footer />
    </>
  );
}

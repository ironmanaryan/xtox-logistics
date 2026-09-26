import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import DriverForm from "@/components/DriverForm";

export const metadata: Metadata = {
  title: "Become a Driver Partner",
  description:
    "Join 850+ XtoX driver partners: daily loads, 48-hour payments, free digital LR tools and fuel/toll support.",
};

const perks = [
  { icon: "🚛", t: "Daily load offers", d: "Loads matched to your route and vehicle type, straight on WhatsApp." },
  { icon: "💸", t: "48-hour payment", d: "No 30–60 day waits. POD cleared, money in your account in 48 hrs." },
  { icon: "🧾", t: "Free digital LR tools", d: "e-LR, e-POD and trip summaries — no paperwork running around." },
  { icon: "⛽", t: "Fuel & toll desk", d: "Discount tie-ups at fuel stations and FASTag recharge support." },
  { icon: "🛡️", t: "Trip insurance", d: "Accident cover for driver and helper on every XtoX-matched trip." },
  { icon: "🏆", t: "Loyalty bonuses", d: "Complete 20 trips/month and unlock a monthly bonus slab." },
];

export default function DriversPage() {
  return (
    <>
      <Navbar />
      <main>
        {/* Hero */}
        <section className="dot-grid border-b border-line">
          <div className="section-pad grid gap-10 py-14 lg:grid-cols-2 lg:py-20">
            <div>
              <span className="chip-yellow">🚛 Driver Partner Program</span>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
                Your truck.
                <br />
                Our loads.{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">Both profit.</span>
                  <span
                    aria-hidden
                    className="absolute inset-x-0 bottom-1 z-0 h-3 -rotate-1 bg-brand-yellow"
                  />
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                Empty return trips kill earnings. XtoX keeps your truck loaded
                both ways with verified shippers, transparent rates and the
                fastest payment cycle in the market.
              </p>

              <div className="mt-8 grid max-w-md grid-cols-3 gap-4">
                {[
                  { v: "850+", l: "Partners onboard" },
                  { v: "48 hr", l: "Payment cycle" },
                  { v: "₹0", l: "Onboarding fee" },
                ].map((m) => (
                  <div key={m.l} className="card p-4 text-center">
                    <p className="text-2xl font-extrabold">{m.v}</p>
                    <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
                      {m.l}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <DriverForm />
          </div>
        </section>

        {/* Perks grid */}
        <section className="section-pad py-16">
          <p className="eyebrow">Why drive with XtoX</p>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight">
            Built for owner-operators
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((p) => (
              <div key={p.t} className="card p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-2xl">
                  {p.icon}
                </span>
                <h3 className="mt-4 font-extrabold">{p.t}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{p.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Steps */}
        <section className="border-t border-line bg-neutral-50/60 py-16">
          <div className="section-pad">
            <h2 className="text-3xl font-extrabold tracking-tight">
              Onboard in 3 steps
            </h2>
            <div className="mt-8 grid gap-4 md:grid-cols-3">
              {[
                { n: "1", t: "Submit details", d: "Fill the form — name, vehicle, RC and licence. Takes 3 minutes." },
                { n: "2", t: "Quick verification", d: "Our team verifies RC, licence and bank details within 24 hrs." },
                { n: "3", t: "First load offer", d: "Get matched loads on your route — accept, drive, get paid in 48 hrs." },
              ].map((s) => (
                <div key={s.n} className="card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-black text-base font-extrabold text-brand-yellow">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-extrabold">{s.t}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

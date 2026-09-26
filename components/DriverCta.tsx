import Link from "next/link";

export default function DriverCta() {
  return (
    <section id="driver-cta" className="section-pad py-16">
      <div className="relative overflow-hidden rounded-3xl bg-brand-black px-8 py-12 text-white sm:px-12 lg:px-16">
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
            <span className="chip-yellow">Drive with XtoX</span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Own a truck? Turn it into a
              <span className="text-brand-yellow"> money machine.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
              Join 850+ driver partners getting daily load offers, transparent
              payments within 48 hours, and zero commission on first 10 trips.
            </p>
            <ul className="mt-5 grid max-w-lg gap-2 text-sm text-white/80 sm:grid-cols-2">
              <li>✅ Daily load availability</li>
              <li>✅ 48-hr payment assurance</li>
              <li>✅ Free digital LR tools</li>
              <li>✅ Fuel & toll support desk</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <p className="text-sm font-semibold text-white/90">
              Onboard in 3 steps:
            </p>
            <ol className="mt-3 space-y-3 text-sm text-white/70">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-extrabold text-brand-black">1</span>
                Share licence & RC details
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-extrabold text-brand-black">2</span>
                Verification within 24 hrs
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-yellow text-xs font-extrabold text-brand-black">3</span>
                Get first load offer
              </li>
            </ol>
            <Link href="/drivers" className="btn-yellow-lg mt-6 w-full">
              Start Onboarding →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

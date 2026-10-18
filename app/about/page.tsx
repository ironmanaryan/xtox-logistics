import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import MetricsBand from "@/components/MetricsBand";
import { images } from "@/data/images";
import { services } from "@/data/services";
import {
  Package,
  Ship,
  Truck,
  Wheat,
  ShieldCheck,
  FileCheck2,
  Headset,
  Radar,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About XtoX Logistics",
  description:
    "XtoX Logistics is an India-wide logistics partner for Packers & Movers, Import/Export, SME Transport and Farmer Agri-Export — one accountable team, one tracking and billing stack.",
  alternates: { canonical: "/about" },
};

const icons: Record<string, LucideIcon> = {
  "packers-movers": Package,
  "import-export": Ship,
  "sme-transport": Truck,
  "agri-export": Wheat,
};

const standards = [
  {
    icon: ShieldCheck,
    title: "Insured & compliant moves",
    text: "All-risk transit insurance options, GST invoicing, e-way bill support and licensed customs brokers on EXIM files.",
  },
  {
    icon: FileCheck2,
    title: "Documented at every step",
    text: "Written quotations, service records, digital PODs and audit-ready documentation for your books.",
  },
  {
    icon: Radar,
    title: "Visibility, not guesswork",
    text: "GPS-tracked vehicles and milestone updates so you always know where your consignment is.",
  },
  {
    icon: Headset,
    title: "One accountable desk",
    text: "A single point of contact across all four services — no chasing four different vendors.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Company"
          title="One partner,"
          highlight="X to X."
          description="XtoX Logistics moves India's goods — for businesses, families, SMEs and farmers — on one accountable network, one tracking stack and one billing desk."
        />

        {/* Who we are */}
        <section className="section-pad grid items-center gap-10 py-14 lg:grid-cols-[1.1fr_1fr] lg:py-20">
          <div>
            <p className="eyebrow">Who we are</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
              Built to remove the friction from moving goods.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              XtoX Logistics is a Bengaluru-headquartered logistics company serving
              customers across India and on international trade lanes. We started
              with a simple idea: logistics should be transparent, accountable and
              easy to understand — regardless of whether you are shifting a home,
              shipping a container, or sending your harvest to a foreign buyer.
            </p>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              Today we run four service lines on a shared operations, tracking and
              billing system, backed by a verified network of fleet partners,
              licensed customs agents, warehousing and cold-chain providers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/#cta" className="btn-primary">
                Get a quote <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link href="/support" className="btn-secondary">
                Talk to our team
              </Link>
            </div>
          </div>

          <div className="relative h-72 overflow-hidden rounded-3xl border border-line shadow-hero lg:h-96">
            <Image
              src={images.fleetYard.src}
              alt={images.fleetYard.alt}
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        {/* Divisions */}
        <section className="border-y border-line bg-neutral-50/60">
          <div className="section-pad py-14 lg:py-16">
            <p className="eyebrow">What we do</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Four divisions. One network.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {services.map((s) => {
                const Icon = icons[s.key];
                return (
                  <Link key={s.key} href={s.slug} className="card group flex flex-col p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-110">
                      {Icon && <Icon className="h-6 w-6" aria-hidden />}
                    </span>
                    <h3 className="mt-4 text-lg font-extrabold">{s.name}</h3>
                    <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">
                      {s.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-brand-black">
                      Explore
                      <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Numbers */}
        <MetricsBand />

        {/* Operating standards */}
        <section className="section-pad py-14 lg:py-16">
          <p className="eyebrow">How we operate</p>
          <h2 className="mt-2 max-w-2xl text-2xl font-extrabold tracking-tight sm:text-3xl">
            Standards that make us dependable
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted sm:text-base">
            The details that matter when your goods — and your reputation — are on
            the move.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {standards.map(({ icon: Icon, title, text }) => (
              <div key={title} className="card flex gap-4 p-6">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                  <Icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-extrabold">{title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Coverage + CTA */}
        <section className="section-pad pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-brand-black px-8 py-12 text-white sm:px-12">
            <Image
              src={images.containersAerial.src}
              alt=""
              fill
              sizes="(min-width: 1024px) 100vw, 0px"
              className="object-cover opacity-20"
              aria-hidden
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/85 to-brand-black/50" />
            <div className="relative grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-center">
              <div>
                <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Operating across India —{" "}
                  <span className="text-brand-yellow">and beyond the port.</span>
                </h2>
                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/70 sm:text-base">
                  All 28 states through our verified fleet-partner network, with
                  strong lanes around Surat, Nashik, Mumbai, Pune and Bengaluru.
                  International freight moves through India&apos;s major ports and
                  airports, door to door.
                </p>
                <ul className="mt-5 grid gap-2 text-sm text-white/80 sm:grid-cols-2">
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                    Pan-India FTL &amp; PTL movement
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                    FCL, LCL and air freight
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                    Cold-chain from farm gate
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 shrink-0 text-brand-yellow" aria-hidden />
                    House &amp; office relocation
                  </li>
                </ul>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur">
                <p className="font-extrabold text-brand-yellow">Talk to a human</p>
                <p className="mt-1.5 text-sm text-white/75">
                  Our desk replies within 2 business hours, Monday–Sunday, 8 AM – 10 PM.
                </p>
                <div className="mt-5 flex flex-col gap-2">
                  <Link href="/#cta" className="btn-primary w-full">
                    Request a quote
                  </Link>
                  <Link href="/support" className="btn-secondary w-full">
                    Contact support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

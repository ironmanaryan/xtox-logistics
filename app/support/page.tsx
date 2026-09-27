import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import Link from "next/link";
import {
  Headset,
  Truck,
  Package,
  Building2,
  Ship,
  Wheat,
  ArrowUpRight,
  MapPin,
  Phone,
  Mail,
  Clock3,
  Navigation,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Customer Support",
  description:
    "Reach the right XtoX desk: customer support, driver partners, packers & movers, enterprise services, import/export and agri partners. Visit our Bangalore head office or talk to us 7 days a week.",
};

const supportCategories = [
  {
    icon: Headset,
    title: "Customer Support",
    desc: "Order updates, tracking help, billing questions and general assistance.",
    href: "/#cta",
    cta: "Talk to support",
  },
  {
    icon: Truck,
    title: "Drive with XtoX",
    desc: "Driver onboarding, load offers, payments and fuel & toll support.",
    href: "/drivers",
    cta: "Driver partners",
  },
  {
    icon: Package,
    title: "Packers and Movers",
    desc: "Home & office shifting quotes, surveys, move-day coordination.",
    href: "/services/packers-movers",
    cta: "Plan a move",
  },
  {
    icon: Building2,
    title: "Enterprise Services",
    desc: "Contracted fleets, dedicated lanes, SLAs and account management.",
    href: "/services/sme-transport",
    cta: "Enterprise desk",
  },
  {
    icon: Ship,
    title: "Import Export",
    desc: "Customs clearance, documentation, freight bookings and EXIM help.",
    href: "/services/import-export",
    cta: "EXIM support",
  },
  {
    icon: Wheat,
    title: "Agri Partner",
    desc: "Farmer agri-export, cold-chain booking and market intelligence.",
    href: "/services/agri-export",
    cta: "Agri desk",
  },
];

const offices = [
  {
    label: "Our Head Office",
    city: "Bangalore",
    lines: [
      "BMTC Complex, Outer Ring Road,",
      "Old Madiwala, Kuvempu Nagar,",
      "BTM Layout 2nd Stage,",
      "Bengaluru, Karnataka 560068, India",
    ],
    mapSrc:
      "https://www.google.com/maps?q=BMTC+Complex,+Outer+Ring+Road,+Old+Madiwala,+Kuvempu+Nagar,+BTM+Layout+2nd+Stage,+Bengaluru,+Karnataka+560068&output=embed",
    directions:
      "https://www.google.com/maps/dir/?api=1&destination=BMTC+Complex,+Outer+Ring+Road,+Old+Madiwala,+Kuvempu+Nagar,+BTM+Layout+2nd+Stage,+Bengaluru,+Karnataka+560068",
  },
];

export default function SupportPage() {
  return (
    <>
      <Navbar />
      <main>
        <PageHero
          eyebrow="Customer Support"
          title="We pick up. We reply."
          highlight="We resolve."
          description="One team for every service — reach the right desk in one click, or walk into our head office in Bangalore."
        />

        {/* Support categories */}
        <div className="section-pad py-14">
          <h2 className="text-2xl font-extrabold tracking-tight">
            Choose your desk
          </h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {supportCategories.map((c) => (
              <Link
                key={c.title}
                href={c.href}
                className="card group flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-hero"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow text-brand-black transition-transform duration-300 group-hover:scale-110">
                  <c.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 flex items-center gap-2 font-extrabold">
                  {c.title}
                  <ArrowUpRight
                    className="h-4 w-4 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-black"
                    aria-hidden
                  />
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {c.desc}
                </p>
                <span className="mt-4 text-sm font-bold text-brand-black">
                  {c.cta} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick contact band */}
        <div className="section-pad pb-14">
          <div className="grid gap-4 rounded-3xl border border-line bg-neutral-50 p-8 sm:grid-cols-3">
            <a href="tel:+917875488307" className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-muted">Call us</span>
                <span className="block text-sm font-extrabold">+91 78754 88307</span>
              </span>
            </a>
            <a href="mailto:xtoxlogistics.info@gmail.com" className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className="block text-xs font-bold uppercase tracking-wider text-muted">Email</span>
                <span className="block truncate text-sm font-extrabold">xtoxlogistics.info@gmail.com</span>
              </span>
            </a>
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                <Clock3 className="h-5 w-5" aria-hidden />
              </span>
              <span>
                <span className="block text-xs font-bold uppercase tracking-wider text-muted">Hours</span>
                <span className="block text-sm font-extrabold">Mon–Sun · 8 AM – 10 PM</span>
              </span>
            </div>
          </div>
        </div>

        {/* Offices + live map */}
        <div className="section-pad pb-20">
          <h2 className="text-2xl font-extrabold tracking-tight">Our Offices</h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.4fr]">
            {offices.map((o) => (
              <div key={o.city} className="card p-7">
                <span className="chip-yellow">
                  <MapPin className="h-3.5 w-3.5" aria-hidden />
                  {o.label}
                </span>
                <h3 className="mt-4 text-2xl font-extrabold">{o.city}</h3>
                <address className="mt-3 text-sm not-italic leading-relaxed text-muted">
                  {o.lines.map((l) => (
                    <span key={l} className="block">
                      {l}
                    </span>
                  ))}
                </address>
                <a
                  href={o.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6"
                >
                  <Navigation className="h-4 w-4" aria-hidden />
                  Get Directions
                </a>
              </div>
            ))}

            <div className="overflow-hidden rounded-3xl border border-line shadow-hero">
              <iframe
                title="XtoX Logistics Head Office — BTM Layout, Bengaluru"
                src={offices[0].mapSrc}
                className="h-[420px] w-full border-0 lg:h-full lg:min-h-[420px]"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

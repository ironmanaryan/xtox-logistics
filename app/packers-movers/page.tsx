import type { Metadata } from "next";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { cities, corridors } from "@/data/cities";
import { socialMetadata } from "@/lib/site";
import { company } from "@/data/company";
import { ArrowRight, PhoneCall } from "lucide-react";

const title = "Packers & Movers City Routes";
const description =
  "Intercity household and office moving across Bengaluru, Hyderabad, Chennai, Mumbai, Pune, Delhi NCR, Kochi and Coimbatore — indicative prices and free surveys on every lane.";

export const metadata: Metadata = {
  title,
  description,
  ...socialMetadata({ title, description, path: "/packers-movers" }),
};

export default function CorridorIndexPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="section-pad pt-14">
          <p className="eyebrow">Packers &amp; Movers · Routes</p>
          <h1 className="mt-2 max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
            Moving between India&apos;s working cities.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted">
            Pick your lane for an indicative price, transit estimate and the areas we cover on
            both ends. Every route gets a free survey before the quote is fixed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services/packers-movers/book" className="btn-primary">
              Get a fixed quote <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a href={`tel:${company.phoneE164}`} className="btn-secondary">
              <PhoneCall className="h-4 w-4" aria-hidden /> {company.phone}
            </a>
          </div>
        </section>

        <section className="section-pad grid gap-6 pb-20 sm:grid-cols-2 lg:grid-cols-3">
          {cities.map((city) => (
            <div key={city.slug} className="card p-5">
              <h2 className="text-lg font-extrabold">From {city.name}</h2>
              <p className="mt-1 text-xs text-muted">
                {city.state} · {city.areas.slice(0, 3).join(", ")}
              </p>
              <ul className="mt-3 space-y-1.5">
                {corridors
                  .filter((c) => c.from.slug === city.slug)
                  .map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/packers-movers/${c.slug}`}
                        className="text-sm font-semibold underline-offset-2 hover:underline"
                      >
                        Packers and movers {c.from.name} to {c.to.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}

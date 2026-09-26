import Link from "next/link";
import Logo from "./Logo";
import { services } from "@/data/services";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="section-pad grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo variant="full" className="h-9 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            One logistics partner for businesses, families, SMEs and farmers —
            moving India&apos;s goods X to X, door to door.
          </p>
          <div className="mt-5 flex flex-col gap-1.5 text-sm text-muted">
            <a href="tel:+910000000000" className="hover:text-brand-black">
              📞 +91 00000 00000
            </a>
            <a href="mailto:hello@xtoxlogistics.com" className="hover:text-brand-black">
              ✉️ hello@xtoxlogistics.com
            </a>
          </div>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider">Services</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {services.map((s) => (
              <li key={s.key}>
                <Link href={s.slug} className="transition-colors hover:text-brand-black">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider">Company</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            <li><Link href="/#services" className="hover:text-brand-black">Why XtoX</Link></li>
            <li><Link href="/#industries" className="hover:text-brand-black">Industries</Link></li>
            <li><Link href="/drivers" className="hover:text-brand-black">Driver Partners</Link></li>
            <li><Link href="/#cta" className="hover:text-brand-black">Get a Quote</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-bold uppercase tracking-wider">Get started</p>
          <p className="mt-4 text-sm text-muted">
            Tell us what moves — we&apos;ll move it.
          </p>
          <Link href="/#cta" className="btn-primary mt-4">
            Request a Quote
          </Link>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="section-pad flex flex-col items-center justify-between gap-2 py-5 text-xs text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} XtoX Logistics. All rights reserved.</p>
          <p>Moving India&apos;s goods — X to X.</p>
        </div>
      </div>
    </footer>
  );
}

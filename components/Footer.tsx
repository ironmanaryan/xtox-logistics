import Link from "next/link";
import { Phone, Mail } from "lucide-react";
import Logo from "./Logo";
import { services } from "@/data/services";

function InstagramIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

const resources = [
  { href: "/resources/articles", label: "Articles" },
  { href: "/resources/case-studies", label: "Case Studies" },
  { href: "/resources/faq", label: "FAQ" },
  { href: "/resources/blog", label: "Blog" },
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="section-pad grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Logo variant="full" className="h-16 w-auto" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
            One logistics partner for businesses, families, SMEs and farmers —
            moving India&apos;s goods X to X, door to door.
          </p>
          <div className="mt-5 flex flex-col gap-1.5 text-sm text-muted">
            <a href="tel:+917875488307" className="flex items-center gap-2 hover:text-brand-black">
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +91 78754 88307
            </a>
            <a href="mailto:xtoxlogistics.info@gmail.com" className="flex items-center gap-2 hover:text-brand-black">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              xtoxlogistics.info@gmail.com
            </a>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <a
              href="https://instagram.com/xtoxlogisticsindia"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="XtoX Logistics on Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-all duration-300 hover:border-brand-black hover:bg-brand-black hover:text-white"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
            <a
              href="https://www.linkedin.com/company/xtox-logistics"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="XtoX Logistics on LinkedIn"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-line text-muted transition-all duration-300 hover:border-brand-black hover:bg-brand-black hover:text-white"
            >
              <LinkedinIcon className="h-4 w-4" />
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
          <p className="text-sm font-bold uppercase tracking-wider">Resources</p>
          <ul className="mt-4 space-y-2.5 text-sm text-muted">
            {resources.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="transition-colors hover:text-brand-black">
                  {r.label}
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
            <li><Link href="/support" className="hover:text-brand-black">Customer Support</Link></li>
            <li><Link href="/#cta" className="hover:text-brand-black">Get a Quote</Link></li>
          </ul>
          <Link href="/#cta" className="btn-primary mt-5 !px-5 !py-2.5">
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

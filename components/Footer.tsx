"use client";

import Link from "next/link";
import { ArrowRight, Phone, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { useI18n } from "./LanguageProvider";
import { services } from "@/data/services";
import { company, registeredAddress } from "@/data/company";
import type { TKey } from "@/lib/i18n";

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

const SERVICE_NAME_KEY: Record<string, TKey> = {
  "packers-movers": "svc.pm.name",
  "import-export": "svc.ie.name",
  "sme-transport": "svc.sme.name",
  "agri-export": "svc.agri.name",
};

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm font-extrabold uppercase tracking-wider text-brand-black">
      {children}
      <span aria-hidden className="mt-2 block h-1 w-8 rounded-full bg-brand-yellow" />
    </p>
  );
}

export default function Footer() {
  const { t } = useI18n();

  const resources = [
    { href: "/resources/articles", label: t("nav.res.articles") },
    { href: "/resources/case-studies", label: t("nav.res.caseStudies") },
    { href: "/resources/faq", label: t("nav.res.faq") },
    { href: "/resources/blog", label: t("nav.res.blog") },
  ];

  const legal = [
    { href: "/terms", label: t("footer.terms") },
    { href: "/privacy", label: t("footer.privacy") },
    { href: "/refund-policy", label: t("footer.refund") },
  ];

  const linkCls = "transition-colors hover:text-brand-black";

  return (
    <footer className="bg-brand-yellow">
      <div className="section-pad py-10 sm:py-14">
        <div className="overflow-hidden rounded-3xl bg-white shadow-card">
          <div className="grid gap-9 p-7 sm:p-10 lg:grid-cols-6 lg:gap-8">
            <div className="lg:col-span-2">
              <Logo variant="full" className="h-14 w-auto" />
              <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
                {t("footer.blurb")}
              </p>

              <div className="mt-6 flex flex-col gap-3 text-sm">
                <a
                  href={`tel:${company.phoneE164}`}
                  className="flex items-center gap-3 font-semibold text-brand-black transition-colors hover:text-brand-black/70"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                    <Phone className="h-4 w-4" aria-hidden />
                  </span>
                  {company.phone}
                </a>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 font-semibold text-brand-black transition-colors hover:text-brand-black/70"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                    <Mail className="h-4 w-4" aria-hidden />
                  </span>
                  {company.email}
                </a>
                <span className="flex items-start gap-3 text-muted">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-black">
                    <MapPin className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="leading-relaxed">
                    <span className="font-bold text-brand-black">{t("footer.registered")}:</span>{" "}
                    {registeredAddress}
                  </span>
                </span>
              </div>

              <div className="mt-5 flex items-center gap-2.5">
                <a
                  href={company.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="XtoX Logistics on Instagram"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-brand-black transition-all duration-300 hover:border-brand-black hover:bg-brand-black hover:text-brand-yellow"
                >
                  <InstagramIcon className="h-4 w-4" />
                </a>
                <a
                  href={company.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="XtoX Logistics on LinkedIn"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-line bg-white text-brand-black transition-all duration-300 hover:border-brand-black hover:bg-brand-black hover:text-brand-yellow"
                >
                  <LinkedinIcon className="h-4 w-4" />
                </a>
              </div>
            </div>

            <div>
              <ColumnTitle>{t("footer.services")}</ColumnTitle>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                {services.map((s) => (
                  <li key={s.key}>
                    <Link href={s.slug} className={linkCls}>
                      {SERVICE_NAME_KEY[s.key] ? t(SERVICE_NAME_KEY[s.key]) : s.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ColumnTitle>{t("footer.resources")}</ColumnTitle>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                {resources.map((r) => (
                  <li key={r.href}>
                    <Link href={r.href} className={linkCls}>
                      {r.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <ColumnTitle>{t("footer.company")}</ColumnTitle>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                <li><Link href="/about" className={linkCls}>{t("footer.about")}</Link></li>
                <li><Link href="/packers-movers/bengaluru-to-hyderabad" className={linkCls}>Bengaluru → Hyderabad</Link></li>
                <li><Link href="/drivers" className={linkCls}>{t("footer.drivers")}</Link></li>
                <li><Link href="/support" className={linkCls}>{t("footer.support")}</Link></li>
                <li><Link href="/resources/faq" className={linkCls}>{t("footer.faqs")}</Link></li>
                <li><Link href="/#cta" className={linkCls}>{t("nav.quote")}</Link></li>
              </ul>
            </div>

            <div>
              <ColumnTitle>{t("footer.legal")}</ColumnTitle>
              <ul className="mt-5 space-y-2.5 text-sm text-muted">
                {legal.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className={linkCls}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href="/#cta"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-black px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-black/90"
              >
                {t("footer.requestQuote")}
                <ArrowRight className="h-4 w-4 text-brand-yellow" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-t border-line bg-neutral-50/70 px-7 py-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between sm:px-10">
            <p className="font-semibold text-brand-black">{company.legalName}</p>
            {company.gstin ? <p>GSTIN: {company.gstin}</p> : null}
            {company.cin ? <p>CIN: {company.cin}</p> : null}
            <p>
              {t("footer.jurisdiction")}: {company.legal.jurisdiction}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-brand-black">
        <div className="section-pad flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {company.legalName}. {t("footer.rights")}
          </p>
          <nav aria-label={t("footer.legal")} className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            {legal.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-brand-yellow">
                {l.label}
              </Link>
            ))}
          </nav>
          <p className="text-white/70">{t("footer.tagline")}</p>
        </div>
      </div>
    </footer>
  );
}

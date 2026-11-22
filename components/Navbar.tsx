"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LogIn,
  UserPlus,
  Newspaper,
  BookOpen,
  HelpCircle,
  PenLine,
  ArrowRight,
} from "lucide-react";
import Logo from "./Logo";
import LanguageToggle from "./LanguageToggle";
import { useI18n } from "./LanguageProvider";
import type { TKey } from "@/lib/i18n";
import { services } from "@/data/services";
import { features } from "@/data/company";

const resources: {
  slug: string;
  labelKey: TKey;
  descKey: TKey;
  icon: typeof Newspaper;
}[] = [
  { slug: "/resources/articles", labelKey: "nav.res.articles", descKey: "nav.res.articlesDesc", icon: Newspaper },
  { slug: "/resources/case-studies", labelKey: "nav.res.caseStudies", descKey: "nav.res.caseStudiesDesc", icon: BookOpen },
  { slug: "/resources/faq", labelKey: "nav.res.faq", descKey: "nav.res.faqDesc", icon: HelpCircle },
  { slug: "/resources/blog", labelKey: "nav.res.blog", descKey: "nav.res.blogDesc", icon: PenLine },
];

const SERVICE_NAME: Record<string, TKey> = {
  "packers-movers": "svc.pm.name",
  "import-export": "svc.ie.name",
  "sme-transport": "svc.sme.name",
  "agri-export": "svc.agri.name",
};

const SERVICE_TAGLINE: Record<string, TKey> = {
  "packers-movers": "svc.pm.tagline",
  "import-export": "svc.ie.tagline",
  "sme-transport": "svc.sme.tagline",
  "agri-export": "svc.agri.tagline",
};

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const pathname = usePathname();
  const resTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
    setResOpen(false);
  }, [pathname]);

  const openRes = () => {
    if (resTimeout.current) clearTimeout(resTimeout.current);
    setResOpen(true);
  };
  const closeRes = () => {
    resTimeout.current = setTimeout(() => setResOpen(false), 120);
  };

  const linkCls = (href: string) =>
    `text-sm font-semibold transition-colors duration-200 ${
      pathname === href ? "text-brand-black" : "text-muted hover:text-brand-black"
    }`;

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-white/90 backdrop-blur transition-shadow duration-300 ${
        scrolled ? "border-line shadow-sm" : "border-transparent"
      }`}
    >
      <nav className="section-pad flex h-20 items-center justify-between gap-4">
        <Logo variant="full" className="h-14 w-auto" />

        <div className="hidden items-center gap-7 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setDropOpen(true)}
            onMouseLeave={() => setDropOpen(false)}
          >
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-brand-black"
              aria-expanded={dropOpen}
              aria-haspopup="true"
              onClick={() => setDropOpen((v) => !v)}
            >
              {t("nav.services")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            <div
              className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                dropOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="grid grid-cols-2 gap-1 rounded-2xl border border-line bg-white p-2 shadow-hero">
                {services.map((s) => (
                  <Link
                    key={s.key}
                    href={s.slug}
                    className="group rounded-xl p-3 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    <p className="text-sm font-bold text-brand-black">
                      {SERVICE_NAME[s.key] ? t(SERVICE_NAME[s.key]) : s.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted">
                      {SERVICE_TAGLINE[s.key] ? t(SERVICE_TAGLINE[s.key]) : s.tagline}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="relative" onMouseEnter={openRes} onMouseLeave={closeRes}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-brand-black"
              aria-expanded={resOpen}
              aria-haspopup="true"
              onClick={() => setResOpen((v) => !v)}
            >
              {t("nav.resources")}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-200 ${resOpen ? "rotate-180" : ""}`}
                aria-hidden
              />
            </button>

            <div
              className={`absolute left-1/2 top-full w-80 -translate-x-1/2 pt-3 transition-all duration-200 ${
                resOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"
              }`}
            >
              <div className="flex flex-col gap-1 rounded-2xl border border-line bg-white p-2 shadow-hero">
                {resources.map((r) => (
                  <Link
                    key={r.slug}
                    href={r.slug}
                    className="group flex items-center gap-3 rounded-xl p-3 transition-colors duration-200 hover:bg-neutral-50"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-yellow text-brand-black">
                      <r.icon className="h-4 w-4" aria-hidden />
                    </span>
                    <span>
                      <span className="block text-sm font-bold text-brand-black">{t(r.labelKey)}</span>
                      <span className="block text-xs text-muted">{t(r.descKey)}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/about" className={linkCls("/about")}>
            {t("nav.company")}
          </Link>
          <Link href="/#industries" className={linkCls("/#industries")}>
            {t("nav.industries")}
          </Link>
          <Link href="/support" className={linkCls("/support")}>
            {t("nav.support")}
          </Link>
          <Link href="/#cta" className={linkCls("/#cta")}>
            {t("nav.quote")}
          </Link>
        </div>

        <div className="hidden items-center gap-4 lg:flex">
          <LanguageToggle />
          {features.customerLogin && (
            <Link
              href="/login"
              className="text-sm font-semibold text-muted transition-colors hover:text-brand-black"
            >
              {t("nav.login")}
            </Link>
          )}
          <Link href="/#cta" className="btn-primary !px-6 !py-2.5">
            {t("nav.quote")}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>

        <LanguageToggle className="lg:hidden" />

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={t("nav.menu")}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" d="M6 6l12 12M6 18L18 6" />
            </svg>
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          )}
        </button>
      </nav>

      {mobileOpen && (
        <div className="max-h-[80vh] overflow-y-auto border-t border-line bg-white lg:hidden">
          <div className="section-pad flex flex-col gap-1 py-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="eyebrow">{t("nav.language")}</span>
              <LanguageToggle />
            </div>
            <p className="eyebrow mb-1">{t("nav.services")}</p>
            {services.map((s) => (
              <Link key={s.key} href={s.slug} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
                {SERVICE_NAME[s.key] ? t(SERVICE_NAME[s.key]) : s.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <p className="eyebrow mb-1">{t("nav.resources")}</p>
            {resources.map((r) => (
              <Link key={r.slug} href={r.slug} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
                {t(r.labelKey)}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link href="/drivers" className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
              {t("nav.drivers")}
            </Link>
            <Link href="/support" className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
              {t("nav.support")}
            </Link>
            <Link href="/about" className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
              {t("nav.company")}
            </Link>
            <div className="my-2 h-px bg-line" />
            <p className="eyebrow mb-1">{t("nav.legal")}</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/terms" className="chip hover:border-brand-black">
                {t("nav.terms")}
              </Link>
              <Link href="/privacy" className="chip hover:border-brand-black">
                {t("nav.privacy")}
              </Link>
              <Link href="/refund-policy" className="chip hover:border-brand-black">
                {t("nav.refund")}
              </Link>
            </div>
            {features.customerLogin && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <Link href="/login" className="btn-secondary !px-3">
                  <LogIn className="h-4 w-4" aria-hidden />
                  {t("nav.login")}
                </Link>
                <Link href="/signup" className="btn-primary !px-3">
                  <UserPlus className="h-4 w-4" aria-hidden />
                  {t("nav.signup")}
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

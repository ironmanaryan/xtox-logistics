"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, LogIn, UserPlus, Newspaper, BookOpen, HelpCircle, PenLine } from "lucide-react";
import Logo from "./Logo";
import { services } from "@/data/services";

const resources = [
  { slug: "/resources/articles", label: "Articles", desc: "Guides on logistics & shipping", icon: Newspaper },
  { slug: "/resources/case-studies", label: "Case Studies", desc: "Real results from real clients", icon: BookOpen },
  { slug: "/resources/faq", label: "FAQ", desc: "Answers to common questions", icon: HelpCircle },
  { slug: "/resources/blog", label: "Blog", desc: "News & industry updates", icon: PenLine },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const [resOpen, setResOpen] = useState(false);
  const pathname = usePathname();
  const resTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

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
          {/* Services dropdown */}
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
              Services
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
                    <p className="text-sm font-bold text-brand-black">{s.name}</p>
                    <p className="mt-0.5 text-xs text-muted">{s.tagline}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Resources dropdown */}
          <div className="relative" onMouseEnter={openRes} onMouseLeave={closeRes}>
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-semibold text-muted transition-colors hover:text-brand-black"
              aria-expanded={resOpen}
              aria-haspopup="true"
              onClick={() => setResOpen((v) => !v)}
            >
              Resources
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
                      <span className="block text-sm font-bold text-brand-black">{r.label}</span>
                      <span className="block text-xs text-muted">{r.desc}</span>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <Link href="/#services" className={linkCls("/#services")}>
            Why XtoX
          </Link>
          <Link href="/#industries" className={linkCls("/#industries")}>
            Industries
          </Link>
          <Link href="/support" className={linkCls("/support")}>
            Support
          </Link>
          <Link href="/#cta" className={linkCls("/#cta")}>
            Get a Quote
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-sm font-semibold text-brand-black transition-all duration-300 hover:border-brand-black hover:bg-brand-black hover:text-white"
          >
            <LogIn className="h-4 w-4" aria-hidden />
            Login
          </Link>
          <Link href="/signup" className="btn-primary !px-5 !py-2.5">
            <UserPlus className="h-4 w-4" aria-hidden />
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-line lg:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
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
            <p className="eyebrow mb-1">Services</p>
            {services.map((s) => (
              <Link key={s.key} href={s.slug} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
                {s.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <p className="eyebrow mb-1">Resources</p>
            {resources.map((r) => (
              <Link key={r.slug} href={r.slug} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
                {r.label}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link href="/drivers" className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
              Driver Partners
            </Link>
            <Link href="/support" className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
              Customer Support
            </Link>
            <div className="mt-2 grid grid-cols-2 gap-2">
              <Link href="/login" className="btn-secondary !px-3">
                <LogIn className="h-4 w-4" aria-hidden />
                Login
              </Link>
              <Link href="/signup" className="btn-primary !px-3">
                <UserPlus className="h-4 w-4" aria-hidden />
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

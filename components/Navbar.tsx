"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import { services } from "@/data/services";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropOpen(false);
  }, [pathname]);

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
      <nav className="section-pad flex h-16 items-center justify-between">
        <Link href="/" aria-label="XtoX Logistics home" className="flex items-center">
          <Logo variant="full" className="h-9 w-auto" />
        </Link>

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
              Services
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-200 ${dropOpen ? "rotate-180" : ""}`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <div
              className={`absolute left-1/2 top-full w-[560px] -translate-x-1/2 pt-3 transition-all duration-200 ${
                dropOpen
                  ? "visible translate-y-0 opacity-100"
                  : "invisible -translate-y-1 opacity-0"
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

          <Link href="/#services" className={linkCls("/#services")}>
            Why XtoX
          </Link>
          <Link href="/#industries" className={linkCls("/#industries")}>
            Industries
          </Link>
          <Link href="/#cta" className={linkCls("/#cta")}>
            Get a Quote
          </Link>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/drivers" className="btn-primary !px-5 !py-2.5">
            Become Driver Partner
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
        <div className="border-t border-line bg-white lg:hidden">
          <div className="section-pad flex flex-col gap-1 py-4">
            <p className="eyebrow mb-1">Services</p>
            {services.map((s) => (
              <Link key={s.key} href={s.slug} className="rounded-xl px-3 py-2.5 text-sm font-semibold hover:bg-neutral-50">
                {s.name}
              </Link>
            ))}
            <div className="my-2 h-px bg-line" />
            <Link href="/drivers" className="btn-primary mt-1">
              Become Driver Partner
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

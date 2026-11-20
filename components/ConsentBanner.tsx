"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "xtox-consent";
export type ConsentChoice = "all" | "essential";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const value = localStorage.getItem(KEY);
    return value === "all" || value === "essential" ? value : null;
  } catch {
    return null;
  }
}

/**
 * India DPDP-aligned consent banner. Analytics and marketing tags are only
 * loaded when the visitor chooses "Accept all"; essential cookies always work.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!readConsent()) setVisible(true);
  }, []);

  const choose = (choice: ConsentChoice) => {
    try {
      localStorage.setItem(KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("xtox:consent", { detail: choice }));
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie and data consent"
      className="fixed inset-x-3 bottom-[72px] z-[60] rounded-2xl border border-line bg-white p-5 shadow-hero sm:inset-x-auto sm:bottom-6 sm:left-6 sm:max-w-md"
    >
      <p className="text-sm font-extrabold">Your privacy, your choice</p>
      <p className="mt-1.5 text-xs leading-relaxed text-muted">
        We use essential cookies to run the site and, with your consent,
        analytics cookies to understand how it is used. No advertising cookies
        are set without permission. Read our{" "}
        <Link href="/privacy" className="font-semibold text-brand-black underline underline-offset-2">
          Privacy Policy
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => choose("all")}
          className="btn-primary flex-1 !py-2.5 !text-sm"
        >
          Accept all
        </button>
        <button
          type="button"
          onClick={() => choose("essential")}
          className="btn-secondary flex-1 !py-2.5 !text-sm"
        >
          Essential only
        </button>
      </div>
    </div>
  );
}

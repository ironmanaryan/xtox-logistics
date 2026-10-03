"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, MapPin } from "lucide-react";

type HomeSize = "1BHK" | "2BHK" | "3BHK" | "Villa" | "Office";

const HOME_SIZES: HomeSize[] = ["1BHK", "2BHK", "3BHK", "Villa", "Office"];

/** Indicative starting prices shown instantly (final price locked after survey). */
const STARTING_AT: Record<HomeSize, string> = {
  "1BHK": "₹7,499",
  "2BHK": "₹11,999",
  "3BHK": "₹16,999",
  Villa: "₹27,999",
  Office: "₹23,999",
};

function validIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function PackersInquiryBar() {
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [homeSize, setHomeSize] = useState<HomeSize>("2BHK");
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [quoted, setQuoted] = useState(false);

  const pickSize = (s: HomeSize) => {
    setHomeSize(s);
    setQuoted(false);
    try {
      sessionStorage.setItem("xtox-move-type", s);
      window.dispatchEvent(new CustomEvent("xtox:homesize", { detail: s }));
    } catch {
      /* storage unavailable — ignore */
    }
  };

  const onCheckPrice = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError(null);
    setFormError(null);

    if (!pickup.trim() || !drop.trim() || !date) {
      setFormError("Please fill pickup location, drop location and shifting date.");
      return;
    }
    if (!validIndianPhone(phone)) {
      setPhoneError("Enter valid mobile number");
      return;
    }

    try {
      sessionStorage.setItem("xtox-move-type", homeSize);
      window.dispatchEvent(new CustomEvent("xtox:homesize", { detail: homeSize }));
    } catch {
      /* ignore */
    }
    setQuoted(true);
    document.getElementById("estimate")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-hero sm:p-6">
      {/* city strip */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-black px-3 py-1.5 text-xs font-bold text-white">
          <MapPin className="h-3.5 w-3.5 text-brand-yellow" aria-hidden />
          Pan-India
        </span>
        <span className="text-xs font-semibold text-muted">
          Serving 28 states — local &amp; intercity moves
        </span>
      </div>

      {/* home size */}
      <div className="mt-4">
        <span className="label">Home size</span>
        <div className="flex flex-wrap gap-2">
          {HOME_SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => pickSize(s)}
              aria-pressed={homeSize === s}
              className={`rounded-xl border px-4 py-2 text-sm font-bold transition-all duration-300 ${
                homeSize === s
                  ? "border-brand-black bg-brand-black text-white"
                  : "border-line bg-white text-brand-black hover:border-brand-black"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* inquiry fields */}
      <form onSubmit={onCheckPrice} className="mt-4 grid gap-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end">
        <div>
          <label htmlFor="pk-pickup" className="label">
            Pickup location <span className="text-red-500">*</span>
          </label>
          <input
            id="pk-pickup"
            className="input"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            placeholder="BTM 2nd Stage, Bengaluru…"
          />
        </div>
        <div>
          <label htmlFor="pk-drop" className="label">
            Drop location <span className="text-red-500">*</span>
          </label>
          <input
            id="pk-drop"
            className="input"
            value={drop}
            onChange={(e) => setDrop(e.target.value)}
            placeholder="HSR Layout, Bengaluru…"
          />
        </div>
        <div>
          <label htmlFor="pk-phone" className="label">
            Phone number <span className="text-red-500">*</span>
          </label>
          <input
            id="pk-phone"
            type="tel"
            inputMode="numeric"
            className="input"
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError(null);
            }}
            placeholder="98765 43210"
          />
          {phoneError && <p className="mt-1 text-xs font-medium text-red-600">{phoneError}</p>}
        </div>
        <div>
          <label htmlFor="pk-date" className="label">
            Shifting date <span className="text-red-500">*</span>
          </label>
          <input
            id="pk-date"
            type="date"
            min={todayISO()}
            className="input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-primary whitespace-nowrap !px-8 !py-3.5">
          Check Price
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>
      </form>

      {formError && (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
          {formError}
        </p>
      )}

      {quoted && !formError && (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-line bg-neutral-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-start gap-2 text-sm">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" aria-hidden />
            <span>
              <strong>
                {homeSize} moves starting at {STARTING_AT[homeSize]}.
              </strong>{" "}
              <span className="text-muted">
                Our executive will call for a quick video survey to lock your exact price.
              </span>
            </span>
          </p>
          <a href="#estimate" className="btn-secondary shrink-0 !px-4 !py-2 text-xs">
            Detailed estimate
          </a>
        </div>
      )}
    </div>
  );
}

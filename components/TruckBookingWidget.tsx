"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CreditCard,
  IndianRupee,
  MapPin,
  Truck,
  Users,
} from "lucide-react";

type VehicleKey = "three-wheeler" | "tata-ace" | "truck-14ft" | "bhk1" | "bhk2";

interface Vehicle {
  key: VehicleKey;
  name: string;
  capacity: string;
  base: number;
  perKm: number;
}

const VEHICLES: Vehicle[] = [
  { key: "three-wheeler", name: "3-Wheeler", capacity: "Up to 500 kg", base: 349, perKm: 18 },
  { key: "tata-ace", name: "Tata Ace", capacity: "Up to 750 kg", base: 599, perKm: 24 },
  { key: "truck-14ft", name: "14ft Truck", capacity: "Up to 3.5 tonne", base: 1199, perKm: 32 },
  { key: "bhk1", name: "1 BHK Shifting", capacity: "Full house + crew", base: 4999, perKm: 30 },
  { key: "bhk2", name: "2 BHK Shifting", capacity: "Full house + crew", base: 7999, perKm: 35 },
];

const HELPER_1 = 399;
const HELPER_2 = 749;
const DISMANTLING = 799;
const INSURANCE_RATE = 0.02;

const STEPS = ["Route & Truck", "Fixed Price", "Add-ons", "Book & Track"];

function validIndianPhone(raw: string): boolean {
  const digits = raw.replace(/\D/g, "").replace(/^(91|0)/, "");
  return /^[6-9]\d{9}$/.test(digits);
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function makeBookingId(): string {
  return "XTX-" + Math.random().toString(36).slice(2, 8).toUpperCase();
}

export default function TruckBookingWidget() {
  const [step, setStep] = useState(0);
  const [pickup, setPickup] = useState("");
  const [drop, setDrop] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [distance, setDistance] = useState("12");
  const [vehicleKey, setVehicleKey] = useState<VehicleKey>("tata-ace");
  const [helpers, setHelpers] = useState<0 | 1 | 2>(0);
  const [dismantling, setDismantling] = useState(false);
  const [insurance, setInsurance] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [payMode, setPayMode] = useState<"online" | "cod">("online");
  const [error, setError] = useState<string | null>(null);
  const [bookingId] = useState(makeBookingId);

  const vehicle = VEHICLES.find((v) => v.key === vehicleKey) ?? VEHICLES[1];

  const price = useMemo(() => {
    const km = Math.max(0, parseFloat(distance) || 0);
    const fare = vehicle.base + Math.round(km * vehicle.perKm);
    const helperCharge = helpers === 1 ? HELPER_1 : helpers === 2 ? HELPER_2 : 0;
    const dismantlingCharge = dismantling ? DISMANTLING : 0;
    const subtotal = fare + helperCharge + dismantlingCharge;
    const insuranceCharge = insurance ? Math.round(subtotal * INSURANCE_RATE) : 0;
    const preGst = subtotal + insuranceCharge;
    const gst = Math.round(preGst * 0.18);
    return { km, fare, helperCharge, dismantlingCharge, insuranceCharge, gst, total: preGst + gst };
  }, [distance, vehicle, helpers, dismantling, insurance]);

  const inr = (n: number) => `₹${n.toLocaleString("en-IN")}`;

  const nextFromStep0 = () => {
    if (!pickup.trim() || !drop.trim() || !date || !time || !(parseFloat(distance) > 0)) {
      setError("Please fill pickup, drop, date, time and a valid distance.");
      return;
    }
    setError(null);
    setStep(1);
  };

  const book = () => {
    if (!name.trim()) {
      setError("Please enter your name for the booking.");
      return;
    }
    if (!validIndianPhone(phone)) {
      setError("Enter valid mobile number for driver OTP & tracking updates.");
      return;
    }
    setError(null);
    setStep(4);
  };

  if (step === 4) {
    return (
      <div className="card p-6 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
          <CheckCircle2 className="h-7 w-7" aria-hidden />
        </span>
        <p className="eyebrow mt-4 justify-center">Booking confirmed</p>
        <h3 className="mt-2 text-2xl font-extrabold">
          {vehicle.name} booked for {inr(price.total)}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-muted">
          Booking ID <strong className="text-brand-black">{bookingId}</strong> • {pickup.trim()} →{" "}
          {drop.trim()} • {date} at {time} • {payMode === "online" ? "Online payment" : "Cash on Delivery"}
        </p>
        <div className="mx-auto mt-6 grid max-w-2xl gap-3 text-left sm:grid-cols-3">
          {[
            { t: "Driver assigned", d: "Driver details on SMS/WhatsApp ~15 mins before pickup." },
            { t: "OTP verification", d: "Share the SMS OTP with the driver at pickup." },
            { t: "Live GPS tracking", d: "Track your truck in real time on a live GPS link." },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl border border-line bg-neutral-50 p-4">
              <p className="text-sm font-extrabold">{c.t}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted">{c.d}</p>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => setStep(0)} className="btn-secondary mt-6">
          Book another truck
        </button>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      {/* stepper */}
      <ol className="grid grid-cols-4 border-b border-line bg-neutral-50/70">
        {STEPS.map((label, i) => (
          <li
            key={label}
            className={`flex flex-col items-center gap-1 px-2 py-4 text-center ${
              i === step ? "bg-brand-yellow/40" : ""
            }`}
          >
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-extrabold ${
                i < step
                  ? "bg-green-600 text-white"
                  : i === step
                    ? "bg-brand-black text-white"
                    : "border border-line bg-white text-muted"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className="hidden text-[11px] font-bold sm:block">{label}</span>
          </li>
        ))}
      </ol>

      <div className="p-5 sm:p-8">
        {/* STEP 1 — route & truck */}
        {step === 0 && (
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tb-pickup" className="label">
                  Pickup location <span className="text-red-500">*</span>
                </label>
                <input id="tb-pickup" className="input" value={pickup} onChange={(e) => setPickup(e.target.value)} placeholder="BTM 2nd Stage, Bengaluru…" />
              </div>
              <div>
                <label htmlFor="tb-drop" className="label">
                  Drop location <span className="text-red-500">*</span>
                </label>
                <input id="tb-drop" className="input" value={drop} onChange={(e) => setDrop(e.target.value)} placeholder="HSR Layout, Bengaluru…" />
              </div>
              <div>
                <label htmlFor="tb-date" className="label">
                  Date <span className="text-red-500">*</span>
                </label>
                <input id="tb-date" type="date" min={todayISO()} className="input" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="tb-time" className="label">
                    Time <span className="text-red-500">*</span>
                  </label>
                  <input id="tb-time" type="time" className="input" value={time} onChange={(e) => setTime(e.target.value)} />
                </div>
                <div>
                  <label htmlFor="tb-dist" className="label">
                    Distance (km) <span className="text-red-500">*</span>
                  </label>
                  <input id="tb-dist" type="number" min="1" className="input" value={distance} onChange={(e) => setDistance(e.target.value)} />
                </div>
              </div>
              <div className="sm:col-span-2">
                <span className="label">Truck size</span>
                <div className="grid gap-2 sm:grid-cols-2">
                  {VEHICLES.map((v) => (
                    <button
                      key={v.key}
                      type="button"
                      onClick={() => setVehicleKey(v.key)}
                      aria-pressed={vehicleKey === v.key}
                      className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all duration-200 ${
                        vehicleKey === v.key
                          ? "border-brand-black bg-brand-black text-white"
                          : "border-line bg-white hover:border-brand-black"
                      }`}
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${vehicleKey === v.key ? "bg-brand-yellow text-brand-black" : "bg-neutral-100 text-brand-black"}`}>
                        <Truck className="h-5 w-5" aria-hidden />
                      </span>
                      <span>
                        <span className="block text-sm font-extrabold">{v.name}</span>
                        <span className={`block text-xs ${vehicleKey === v.key ? "text-white/70" : "text-muted"}`}>{v.capacity}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <aside className="h-fit rounded-2xl border border-line bg-neutral-50 p-5 lg:sticky lg:top-24">
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted">
                <IndianRupee className="h-4 w-4" aria-hidden /> Live fixed price
              </p>
              <p className="mt-2 text-3xl font-extrabold">{inr(price.fare)}</p>
              <p className="mt-1 text-xs text-muted">
                {vehicle.name} • {price.km || 0} km • GST extra at checkout. No hidden charges.
              </p>
              <button type="button" onClick={nextFromStep0} className="btn-primary mt-4 w-full">
                See fixed price <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </aside>
          </div>
        )}

        {/* STEP 2 — fixed price breakup */}
        {step === 1 && (
          <div className="mx-auto max-w-xl">
            <h3 className="text-xl font-extrabold">Your fixed price — no hidden charges</h3>
            <p className="mt-1 text-sm text-muted">
              {pickup.trim()} → {drop.trim()} • {vehicle.name} • {price.km} km
            </p>
            <dl className="mt-5 space-y-2.5 rounded-2xl border border-line bg-neutral-50 p-5 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Base fare + distance ({price.km} km)</dt>
                <dd className="font-bold">{inr(price.fare)}</dd>
              </div>
              <div className="flex justify-between border-t border-line pt-2.5">
                <dt className="font-extrabold">Fixed total (incl. GST)</dt>
                <dd className="text-xl font-extrabold">{inr(price.fare + Math.round(price.fare * 0.18))}</dd>
              </div>
            </dl>
            <p className="mt-2 text-xs text-muted">Add-ons (helpers, dismantling, insurance) on the next step — everything shown upfront.</p>
            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStep(0)} className="btn-secondary flex-1">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" onClick={() => setStep(2)} className="btn-primary flex-1">
                Choose add-ons <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — add-ons */}
        {step === 2 && (
          <div className="mx-auto max-w-xl">
            <h3 className="text-xl font-extrabold">Add-on services</h3>
            <p className="mt-1 text-sm text-muted">Tick only what you need — price updates instantly.</p>

            <div className="mt-5">
              <span className="label">Labor / helpers</span>
              <div className="grid grid-cols-3 gap-2">
                {([0, 1, 2] as const).map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setHelpers(n)}
                    aria-pressed={helpers === n}
                    className={`rounded-xl border px-3 py-2.5 text-sm font-bold transition-all duration-200 ${
                      helpers === n ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
                    }`}
                  >
                    {n === 0 ? "No helper" : n === 1 ? `1 helper +${inr(HELPER_1)}` : `2 helpers +${inr(HELPER_2)}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 grid gap-2 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setDismantling((v) => !v)}
                aria-pressed={dismantling}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${dismantling ? "border-brand-black bg-brand-yellow/30" : "border-line bg-white hover:border-brand-black"}`}
              >
                <span className="flex items-center gap-2 text-sm font-extrabold">
                  <CheckCircle2 className={`h-5 w-5 ${dismantling ? "text-green-600" : "text-neutral-300"}`} aria-hidden />
                  Dismantling service
                </span>
                <span className="mt-1 block text-xs text-muted">Furniture & appliances • +{inr(DISMANTLING)}</span>
              </button>
              <button
                type="button"
                onClick={() => setInsurance((v) => !v)}
                aria-pressed={insurance}
                className={`rounded-2xl border p-4 text-left transition-all duration-200 ${insurance ? "border-brand-black bg-brand-yellow/30" : "border-line bg-white hover:border-brand-black"}`}
              >
                <span className="flex items-center gap-2 text-sm font-extrabold">
                  <CheckCircle2 className={`h-5 w-5 ${insurance ? "text-green-600" : "text-neutral-300"}`} aria-hidden />
                  Transit insurance
                </span>
                <span className="mt-1 block text-xs text-muted">Covers goods in transit • +2% {insurance && `(${inr(price.insuranceCharge)})`}</span>
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-brand-black p-4 text-white">
              <span className="flex items-center gap-2 text-sm font-bold">
                <Users className="h-4 w-4 text-brand-yellow" aria-hidden /> Total with add-ons (incl. GST)
              </span>
              <span className="text-2xl font-extrabold text-brand-yellow">{inr(price.total)}</span>
            </div>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStep(1)} className="btn-secondary flex-1">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" onClick={() => setStep(3)} className="btn-primary flex-1">
                Book now <ArrowRight className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4 — book & track */}
        {step === 3 && (
          <div className="mx-auto max-w-xl">
            <h3 className="text-xl font-extrabold">Book & live track</h3>
            <p className="mt-1 text-sm text-muted">
              {vehicle.name} • {pickup.trim()} → {drop.trim()} • {date} at {time}
            </p>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="tb-name" className="label">Your name</label>
                <input id="tb-name" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ravi Sharma" />
              </div>
              <div>
                <label htmlFor="tb-phone" className="label">Phone (OTP + tracking)</label>
                <input id="tb-phone" type="tel" inputMode="numeric" className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98765 43210" />
              </div>
            </div>

            <div className="mt-4">
              <span className="label">Payment mode</span>
              <div className="grid grid-cols-2 gap-2">
                {(["online", "cod"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayMode(m)}
                    aria-pressed={payMode === m}
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-bold transition-all duration-200 ${
                      payMode === m ? "border-brand-black bg-brand-black text-white" : "border-line bg-white hover:border-brand-black"
                    }`}
                  >
                    <CreditCard className="h-4 w-4" aria-hidden />
                    {m === "online" ? "Pay Online" : "Cash on Delivery"}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl border border-line bg-neutral-50 p-5 text-sm">
              <div className="flex justify-between"><span className="text-muted">Fare ({price.km} km, {vehicle.name})</span><span className="font-bold">{inr(price.fare)}</span></div>
              {price.helperCharge > 0 && <div className="flex justify-between"><span className="text-muted">Helpers</span><span className="font-bold">{inr(price.helperCharge)}</span></div>}
              {price.dismantlingCharge > 0 && <div className="flex justify-between"><span className="text-muted">Dismantling</span><span className="font-bold">{inr(price.dismantlingCharge)}</span></div>}
              {price.insuranceCharge > 0 && <div className="flex justify-between"><span className="text-muted">Insurance</span><span className="font-bold">{inr(price.insuranceCharge)}</span></div>}
              <div className="flex justify-between"><span className="text-muted">GST @18%</span><span className="font-bold">{inr(price.gst)}</span></div>
              <div className="flex justify-between border-t border-line pt-2.5">
                <span className="font-extrabold">Payable {payMode === "cod" ? "(on delivery)" : "(now)"}</span>
                <span className="text-xl font-extrabold">{inr(price.total)}</span>
              </div>
            </div>

            <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              After booking, a driver is assigned, you verify pickup with an OTP, and track the truck live on GPS.
            </p>

            <div className="mt-5 flex gap-3">
              <button type="button" onClick={() => setStep(2)} className="btn-secondary flex-1">
                <ArrowLeft className="h-4 w-4" aria-hidden /> Back
              </button>
              <button type="button" onClick={book} className="btn-primary flex-1">
                Confirm booking • {inr(price.total)}
              </button>
            </div>
          </div>
        )}

        {error && (
          <p className="mx-auto mt-4 max-w-xl rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-medium text-red-700">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

import Link from "next/link";

interface FormConsentProps {
  id: string;
  /** Optional extra sentence after the policy links (e.g. WhatsApp consent note). */
  note?: string;
  className?: string;
}

/**
 * Standard agreement checkbox for enquiry and booking forms.
 * Links to the legal pages and blocks native form submission until ticked.
 */
export default function FormConsent({ id, note, className = "" }: FormConsentProps) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted ${className}`}
    >
      <input
        id={id}
        name="consent"
        type="checkbox"
        required
        className="mt-0.5 h-4 w-4 shrink-0 accent-[#111111]"
      />
      <span>
        I agree to XtoX Logistics&apos;{" "}
        <Link href="/terms" className="font-semibold text-brand-black underline underline-offset-2">
          Terms &amp; Conditions
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="font-semibold text-brand-black underline underline-offset-2">
          Privacy Policy
        </Link>
        {note ? <> {note}</> : null}
      </span>
    </label>
  );
}

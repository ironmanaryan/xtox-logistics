# Placeholders to replace before launch

Nothing in this site invents proof. Every value below is either empty, hidden
behind a flag, or visibly marked. Replace the value in the file listed, then
flip the related flag if there is one.

## 1. Company identity and legal details — `data/company.ts`

| Field | Current value | What to put |
| --- | --- | --- |
| `legalName` | `XtoX Logistics` | Exact registered entity name from the incorporation / GST certificate |
| `gstin` | empty (hidden) | 15-character GSTIN. Shows in the footer only when set |
| `cin` | empty | Company CIN, if incorporated |
| `iec` | empty | 10-character Import Export Code, if you handle EXIM |
| `legal.grievanceOfficer` | `[REPLACE: grievance officer name & contact]` | Name, email and phone of the DPDP grievance officer |
| `legal.liabilityLimit` | freight/service charges paid | Confirm with your lawyer |
| `legal.claimWindowDays` | `7` | Confirm the claim window you can actually service |
| `legal.jurisdiction` | `Bengaluru, Karnataka` | Confirm the court you will contract with |

`registeredAddress` in the same file feeds the footer and legal pages — verify
the pin code and building name.

## 2. Proof and trust content — `data/proof.ts`

`metrics`, `testimonials`, `clients` and `rating` are **empty arrays**. The
homepage hides the block entirely while they are empty. Nothing was invented.

Fill them only with numbers you can evidence:

- `metrics`: shipments handled, lanes served, on-time %, years operating.
- `testimonials`: real customer quotes with the customer's permission, name and
  city. Do not paraphrase into something they did not say.
- `clients`: only brands that have agreed to be named.
- `rating`: platform, score and review count from a real profile (Google, Justdial).

## 3. Compliance badges — `data/company.ts`

`complianceBadges` are all `enabled: false` with empty values, and the feature
flag `NEXT_PUBLIC_FEATURE_BADGES` is off by default. Turn a badge on only when
you hold the certificate, and put the registration number in `value`.

## 4. Rate card — `data/rates.ts`

`packersRates` and `smeRates` drive the two on-site calculators. They are
internal planning rates, not published tariffs. Reconcile them with what the
sales team actually quotes, then update `RATES_LAST_UPDATED`.

## 5. Hidden features

`NEXT_PUBLIC_FEATURE_TRACK` and `NEXT_PUBLIC_FEATURE_LOGIN` default to `false`,
so the hero "Track" tab and the login links stay hidden. Turn them on only when
`/api/track` returns real data and customer accounts are supported.

## 6. Blog articles — `content/blog/*.mdx`

All five starter posts are **outlines** with a `> Outline` note at the top. They
are indexed and linked from `/blog`. Write the full article before promoting the
blog, and delete the outline note.

## 7. Legal pages

`data/legal.ts` now reads `claimWindowDays`, `governingLaw` and `jurisdiction`
from `data/company.ts`. The content is a reasonable draft, not legal advice.
**Have a lawyer review Terms, Privacy and Refund Policy before launch.**

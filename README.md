# XtoX Logistics — Website Project

Modern, high-converting B2B logistics website built with **Next.js 14 + Tailwind CSS + TypeScript**.

## 🎨 Color Theme (locked)
| Token | Value |
|---|---|
| Background | `#FFFFFF` pure white |
| Brand accent | `#FFDE59` yellow |
| Text / accents | `#111111` dark black |

Buttons: yellow bg → hover black bg + white text (smooth 300ms transition).
Cards: clean `#e8e8e8` borders + subtle shadow lift on hover.

## 🚀 Run it
```bash
npm install
npm run dev
```
Open http://localhost:3000

## 📁 Structure
```
app/                  App Router pages
  page.tsx            Home (hero tabs, metrics, services, driver CTA)
  globals.css         Theme tokens
  services/           4 service landing pages
    packers-movers/
    import-export/
    sme-transport/
    agri-export/
  drivers/            Driver Partner onboarding
components/           Navbar, Footer, Hero, cards, calculators
data/                 Services & metrics data
public/               Logo files
```

## 📄 Pages
| Route | Purpose |
|---|---|
| `/` | Home + hero tracking tabs |
| `/about` | Company overview, divisions, operating standards |
| `/services/packers-movers` | Instant cost calculator |
| `/services/import-export` | Customs clearance roadmap |
| `/services/sme-transport` | On-demand vs scheduled fleet |
| `/services/agri-export` | Cold-chain + APEDA benefits |
| `/drivers` | Driver partner onboarding form |
| `/support` | Support desks, contact details and head office |
| `/terms` | Terms & Conditions |
| `/privacy` | Privacy Policy |
| `/refund-policy` | Refund & Cancellation Policy |

## ⚖️ Legal & consent
- Legal content lives in `data/legal.ts` (structured sections) and renders through
  `components/LegalPage.tsx` — a shared shell with a sticky table of contents.
- Terms, Privacy and Refund routes are `app/terms`, `app/privacy`, `app/refund-policy`.
- Every enquiry/booking form includes a required agreement checkbox via
  `components/FormConsent.tsx`, linking to the Terms and Privacy Policy.
- Legal pages are linked from the site footer (Legal column + bottom bar), the
  mobile menu, the sitemap and each legal page cross-links the other two.

Logos (`logo-full.png`, `logo-mark.png`, `logo-icon.png`) are in `public/`.

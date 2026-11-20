# Launch checklist

## Before you deploy

1. **Create the leads table.** Run `supabase/leads-schema.sql` in the Supabase
   SQL editor of the project referenced by `NEXT_PUBLIC_SUPABASE_URL`. Row level
   security allows anonymous INSERT only; reads happen server-side with the
   service-role key. Until this is done, `/admin/leads` shows a setup message and
   lead submissions return a friendly 503.
2. **Fill in `PLACEHOLDERS.md`.** At minimum: `legalName`, `gstin`,
   `legal.grievanceOfficer`, and the real `data/rates.ts` numbers.
3. **Set the canonical URL.** `NEXT_PUBLIC_SITE_URL` must be the production
   origin with no trailing slash (e.g. `https://xtoxlogistics.com`). It feeds
   `metadataBase`, canonicals, `sitemap.xml`, `robots.txt` and the JSON-LD.
4. **Set the env vars** listed in `.env.example` in Vercel → Settings →
   Environment Variables (Production and Preview).
5. **Have a lawyer review** Terms, Privacy and Refund Policy.
6. **Write the five blog articles** in `content/blog/` — they currently ship as
   outlines.

## Deploy

```bash
npx vercel --prod
```

Then verify on the deployed origin:

- `/` loads, hero and quote form work, no console errors.
- Submit the quote form → success screen appears, row lands in Supabase, owner
  notification arrives (if email/Telegram configured).
- `/admin/leads` → password login → lead visible → change status.
- `/sitemap.xml` and `/robots.txt` show the production host.
- `/packers-movers` and one corridor page (e.g. `/packers-movers/bengaluru-to-hyderabad`).
- `/blog` and one article.

## Analytics

GA4 and Meta Pixel only load after the visitor accepts the consent banner.
Events fired: `form_submit`, `quote_step_complete`, `whatsapp_click`,
`call_click`, `estimate_used`.

## Feature flags (default off)

| Flag | Unlocks |
| --- | --- |
| `NEXT_PUBLIC_FEATURE_TRACK` | Hero Track tab (needs real `/api/track` data) |
| `NEXT_PUBLIC_FEATURE_LOGIN` | Customer login/dashboard links |
| `NEXT_PUBLIC_FEATURE_BADGES` | GST / IEC / APEDA / insured chips (needs real numbers) |

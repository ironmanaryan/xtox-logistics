import { NextResponse } from "next/server";
import { z } from "zod";
import { getSupabase, getSupabaseAdmin } from "@/lib/supabase";
import { notifyCustomer, notifyOwner } from "@/lib/lead-notify";

export const runtime = "nodejs";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined));

const LeadSchema = z.object({
  name: z.string().trim().min(2, "Name is too short").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/\D/g, "").replace(/^(91|0)/, ""))
    .refine((v) => /^[6-9]\d{9}$/.test(v), "Enter a valid 10-digit Indian mobile number"),
  email: z
    .string()
    .trim()
    .max(160)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : undefined))
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), "Invalid email"),
  company: optionalText(120),
  service: z.string().trim().min(2).max(80),
  from: optionalText(120),
  to: optionalText(120),
  details: optionalText(2000),
  serviceDetails: z
    .record(z.string(), z.union([z.string(), z.number(), z.boolean()]))
    .optional(),
  page: optionalText(300),
  consent: z.boolean().optional(),
  website: z.string().max(0).optional(), // honeypot
  utm: z
    .object({
      source: optionalText(120),
      medium: optionalText(120),
      campaign: optionalText(160),
      term: optionalText(160),
      content: optionalText(160),
    })
    .optional(),
  userId: z.string().uuid().optional().nullable(),
});

type Lead = z.infer<typeof LeadSchema>;

/**
 * Simple in-memory rate limit. Per-instance only, which is enough to stop
 * casual form spam; pair with a WAF rule for serious abuse.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 6;
const hits = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_PER_WINDOW;
}

function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  return (forwarded?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}

export async function POST(req: Request) {
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const parsed = LeadSchema.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Please check the form and try again." },
      { status: 400 }
    );
  }

  const lead: Lead = parsed.data;

  // Fallback attribution: if the browser did not send UTM tags, record the
  // external referrer host so "where did this lead come from" still works.
  if (!lead.utm?.source) {
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        const host = new URL(referer).host;
        const self = new URL(req.url).host;
        if (host && host !== self) {
          const prev = lead.utm;
          lead.utm = {
            source: host,
            medium: prev?.medium,
            campaign: prev?.campaign,
            term: prev?.term,
            content: prev?.content,
          };
        }
      } catch {
        /* malformed referer — ignore */
      }
    }
  }

  // Honeypot hit: pretend success so bots do not retry.
  if (lead.website) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (rateLimited(clientIp(req))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please call or WhatsApp us instead." },
      { status: 429 }
    );
  }

  const row = {
    name: lead.name,
    phone: lead.phone,
    email: lead.email ?? null,
    company: lead.company ?? null,
    service: lead.service,
    from_city: lead.from ?? null,
    to_city: lead.to ?? null,
    details: lead.details ?? null,
    service_details: lead.serviceDetails ?? null,
    source: lead.utm?.source ?? null,
    medium: lead.utm?.medium ?? null,
    campaign: lead.utm?.campaign ?? null,
    utm_term: lead.utm?.term ?? null,
    utm_content: lead.utm?.content ?? null,
    page_path: lead.page ?? null,
    user_id: lead.userId ?? null,
    status: "new" as const,
  };

  const supabase = getSupabaseAdmin() ?? getSupabase();
  let saved = false;
  let insertedId: string | undefined;

  if (supabase) {
    const { data, error } = await supabase
      .from("leads")
      .insert(row)
      .select("id")
      .maybeSingle();

    if (error) {
      console.error("lead insert error:", error.message);
    } else {
      saved = true;
      insertedId = data?.id;
    }
  } else {
    console.error("lead not stored: Supabase env vars missing");
  }

  const [ownerNotified, customerNotified] = await Promise.all([
    notifyOwner(lead).catch(() => false),
    notifyCustomer(lead).catch(() => false),
  ]);

  if (!saved && !ownerNotified) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "We could not save your request right now. Please WhatsApp us and we will take it there.",
      },
      { status: 503 }
    );
  }

  return NextResponse.json({
    ok: true,
    id: insertedId,
    stored: saved,
    notified: { owner: ownerNotified, customer: customerNotified },
  });
}

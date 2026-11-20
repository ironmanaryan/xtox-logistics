/**
 * Lead notifications. Every channel is optional: if its env vars are missing
 * the function resolves quietly so a lead is never lost because email or
 * Telegram is not configured yet.
 */

export interface LeadPayload {
  name: string;
  phone: string;
  email?: string;
  company?: string;
  service: string;
  from?: string;
  to?: string;
  details?: string;
  page?: string;
}

function summary(lead: LeadPayload): string {
  return [
    `New ${lead.service} enquiry`,
    `Name: ${lead.name}`,
    `Phone: +91 ${lead.phone}`,
    lead.company ? `Company: ${lead.company}` : "",
    lead.from || lead.to ? `Route: ${lead.from || "—"} → ${lead.to || "—"}` : "",
    lead.details ? `Details: ${lead.details}` : "",
    lead.page ? `Page: ${lead.page}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendEmail(to: string, subject: string, text: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.LEAD_FROM_EMAIL;
  if (!key || !from) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], subject, text }),
    });
    if (!res.ok) console.error("resend error", res.status, await res.text());
    return res.ok;
  } catch (err) {
    console.error("resend request failed", err);
    return false;
  }
}

/** Owner alert: email + Telegram, whichever is configured. */
export async function notifyOwner(lead: LeadPayload): Promise<boolean> {
  const tasks: Promise<boolean>[] = [];
  const owner = process.env.LEAD_NOTIFY_EMAIL;

  if (owner) {
    tasks.push(sendEmail(owner, `New lead: ${lead.service} — ${lead.name}`, summary(lead)));
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (token && chatId) {
    tasks.push(
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: chatId, text: summary(lead) }),
      })
        .then((r) => r.ok)
        .catch((err) => {
          console.error("telegram notify failed", err);
          return false;
        })
    );
  }

  if (tasks.length === 0) return false;
  const results = await Promise.allSettled(tasks);
  return results.some((r) => r.status === "fulfilled" && r.value);
}

/** Customer confirmation — only when they shared an email address. */
export async function notifyCustomer(lead: LeadPayload): Promise<boolean> {
  if (!lead.email) return false;

  const text = [
    `Hi ${lead.name.split(" ")[0]},`,
    "",
    `Thanks for your ${lead.service} enquiry with XtoX Logistics.`,
    lead.from || lead.to
      ? `Route: ${lead.from || "—"} → ${lead.to || "—"}`
      : "",
    "",
    "A logistics manager will call you within 2 business hours with options and pricing.",
    "",
    "Need to add photos or documents? Reply on WhatsApp: +91 78754 88307",
    "",
    "— XtoX Logistics, Bengaluru",
  ]
    .filter((line) => line !== "")
    .join("\n");

  return sendEmail(lead.email, "We received your XtoX Logistics request", text);
}

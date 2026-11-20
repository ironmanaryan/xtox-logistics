import { NextResponse } from "next/server";
import { POST as createLead } from "../lead/route";

/**
 * Legacy endpoint kept for backwards compatibility.
 *
 * Older service forms (packers, SME, EXIM, agri) still post here. Everything is
 * forwarded to /api/lead so there is exactly one validation + storage +
 * notification path.
 */
export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const forwarded = new Request(req.url, {
    method: "POST",
    headers: req.headers,
    body: JSON.stringify({
      ...body,
      page: typeof body.page === "string" ? body.page : "/services",
    }),
  });

  return createLead(forwarded);
}

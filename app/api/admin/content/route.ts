import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";
import { validSession, sessionFromRequest } from "@/lib/admin-auth";

const KINDS = ["article", "case-study", "faq", "blog"];

interface Item {
  kind?: string;
  title?: string;
  excerpt?: string;
  body?: string;
  tag?: string;
  extra?: string;
  published?: boolean;
}

function clean(item: Item) {
  return {
    kind: item.kind ?? "article",
    title: (item.title ?? "").trim(),
    excerpt: item.excerpt ?? "",
    body: item.body ?? "",
    tag: item.tag ?? "",
    extra: item.extra ?? "",
    published: item.published ?? true,
  };
}

/** Create / update Resources CMS items. */
export async function POST(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { action?: string; id?: string; item?: Item; patch?: Partial<Item> };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }

  if (body.action === "create" && body.item?.title && KINDS.includes(body.item.kind ?? "")) {
    const { error } = await supabase.from("resources").insert(clean(body.item));
    if (error) return NextResponse.json({ ok: false, error: "Create failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "update" && body.id && body.patch) {
    const patch: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(body.patch)) {
      if (["title", "excerpt", "body", "tag", "extra"].includes(k) && typeof v === "string") patch[k] = v;
      if (k === "published" && typeof v === "boolean") patch[k] = v;
    }
    const { error } = await supabase.from("resources").update(patch).eq("id", body.id);
    if (error) return NextResponse.json({ ok: false, error: "Update failed" }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ ok: false, error: "Invalid action" }, { status: 400 });
}

/** Delete a Resources CMS item. */
export async function DELETE(req: Request) {
  if (!validSession(sessionFromRequest(req))) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let body: { id?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Bad request" }, { status: 400 });
  }
  if (!body.id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  }
  const { error } = await supabase.from("resources").delete().eq("id", body.id);
  if (error) return NextResponse.json({ ok: false, error: "Delete failed" }, { status: 500 });
  return NextResponse.json({ ok: true });
}

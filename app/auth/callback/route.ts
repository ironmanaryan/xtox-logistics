import { NextResponse } from "next/server";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export async function GET(req: Request) {
  const { searchParams, origin } = new URL(req.url);
  const code = searchParams.get("code");

  // getSupabaseBrowser is client-only; server route needs its own client
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.redirect(`${origin}/login?error=Auth%20not%20configured`);
  }
  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=Missing%20confirmation%20code`);
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`);
  }

  return NextResponse.redirect(`${origin}/account`);
}

// Keep the browser client import referenced to avoid bundling it into this route
void getSupabaseBrowser;

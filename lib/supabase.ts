import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/**
 * Server-side Supabase client (uses anon key; RLS policies protect tables).
 * Returns null when env vars are missing so pages can degrade gracefully
 * before Supabase is connected.
 */
export function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: false },
  });
}

export const supabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

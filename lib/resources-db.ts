import { getSupabase } from "./supabase";

export interface DbResource {
  id: string;
  kind: "article" | "case-study" | "faq" | "blog";
  title: string;
  excerpt: string;
  body: string;
  tag: string;
  extra: string;
  image_url: string;
  published: boolean;
  created_at: string;
}

/** Published items of one kind, newest first. Empty array when DB is unavailable. */
export async function getPublishedResources(
  kind: DbResource["kind"]
): Promise<DbResource[]> {
  try {
    const sb = getSupabase();
    if (!sb) return [];
    const { data, error } = await sb
      .from("resources")
      .select("*")
      .eq("kind", kind)
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as DbResource[];
  } catch {
    return [];
  }
}

export function fmtDate(iso: string): string {
  return iso.slice(0, 10);
}

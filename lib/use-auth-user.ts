"use client";

import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "./supabase-browser";

/** Logged-in Supabase Auth user id, or null for guests. Used to link quotes to the dashboard. */
export function useAuthUserId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => {
    getSupabaseBrowser()
      ?.auth.getUser()
      .then(({ data }) => setId(data.user?.id ?? null))
      .catch(() => setId(null));
  }, []);
  return id;
}

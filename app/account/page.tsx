"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, LogOut, User } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getSupabaseBrowser } from "@/lib/supabase-browser";

export default function AccountPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = getSupabaseBrowser();
    if (!supabase) {
      setLoading(false);
      return;
    }
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user?.email ?? null);
      setLoading(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    const supabase = getSupabaseBrowser();
    await supabase?.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center bg-neutral-50/60 p-4">
        {loading ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted" aria-hidden />
        ) : !email ? (
          <div className="card p-10 text-center">
            <User className="mx-auto h-8 w-8 text-muted" aria-hidden />
            <h1 className="mt-4 text-xl font-extrabold">You&apos;re not logged in</h1>
            <p className="mt-2 text-sm text-muted">Log in to view your account.</p>
            <Link href="/login" className="btn-primary mt-6">
              Go to login
            </Link>
          </div>
        ) : (
          <div className="card w-full max-w-md p-8 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-yellow text-brand-black">
              <User className="h-7 w-7" aria-hidden />
            </span>
            <h1 className="mt-4 text-xl font-extrabold">My account</h1>
            <p className="mt-1 text-sm text-muted">{email}</p>
            <div className="mt-6 grid gap-2">
              <Link href="/#cta" className="btn-primary w-full">Request a quote</Link>
              <button type="button" onClick={logout} className="btn-secondary w-full">
                <LogOut className="h-4 w-4" aria-hidden /> Log out
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

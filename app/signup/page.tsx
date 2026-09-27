import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create your XtoX Logistics account — one login for quotes, tracking and support.",
};

export default function SignupPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center bg-neutral-50/60 p-4">
        <AuthForm mode="signup" />
      </main>
      <Footer />
    </>
  );
}

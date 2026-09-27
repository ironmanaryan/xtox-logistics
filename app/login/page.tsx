import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AuthForm from "@/components/AuthForm";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your XtoX Logistics account to track shipments and manage bookings.",
};

export default function LoginPage() {
  return (
    <>
      <Navbar />
      <main className="flex min-h-[70vh] items-center justify-center bg-neutral-50/60 p-4">
        <AuthForm mode="login" />
      </main>
      <Footer />
    </>
  );
}

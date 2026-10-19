// app/admin/login/page.tsx
// Admin login page using Supabase email and password auth.

import Link from "next/link";
import { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login",
  description: "Sign in to the admin dashboard.",
};

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl" aria-hidden="true">🐔</span>
            <span className="font-bold text-xl text-primary">Farm Fresh Poultry</span>
          </Link>
          <h1 className="text-2xl font-bold text-charcoal mt-4">Admin Login</h1>
          <p className="text-muted text-sm mt-1">
            Sign in to manage your poultry inventory.
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm p-6 sm:p-8">
          <LoginForm />
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-muted hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
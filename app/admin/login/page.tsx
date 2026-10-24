// app/admin/login/page.tsx
// Admin login page using Supabase email and password auth.
// Renders the form immediately on first render — no Suspense, no loading gate.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const SESSION_CHECK_TIMEOUT_MS = 5000;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Background session check: redirect only if a session already exists.
  // Never blocks the UI; a 5-second timeout prevents hanging forever.
  useEffect(() => {
    const supabase = getSupabase();
    let mounted = true;

    async function check() {
      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), SESSION_CHECK_TIMEOUT_MS)
          ),
        ]);
        if (mounted && result?.data?.session) {
          router.replace("/admin");
        }
      } catch (err) {
        console.error("Session check failed:", err);
      }
    }

    check();
    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const supabase = getSupabase();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError("Invalid email or password");
        return;
      }

      router.replace("/admin");
    } catch (err) {
      console.error("Sign in failed:", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

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
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div
                role="alert"
                className="bg-danger/10 border border-danger/30 text-danger text-sm rounded-lg px-3 py-2"
              >
                {error}
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-charcoal mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-charcoal mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
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
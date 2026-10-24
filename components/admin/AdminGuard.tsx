// components/admin/AdminGuard.tsx
// Client-side guard: redirects to /admin/login if no session exists.
// Renders nothing (falls through to children) while checking; never blocks on a
// forever-pending promise. A 5-second timeout forces the redirect.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";

const CHECK_TIMEOUT_MS = 5000;

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const supabase = getSupabase();
    let mounted = true;

    async function check() {
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        if (mounted) {
          setChecked(true);
          setAllowed(false);
          router.replace("/admin/login");
        }
      }, CHECK_TIMEOUT_MS);

      try {
        const result = await Promise.race([
          supabase.auth.getSession(),
          new Promise<null>((resolve) =>
            setTimeout(() => resolve(null), CHECK_TIMEOUT_MS)
          ),
        ]);

        if (timedOut || !mounted) return;

        if (!result || !result.data?.session) {
          router.replace("/admin/login");
          return;
        }

        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (adminEmail && result.data.session.user.email !== adminEmail) {
          try {
            await supabase.auth.signOut();
          } catch {
            // ignore sign-out errors
          }
          router.replace("/admin/login");
          return;
        }

        setAllowed(true);
      } catch (err) {
        console.error("Admin guard check failed:", err);
        if (mounted) {
          router.replace("/admin/login");
        }
      } finally {
        clearTimeout(timer);
        if (mounted) setChecked(true);
      }
    }

    check();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!mounted) return;
        if (!session) {
          router.replace("/admin/login");
        } else {
          setAllowed(true);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [router]);

  if (!checked || !allowed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-muted">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}
// components/admin/AdminGuard.tsx
// Client-side guard: redirects to /admin/login if no session exists.

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let mounted = true;

    async function check() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;
        if (!session) {
          router.replace("/admin/login");
          return;
        }
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
        if (adminEmail && session.user.email !== adminEmail) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }
        setAllowed(true);
      } catch (err) {
        console.error("Admin guard check failed:", err);
        router.replace("/admin/login");
      } finally {
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

// components/admin/AdminHeader.tsx
// Admin dashboard header with logout button.

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

interface Props {
  email: string;
}

export function AdminHeader({ email }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <header className="bg-charcoal text-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/admin" className="flex items-center gap-2">
            <span className="text-xl" aria-hidden="true">🐔</span>
            <span className="font-semibold">Admin</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:inline">
              {email}
            </span>
            <button
              onClick={handleLogout}
              disabled={loading}
              className="text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
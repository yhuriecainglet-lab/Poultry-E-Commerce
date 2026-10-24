// app/admin/(protected)/layout.tsx
// Layout for protected admin pages (everything except /admin/login).
// Wraps children in AdminGuard so unauthenticated visitors are redirected.

"use client";

import { AdminGuard } from "@/components/admin/AdminGuard";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useEffect, useState } from "react";
import { getSupabase } from "@/lib/supabase";

export default function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = getSupabase();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.email) {
        setEmail(session.user.email);
      }
    });
  }, []);

  return (
    <AdminGuard>
      <div className="min-h-screen flex flex-col bg-gray-50">
        <AdminHeader email={email} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </AdminGuard>
  );
}
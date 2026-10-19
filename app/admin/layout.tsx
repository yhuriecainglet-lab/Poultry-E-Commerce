// app/admin/layout.tsx
// Protects all /admin routes (except login) by checking the Supabase session.
// If ADMIN_EMAIL is set, only that email may access the dashboard.
// Unauthenticated users are redirected to /admin/login.

import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabase/server";
import { AdminHeader } from "@/components/admin/AdminHeader";

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const {
    data: { session },
  } = await supabaseServer.auth.getSession();

  if (!session) {
    redirect("/admin/login");
  }

  // If an admin email is configured, enforce it.
  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail && session.user.email !== adminEmail) {
    await supabaseServer.auth.signOut();
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <AdminHeader email={session.user.email ?? ""} />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
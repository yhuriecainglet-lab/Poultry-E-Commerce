// app/admin/chickens/page.tsx
// Table of all chickens (published and unpublished) with search,
// category filter, and quick actions (stock update, publish/featured toggle, delete).

import Link from "next/link";
import { Metadata } from "next";
import { supabaseServer } from "@/lib/supabase/server";
import { Chicken, Category } from "@/lib/types";
import { AdminChickensTable } from "@/components/admin/AdminChickensTable";

export const metadata: Metadata = {
  title: "Chickens",
  description: "Manage your chicken inventory.",
};

export default async function AdminChickensPage() {
  const [{ data: chickens }, { data: categories }] = await Promise.all([
    supabaseServer
      .from("chickens")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const allChickens = (chickens ?? []) as Chicken[];
  const cats = (categories ?? []) as Category[];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Chickens</h1>
        <Link
          href="/admin/chickens/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          + Add Chicken
        </Link>
      </div>

      <AdminChickensTable chickens={allChickens} categories={cats} />
    </div>
  );
}
// app/admin/chickens/page.tsx
// Table of all chickens (published and unpublished) with search,
// category filter, and quick actions (stock update, publish/featured toggle, delete).

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase } from "@/lib/supabase";
import { Chicken, Category } from "@/lib/types";
import { AdminChickensTable } from "@/components/admin/AdminChickensTable";

export default function AdminChickensPage() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const supabase = getSupabase();
    supabase
      .from("chickens")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => setChickens((data ?? []) as Chicken[]));
    supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .then(({ data }) => setCategories((data ?? []) as Category[]));
  }, []);

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

      <AdminChickensTable chickens={chickens} categories={categories} />
    </div>
  );
}

// app/shop/page.tsx
// Shop page: grid of all published chickens with category filter, search, and sort.
// Category is selected via ?category=<slug> query parameter.

"use client";

import { useEffect, useState, Suspense } from "react";
import { PublicLayout } from "@/components/PublicLayout";
import { SearchAndFilter } from "@/components/SearchAndFilter";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Chicken, Category } from "@/lib/types";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";

function ShopContent() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createBrowserSupabaseClient();

    async function load() {
      try {
        const [{ data: chickensData }, { data: categoriesData }] =
          await Promise.all([
            supabase
              .from("chickens")
              .select("*, category:categories(*)")
              .eq("is_published", true)
              .order("created_at", { ascending: false }),
            supabase
              .from("categories")
              .select("*")
              .order("sort_order", { ascending: true }),
          ]);
        if (mounted) {
          setChickens((chickensData ?? []) as Chicken[]);
          setCategories((categoriesData ?? []) as Category[]);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to load shop data:", err);
          setError(err instanceof Error ? err.message : "Failed to load data");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <ProductGridSkeleton count={8} />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-3" aria-hidden="true">🐔</div>
        <h2 className="text-lg font-semibold text-charcoal">Unable to load</h2>
        <p className="text-muted mt-1">{error}</p>
      </div>
    );
  }

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
          All Chickens
        </h1>
        <p className="text-muted mb-6">
          {chickens.length} chicken
          {chickens.length === 1 ? "" : "s"} available
        </p>

        <SearchAndFilter
          chickens={chickens}
          categories={categories}
        />
      </div>
    </section>
  );
}

export default function ShopPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<ProductGridSkeleton count={8} />}>
        <ShopContent />
      </Suspense>
    </PublicLayout>
  );
}

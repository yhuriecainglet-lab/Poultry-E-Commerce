// app/shop/page.tsx
// Shop page: grid of all published chickens with category filter tabs,
// sort dropdown, and search box.

import { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { supabaseServer } from "@/lib/supabase/server";
import { Chicken, Category } from "@/lib/types";
import { SearchAndFilter } from "@/components/SearchAndFilter";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop",
  description: "Browse all available chickens by age, breed, and price.",
};

export default async function ShopPage() {
  const [{ data: chickens }, { data: categories }] = await Promise.all([
    supabaseServer
      .from("chickens")
      .select("*, category:categories(*)")
      .eq("is_published", true)
      .order("created_at", { ascending: false }),
    supabaseServer
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  const allChickens = (chickens ?? []) as Chicken[];
  const cats = (categories ?? []) as Category[];

  return (
    <PublicLayout>
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
            All Chickens
          </h1>
          <p className="text-muted mb-6">
            {allChickens.length} chicken
            {allChickens.length === 1 ? "" : "s"} available
          </p>

          <SearchAndFilter chickens={allChickens} categories={cats}>
            {(filtered) =>
              filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3" aria-hidden="true">🐔</div>
                  <h2 className="text-lg font-semibold text-charcoal">
                    No chickens match your filters
                  </h2>
                  <p className="text-muted mt-1">
                    Try a different search term or category.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filtered.map((chicken) => (
                    <ProductCard key={chicken.id} chicken={chicken} />
                  ))}
                </div>
              )
            }
          </SearchAndFilter>
        </div>
      </section>
    </PublicLayout>
  );
}
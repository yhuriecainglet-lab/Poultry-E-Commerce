// app/shop/[category-slug]/page.tsx
// Category page: pre-filtered shop view for a single age category.

import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { supabaseServer } from "@/lib/supabase/server";
import { Chicken, Category } from "@/lib/types";
import { SearchAndFilter } from "@/components/SearchAndFilter";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ "category-slug": string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { "category-slug": slug } = await params;
  const { data: cat } = await supabaseServer
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!cat) return { title: "Category Not Found" };
  return {
    title: cat.name,
    description: `Browse our selection of ${cat.name.toLowerCase()}.`,
  };
}

export default async function CategoryPage({ params }: Props) {
  const { "category-slug": slug } = await params;

  const [{ data: cat }, { data: categoriesData }] = await Promise.all([
    supabaseServer
      .from("categories")
      .select("*")
      .eq("slug", slug)
      .single(),
    supabaseServer
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true }),
  ]);

  if (!cat) notFound();

  const category = cat as Category;
  const cats = (categoriesData ?? []) as Category[];

  const { data: chickensData } = await supabaseServer
    .from("chickens")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("category_id", category.id)
    .order("created_at", { ascending: false });

  const allChickens = (chickensData ?? []) as Chicken[];

  return (
    <PublicLayout>
      <section className="py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="text-sm text-muted mb-4" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link href="/shop" className="hover:text-primary">
              Shop
            </Link>
            <span className="mx-2">/</span>
            <span className="text-charcoal">{category.name}</span>
          </nav>

          <h1 className="text-2xl sm:text-3xl font-bold text-charcoal mb-2">
            {category.name}
          </h1>
          <p className="text-muted mb-6">
            {allChickens.length} chicken
            {allChickens.length === 1 ? "" : "s"} in this category
          </p>

          <SearchAndFilter
            chickens={allChickens}
            categories={cats}
            activeCategorySlug={slug}
          >
            {(filtered) =>
              filtered.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-5xl mb-3" aria-hidden="true">🐔</div>
                  <h2 className="text-lg font-semibold text-charcoal">
                    No chickens in this category yet
                  </h2>
                  <p className="text-muted mt-1">
                    New stock is on the way. Check back soon.
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
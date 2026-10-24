// app/page.tsx
// Homepage: hero, category cards, featured chickens, "Why Choose Us", and footer.
// Client-side data fetching for static export compatibility.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";
import { ProductCard } from "@/components/ProductCard";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Chicken, Category } from "@/lib/types";
import { BUSINESS } from "@/lib/config";
import { ProductGridSkeleton } from "@/components/LoadingSkeleton";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredChickens, setFeaturedChickens] = useState<Chicken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const supabase = createBrowserSupabaseClient();

    async function load() {
      try {
        const [{ data: cats }, { data: featured }] = await Promise.all([
          supabase.from("categories").select("*").order("sort_order", { ascending: true }),
          supabase
            .from("chickens")
            .select("*, category:categories(*)")
            .eq("is_featured", true)
            .eq("is_published", true)
            .order("created_at", { ascending: false })
            .limit(8),
        ]);
        if (mounted) {
          setCategories(cats ?? []);
          setFeaturedChickens(featured ?? []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          console.error("Failed to load homepage data:", err);
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
    return (
      <PublicLayout>
        <section className="py-12 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductGridSkeleton count={8} />
          </div>
        </section>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <section className="py-16 sm:py-24">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <div className="text-5xl mb-3" aria-hidden="true">🐔</div>
            <h2 className="text-lg font-semibold text-charcoal">Unable to load</h2>
            <p className="text-muted mt-1">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors mt-4"
            >
              Try Again
            </Link>
          </div>
        </section>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/5 to-cream py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal leading-tight">
            Fresh, Healthy Chickens Raised with Care
          </h1>
          <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto">
            {BUSINESS.tagline}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm sm:text-base hover:bg-primary-dark transition-colors shadow-sm"
            >
              Shop Chickens
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-charcoal font-semibold text-sm sm:text-base hover:bg-gray-50 transition-colors"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Category cards */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal text-center mb-8">
            Shop by Age
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-xl border border-border shadow-sm p-6 hover:shadow-md hover:border-primary/40 transition-all"
              >
                <div className="text-3xl mb-3" aria-hidden="true">
                  {cat.min_age_months === 4 ? "4️⃣" : cat.min_age_months === 5 ? "5️⃣" : "🐔"}
                </div>
                <h3 className="font-bold text-lg text-charcoal group-hover:text-primary transition-colors">
                  {cat.name}
                </h3>
                <p className="text-sm text-muted mt-1">
                  {cat.max_age_months === null
                    ? `${cat.min_age_months} months and older`
                    : `${cat.min_age_months} to ${cat.max_age_months} months old`}
                </p>
                <span className="inline-block mt-3 text-sm font-medium text-primary">
                  Browse &rarr;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured chickens */}
      {featuredChickens.length > 0 && (
        <section className="py-12 sm:py-16 bg-white/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal text-center mb-8">
              Featured Chickens
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featuredChickens.map((chicken) => (
                <ProductCard key={chicken.id} chicken={chicken} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl sm:text-2xl font-bold text-charcoal text-center mb-8">
            Why Choose Us
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Healthy Stock", desc: "All chickens are vaccinated, dewormed, and regularly checked by a vet." },
              { title: "Properly Raised", desc: "Free-range and grain-fed on our clean, spacious farm." },
              { title: "Fair Prices", desc: "Direct-from-farm pricing with no middlemen markups." },
              { title: "Reliable Service", desc: "Timely delivery and responsive support via Messenger or phone." },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white rounded-xl border border-border shadow-sm p-6"
              >
                <div className="text-2xl mb-3" aria-hidden="true">
                  {item.title === "Healthy Stock" ? "🏥" : item.title === "Properly Raised" ? "🌾" : item.title === "Fair Prices" ? "💰" : "📞"}
                </div>
                <h3 className="font-semibold text-charcoal">{item.title}</h3>
                <p className="text-sm text-muted mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

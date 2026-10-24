// app/chickens/detail/page.tsx
// Product details page: reads ?id= from query string, fetches chicken in browser.

"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import { ProductGallery } from "@/components/ProductGallery";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { InquiryButton } from "@/components/InquiryButton";
import { ProductCard } from "@/components/ProductCard";
import { getSupabase } from "@/lib/supabase";
import { Chicken, Category } from "@/lib/types";
import { formatPrice } from "@/lib/helpers";
import { ProductDetailSkeleton } from "@/components/LoadingSkeleton";

function ChickenDetailContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [chicken, setChicken] = useState<(Chicken & { category: Category }) | null>(null);
  const [related, setRelated] = useState<Chicken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("Chicken not found");
      setLoading(false);
      return;
    }
    let mounted = true;
    const supabase = getSupabase();

    async function load() {
      try {
        const { data: c, error: err } = await supabase
          .from("chickens")
          .select("*, category:categories(*)")
          .eq("id", id)
          .eq("is_published", true)
          .single();
        if (err || !c) {
          if (mounted) setError("Chicken not found");
          return;
        }
        if (mounted) setChicken(c as Chicken & { category: Category });

        const { data: relatedData } = await supabase
          .from("chickens")
          .select("*, category:categories(*)")
          .eq("is_published", true)
          .eq("category_id", (c as Chicken).category_id)
          .neq("id", id)
          .order("created_at", { ascending: false })
          .limit(4);
        if (mounted) setRelated((relatedData ?? []) as Chicken[]);
      } catch (err) {
        if (mounted) {
          console.error("Failed to load chicken:", err);
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
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (error || !chicken) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="text-7xl mb-4" aria-hidden="true">🐔</div>
        <h1 className="text-3xl font-bold text-charcoal mb-2">Chicken Not Found</h1>
        <p className="text-muted mb-8">Sorry, we couldn't find this chicken.</p>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const c = chicken;

  return (
    <section className="py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-muted mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-primary">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-primary">
            Shop
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/shop?category=${c.category.slug}`}
            className="hover:text-primary"
          >
            {c.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-charcoal">{c.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Gallery */}
          <ProductGallery images={c.image_urls} name={c.name} />

          {/* Details */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl font-bold text-charcoal">
              {c.name}
            </h1>
            <p className="text-muted mt-1">
              {c.breed} &middot; {c.age_months} months old
            </p>

            <div className="mt-4">
              <AvailabilityBadge stockQuantity={c.stock_quantity} />
            </div>

            <div className="mt-6">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(c.price)}
              </span>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex gap-2">
                <span className="font-semibold text-charcoal w-24">Sex</span>
                <span className="text-muted">{c.sex}</span>
              </div>
              {c.weight_kg != null && (
                <div className="flex gap-2">
                  <span className="font-semibold text-charcoal w-24">Weight</span>
                  <span className="text-muted">{c.weight_kg} kg</span>
                </div>
              )}
              {c.color && (
                <div className="flex gap-2">
                  <span className="font-semibold text-charcoal w-24">Color</span>
                  <span className="text-muted">{c.color}</span>
                </div>
              )}
              <div className="flex gap-2">
                <span className="font-semibold text-charcoal w-24">Category</span>
                <Link
                  href={`/shop?category=${c.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {c.category.name}
                </Link>
              </div>
            </div>

            <div className="mt-6">
              <InquiryButton isAvailable={c.stock_quantity > 0} />
            </div>
          </div>
        </div>

        {/* Description + health notes */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold text-charcoal mb-2">About This Chicken</h2>
            <p className="text-muted leading-relaxed">{c.description}</p>
          </div>
          {c.health_notes && (
            <div>
              <h2 className="text-lg font-semibold text-charcoal mb-2">Health Notes</h2>
              <p className="text-muted leading-relaxed">{c.health_notes}</p>
            </div>
          )}
        </div>

        {/* Related chickens */}
        {related.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-6">
              Related Chickens
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {related.map((chicken) => (
                <ProductCard key={chicken.id} chicken={chicken} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export default function ChickenDetailPage() {
  return (
    <PublicLayout>
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ChickenDetailContent />
      </Suspense>
    </PublicLayout>
  );
}

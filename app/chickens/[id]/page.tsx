// app/chickens/[id]/page.tsx
// Product details page with gallery, full info, inquiry button, and related chickens.

import Link from "next/link";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLayout } from "@/components/PublicLayout";
import { ProductGallery } from "@/components/ProductGallery";
import { AvailabilityBadge } from "@/components/AvailabilityBadge";
import { InquiryButton } from "@/components/InquiryButton";
import { ProductCard } from "@/components/ProductCard";
import { supabaseServer } from "@/lib/supabase/server";
import { Chicken, Category } from "@/lib/types";
import { formatPrice } from "@/lib/helpers";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: chicken } = await supabaseServer
    .from("chickens")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("is_published", true)
    .single();
  if (!chicken) return { title: "Chicken Not Found" };
  return {
    title: chicken.name,
    description: chicken.description,
  };
}

export default async function ChickenDetailPage({ params }: Props) {
  const { id } = await params;

  const { data: chicken, error } = await supabaseServer
    .from("chickens")
    .select("*, category:categories(*)")
    .eq("id", id)
    .eq("is_published", true)
    .single();

  if (error || !chicken) notFound();

  const c = chicken as Chicken & { category: Category };

  // Fetch up to 4 related chickens from the same category (excluding self).
  const { data: related } = await supabaseServer
    .from("chickens")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("category_id", c.category_id)
    .neq("id", c.id)
    .order("created_at", { ascending: false })
    .limit(4);

  const relatedChickens = (related ?? []) as Chicken[];

  return (
    <PublicLayout>
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
              href={`/shop/${c.category.slug}`}
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
                    href={`/shop/${c.category.slug}`}
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
          {relatedChickens.length > 0 && (
            <div className="mt-14">
              <h2 className="text-xl sm:text-2xl font-bold text-charcoal mb-6">
                Related Chickens
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {relatedChickens.map((chicken) => (
                  <ProductCard key={chicken.id} chicken={chicken} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
}
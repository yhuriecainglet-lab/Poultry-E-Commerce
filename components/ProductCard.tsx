// components/ProductCard.tsx
// Reusable product card shown on the homepage, shop, and category pages.
// Displays: main image, name, age, price, availability badge, and a View Details link.
// If no image exists, a placeholder is shown.

import Image from "next/image";
import Link from "next/link";
import { Chicken } from "@/lib/types";
import { AvailabilityBadge } from "./AvailabilityBadge";
import { formatPrice } from "@/lib/helpers";

interface Props {
  chicken: Chicken;
}

export function ProductCard({ chicken }: Props) {
  const mainImage = chicken.image_urls?.[0];
  const isSoldOut = chicken.stock_quantity === 0;

  return (
    <article
      className={`group flex flex-col bg-white rounded-xl border border-border shadow-sm overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 ${
        isSoldOut ? "opacity-80" : ""
      }`}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] bg-gray-100">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={chicken.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover"
            priority={false}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl bg-gray-200">
            🐔
          </div>
        )}
        {/* Sold out overlay */}
        {isSoldOut && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-gray-700 text-white text-xs font-bold px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-xs font-medium text-muted">
            {chicken.age_months} months old
          </span>
          <AvailabilityBadge stockQuantity={chicken.stock_quantity} />
        </div>

        <h3 className="font-semibold text-charcoal leading-snug line-clamp-2">
          {chicken.name}
        </h3>
        <p className="text-xs text-muted mt-0.5">
          {chicken.breed}
        </p>

        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-primary">
            {formatPrice(chicken.price)}
          </span>
          <Link
            href={`/chickens/${chicken.id}`}
            className={`text-sm font-medium transition-colors ${
              isSoldOut
                ? "text-muted cursor-not-allowed pointer-events-none"
                : "text-primary hover:text-primary-dark"
            }`}
          >
            View Details &rarr;
          </Link>
        </div>
      </div>
    </article>
  );
}
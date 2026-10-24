// components/SearchAndFilter.tsx
// Client-side search, category filter tabs, sort dropdown, and product grid.
// All filtering, searching, and sorting happen in the browser.

"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Chicken, Category } from "@/lib/types";
import { ProductCard } from "@/components/ProductCard";

interface Props {
  chickens: Chicken[];
  categories: Category[];
}

type SortKey = "newest" | "price-asc" | "price-desc";

export function SearchAndFilter({ chickens, categories }: Props) {
  const searchParams = useSearchParams();
  const initialSlug = searchParams.get("category") ?? "all";

  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState(initialSlug);
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    let list = [...chickens];

    if (categorySlug !== "all") {
      list = list.filter((c) => c.category?.slug === categorySlug);
    }

    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.breed.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [chickens, categorySlug, query, sort]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name or breed..."
            aria-label="Search chickens"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-charcoal placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortKey)}
          aria-label="Sort chickens"
          className="px-4 py-2.5 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
        >
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setCategorySlug("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            categorySlug === "all"
              ? "bg-primary text-white"
              : "bg-white border border-border text-muted hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategorySlug(cat.slug)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              categorySlug === cat.slug
                ? "bg-primary text-white"
                : "bg-white border border-border text-muted hover:bg-gray-50"
            }`}
          >
            {cat.min_age_months === 4
              ? "4 Months"
              : cat.min_age_months === 5
              ? "5 Months"
              : "6 Months & Older"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
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
      )}
    </div>
  );
}

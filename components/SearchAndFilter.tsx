// components/SearchAndFilter.tsx
// Client-side search, category filter tabs, and sort dropdown.
// Filtering happens in the browser for instant feedback.

"use client";

import { useState, useMemo } from "react";
import { Chicken, Category } from "@/lib/types";

interface Props {
  chickens: Chicken[];
  categories: Category[];
  activeCategorySlug?: string;
  children: (filtered: Chicken[]) => React.ReactNode;
}

type SortKey = "newest" | "price-asc" | "price-desc";

export function SearchAndFilter({
  chickens,
  categories,
  activeCategorySlug,
  children,
}: Props) {
  const [query, setQuery] = useState("");
  const [categorySlug, setCategorySlug] = useState(activeCategorySlug ?? "all");
  const [sort, setSort] = useState<SortKey>("newest");

  const filtered = useMemo(() => {
    let list = [...chickens];

    // Category filter
    if (categorySlug !== "all") {
      list = list.filter((c) => c.category?.slug === categorySlug);
    }

    // Search by name or breed
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.breed.toLowerCase().includes(q)
      );
    }

    // Sort
    list.sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      // newest: created_at descending
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return list;
  }, [chickens, categorySlug, query, sort]);

  return (
    <div className="space-y-4">
      {/* Search + Sort row */}
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

      {/* Category filter tabs */}
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

      {children(filtered)}
    </div>
  );
}
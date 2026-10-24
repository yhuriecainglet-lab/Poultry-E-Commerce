// app/admin/page.tsx
// Overview: totals, counts, and the 5 most recently added chickens.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Chicken } from "@/lib/types";
import { formatPrice } from "@/lib/helpers";
import { getAvailability } from "@/lib/types";

export default function AdminOverviewPage() {
  const [chickens, setChickens] = useState<Chicken[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase
      .from("chickens")
      .select("*, category:categories(*)")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setChickens((data ?? []) as Chicken[]);
        setLoading(false);
      });
  }, []);

  const all = chickens;
  const total = all.length;
  const inStock = all.filter((c) => c.stock_quantity > 5).length;
  const lowStock = all.filter((c) => c.stock_quantity >= 1 && c.stock_quantity <= 5).length;
  const soldOut = all.filter((c) => c.stock_quantity === 0).length;
  const unpublished = all.filter((c) => !c.is_published).length;
  const recentChickens = all.slice(0, 5);

  const stats = [
    { label: "Total Chickens", value: total, accent: "text-charcoal" },
    { label: "In Stock", value: inStock, accent: "text-success" },
    { label: "Low Stock", value: lowStock, accent: "text-warning" },
    { label: "Sold Out", value: soldOut, accent: "text-gray-500" },
    { label: "Unpublished", value: unpublished, accent: "text-muted" },
  ];

  if (loading) {
    return <div className="text-muted">Loading...</div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Dashboard</h1>
        <Link
          href="/admin/chickens/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
        >
          + Add Chicken
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-border shadow-sm p-4"
          >
            <p className="text-xs text-muted uppercase tracking-wide">{s.label}</p>
            <p className={`text-2xl font-bold mt-1 ${s.accent}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-charcoal">Recently Added</h2>
          <Link
            href="/admin/chickens"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>
        {recentChickens.length === 0 ? (
          <div className="text-center py-10 text-muted">
            No chickens yet.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentChickens.map((c) => (
              <div
                key={c.id}
                className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50"
              >
                <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0 overflow-hidden">
                  {c.image_urls?.[0] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.image_urls[0]}
                      alt={c.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="flex items-center justify-center h-full text-lg">
                      🐔
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-charcoal truncate">
                    {c.name}
                  </p>
                  <p className="text-xs text-muted">
                    {c.breed} &middot; {c.age_months} months
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-primary">
                    {formatPrice(c.price)}
                  </p>
                  <p className="text-xs text-muted">
                    {getAvailability(c.stock_quantity).status}
                  </p>
                </div>
                <Link
                  href={`/admin/chickens/${c.id}/edit`}
                  className="text-sm text-primary hover:underline ml-2"
                >
                  Edit
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// components/admin/AdminChickensTable.tsx
// Admin chicken list: search, category filter, publish/featured toggles, delete.

"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chicken, Category } from "@/lib/types";
import { formatPrice } from "@/lib/helpers";
import { deleteChicken, toggleChickenField } from "@/lib/actions/chickens";
import { Toast } from "./Toast";

interface Props {
  chickens: Chicken[];
  categories: Category[];
}

export function AdminChickensTable({ chickens, categories }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [catSlug, setCatSlug] = useState("all");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const catNames = useMemo(() => Object.fromEntries(categories.map((c) => [c.id, c.name])), [categories]);

  const list = useMemo(() => chickens.filter((c) => {
    const q = query.trim().toLowerCase();
    const byQuery = !q || c.name.toLowerCase().includes(q) || c.breed.toLowerCase().includes(q);
    const byCat = catSlug === "all" || c.category?.slug === catSlug;
    return byQuery && byCat;
  }), [chickens, query, catSlug]);

  function dismiss() { setTimeout(() => setToast(null), 4000); }

  async function toggle(id: string, field: "is_published" | "is_featured", value: boolean) {
    try {
      await toggleChickenField(id, field, value);
      router.refresh();
    } catch {
      setToast({ message: "Update failed", type: "error" });
      dismiss();
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this chicken?")) return;
    try {
      await deleteChicken(id);
      router.refresh();
      setToast({ message: "Deleted", type: "success" });
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
    dismiss();
  }

  return (
    <div className="space-y-4">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 w-full sm:w-80">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name or breed..."
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
          </svg>
        </div>
        <select value={catSlug} onChange={(e) => setCatSlug(e.target.value)} className="px-4 py-2.5 rounded-lg border border-border bg-white">
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.slug}>{cat.name}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border bg-gray-50">
              <th className="p-3">Image</th>
              <th className="p-3">Name</th>
              <th className="p-3">Breed</th>
              <th className="p-3">Category</th>
              <th className="p-3">Age</th>
              <th className="p-3 text-right">Price</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3 text-center">Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {list.map((c) => (
              <tr key={c.id} className="bg-white hover:bg-gray-50">
                <td className="p-3">
                  {c.image_urls?.[0] ? (
                    <img src={c.image_urls[0]} alt="" className="w-12 h-12 rounded object-cover" />
                  ) : (
                    <span className="flex w-12 h-12 items-center justify-center rounded bg-gray-200">🐔</span>
                  )}
                </td>
                <td className="p-3 font-medium text-charcoal">{c.name}</td>
                <td className="p-3 text-muted">{c.breed}</td>
                <td className="p-3 text-muted">{catNames[c.category_id] ?? "-"}</td>
                <td className="p-3 text-muted">{c.age_months} months</td>
                <td className="p-3 text-right font-medium">{formatPrice(c.price)}</td>
                <td className="p-3 text-right">
                  <span className="text-xs font-semibold">{c.stock_quantity}</span>
                </td>
                <td className="p-3 text-center space-y-1">
                  <button onClick={() => toggle(c.id, "is_published", !c.is_published)} className="px-2 py-1 rounded text-xs border transition-colors disabled:opacity-50" disabled={c.stock_quantity === 0 && !c.is_published}>
                    {c.is_published ? "Published" : "Draft"}
                  </button>
                  <button onClick={() => toggle(c.id, "is_featured", !c.is_featured)} className="px-2 py-1 rounded text-xs border transition-colors">
                    {c.is_featured ? "★ Featured" : "Feature"}
                  </button>
                </td>
                <td className="p-3 text-right space-y-1">
                  <Link href={`/admin/chickens/${c.id}/edit`} className="text-xs text-primary hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(c.id)} className="text-xs text-danger hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr><td colSpan={9} className="p-8 text-center text-muted">No chickens found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

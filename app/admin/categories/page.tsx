// app/admin/categories/page.tsx
// Manage age categories: list, add, edit, delete.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { Category } from "@/lib/types";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories";

interface CatFormProps {
  initial?: Category;
  onCancel: () => void;
}

function CategoryForm({ initial, onCancel }: CatFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      if (initial) await updateCategory(initial.id, formData);
      else await createCategory(formData);
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to save category");
      return;
    }
  }

  return (
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
      {error && <p className="text-sm text-danger">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Name</label>
          <input name="name" defaultValue={initial?.name ?? ""} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Slug</label>
          <input name="slug" defaultValue={initial?.slug ?? ""} required placeholder="e.g. 4-months" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Min age (months)</label>
          <input name="min_age_months" type="number" defaultValue={initial?.min_age_months ?? ""} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Max age (months, optional)</label>
          <input name="max_age_months" type="number" defaultValue={initial?.max_age_months ?? ""} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Sort order</label>
          <input name="sort_order" type="number" defaultValue={initial?.sort_order ?? 0} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
        </div>
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? "Saving..." : initial ? "Update" : "Add"}
        </button>
        <button type="button" onClick={onCancel} disabled={loading} className="px-4 py-2 rounded-lg border border-border text-charcoal text-sm hover:bg-gray-50 transition-colors disabled:opacity-50">
          Cancel
        </button>
      </div>
    </form>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.from("categories").select("*").order("sort_order", { ascending: true }).then(({ data }) => setCategories(data ?? []));
  }, []);

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(categories.filter((c) => c.id !== id));
    } catch {
      setError("Delete failed — category may still have chickens.");
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Age Categories</h1>
        <button onClick={() => { setEditing(undefined); setFormOpen(true); }} className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
          + Add Category
        </button>
      </div>
      {error && <p className="mb-4 text-sm text-danger">{error}</p>}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        <table className="w-full text-sm divide-y divide-border">
          <thead>
            <tr className="text-left text-xs text-muted border-b border-border bg-gray-50">
              <th className="p-3">Name</th>
              <th className="p-3">Slug</th>
              <th className="p-3 text-center">Age range</th>
              <th className="p-3 text-center">Sort</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50">
                <td className="p-3 font-medium text-charcoal">{c.name}</td>
                <td className="p-3 text-muted">{c.slug}</td>
                <td className="p-3 text-center text-muted">{c.min_age_months}{c.max_age_months == null ? "+" : "–" + c.max_age_months} mo</td>
                <td className="p-3 text-center text-muted">{c.sort_order}</td>
                <td className="p-3 text-right gap-2">
                  <button onClick={() => { setEditing(c); setFormOpen(true); }} className="text-xs text-primary hover:underline">Edit</button>
                  <button onClick={() => handleDelete(c.id)} className="text-xs text-danger hover:underline">Delete</button>
                </td>
              </tr>
            ))}
            {categories.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted">No categories yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
      {formOpen && (
        <div className="mt-6">
          <CategoryForm initial={editing} onCancel={() => { setFormOpen(false); setEditing(undefined); }} />
          <p className="mt-3 text-xs text-muted">Chickens belonging to a deleted category will also be removed.</p>
        </div>
      )}
      <div className="mt-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Back to dashboard</Link>
      </div>
    </div>
  );
}

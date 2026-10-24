// app/admin/categories/page.tsx
// Manage age categories: list, add, edit, delete.

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase";
import { Category } from "@/lib/types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>(undefined);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    supabase.from("categories").select("*").order("sort_order", { ascending: true }).then(({ data }) => setCategories(data ?? []));
  }, []);

  async function handleCreate(formData: FormData) {
    const supabase = createBrowserSupabaseClient();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const minAge = Number(formData.get("min_age_months"));
    const maxAgeRaw = formData.get("max_age_months");
    const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;
    const sortOrder = Number(formData.get("sort_order") || 0);

    const { data, error: err } = await supabase.from("categories").insert({
      name, slug, min_age_months: minAge, max_age_months: maxAge, sort_order: sortOrder,
    }).select().single();

    if (err) { setError(err.message); return; }
    if (data) setCategories((prev) => [...prev, data as Category].sort((a, b) => a.sort_order - b.sort_order));
    setFormOpen(false);
    setEditing(undefined);
  }

  async function handleUpdate(id: string, formData: FormData) {
    const supabase = createBrowserSupabaseClient();
    const name = formData.get("name") as string;
    const slug = formData.get("slug") as string;
    const minAge = Number(formData.get("min_age_months"));
    const maxAgeRaw = formData.get("max_age_months");
    const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;
    const sortOrder = Number(formData.get("sort_order") || 0);

    const { error: err } = await supabase.from("categories").update({
      name, slug, min_age_months: minAge, max_age_months: maxAge, sort_order: sortOrder,
    }).eq("id", id);

    if (err) { setError(err.message); return; }
    setCategories((prev) =>
      prev.map((c) => (c.id === id ? { ...c, name, slug, min_age_months: minAge, max_age_months: maxAge, sort_order: sortOrder } : c))
    );
    setFormOpen(false);
    setEditing(undefined);
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Delete this category?")) return;
    const supabase = createBrowserSupabaseClient();
    const { error: err } = await supabase.from("categories").delete().eq("id", id);
    if (err) { setError("Delete failed — category may still have chickens."); return; }
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    if (editing) await handleUpdate(editing.id, formData);
    else await handleCreate(formData);
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
          <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal">Name</label>
                <input name="name" defaultValue={editing?.name ?? ""} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal">Slug</label>
                <input name="slug" defaultValue={editing?.slug ?? ""} required placeholder="e.g. 4-months" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal">Min age (months)</label>
                <input name="min_age_months" type="number" defaultValue={editing?.min_age_months ?? ""} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal">Max age (months, optional)</label>
                <input name="max_age_months" type="number" defaultValue={editing?.max_age_months ?? ""} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 text-charcoal">Sort order</label>
                <input name="sort_order" type="number" defaultValue={editing?.sort_order ?? 0} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
              </div>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors">
                {editing ? "Update" : "Add"}
              </button>
              <button type="button" onClick={() => { setFormOpen(false); setEditing(undefined); }} className="px-4 py-2 rounded-lg border border-border text-charcoal text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
          <p className="mt-3 text-xs text-muted">Chickens belonging to a deleted category will also be removed.</p>
        </div>
      )}
      <div className="mt-6">
        <Link href="/admin" className="text-sm text-primary hover:underline">← Back to dashboard</Link>
      </div>
    </div>
  );
}

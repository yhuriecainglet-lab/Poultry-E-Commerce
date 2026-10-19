// app/admin/chickens/[id]/edit/page.tsx
// Edit an existing chicken. Supports adding new images and keeping existing ones.

"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import { updateChicken } from "@/lib/actions/chickens";
import { Chicken, Category } from "@/lib/types";

interface Props {
  params: Promise<{ id: string }>;
}

const SEXES: { label: string; value: "Male" | "Female" | "Unsexed" }[] = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Unsexed", value: "Unsexed" },
];

export default function EditChickenPage({ params }: Props) {
  const [chicken, setChicken] = useState<Chicken | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const idPromise = params.then((p) => p.id);
    Promise.all([
      idPromise.then((id) => supabase.from("chickens").select("*").eq("id", id).single()),
      supabase.from("categories").select("*").order("sort_order", { ascending: true }),
    ]).then(([{ data: c }, { data: cats }]) => {
      setChicken(c as Chicken);
      setCategories(cats ?? []);
    });
  }, [params]);

  if (!chicken) return null;

  const c = chicken;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    formData.append("keep_urls", (c.image_urls ?? []).join(","));
    try {
      await updateChicken(c.id, formData);
    } catch (err) {
      setError((err instanceof Error ? err.message : String(err)) || "Failed to update chicken");
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Edit Chicken</h1>
        <Link href="/admin/chickens" className="text-sm text-primary hover:underline">← Back to list</Link>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Name</label>
            <input name="name" defaultValue={chicken.name} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Breed</label>
            <input name="breed" defaultValue={chicken.breed} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Category</label>
            <select name="category_id" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option value="">Select category</option>
              {categories.map((c) => (c.min_age_months === null ? <option key={c.id} value={c.id} selected={c.id === chicken.category_id}>{c.name} ({c.min_age_months}+ months)</option> : <option key={c.id} value={c.id} selected={c.id === chicken.category_id}>{c.name} ({c.min_age_months} months)</option>))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Age (months)</label>
            <input name="age_months" type="number" defaultValue={chicken.age_months} required min="0" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Sex</label>
            <select name="sex" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">
              {SEXES.map((s) => <option key={s.value} value={s.value} selected={chicken.sex === s.value}>{s.label}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Weight (kg)</label>
            <input name="weight_kg" type="number" defaultValue={chicken.weight_kg ?? ""} step="0.1" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Color</label>
            <input name="color" defaultValue={chicken.color ?? ""} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Price</label>
            <input name="price" type="number" defaultValue={chicken.price} step="0.01" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Stock quantity</label>
            <input name="stock_quantity" type="number" defaultValue={chicken.stock_quantity} min="0" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Description</label>
            <textarea name="description" rows={3} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">{chicken.description}</textarea>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Health notes</label>
            <textarea name="health_notes" rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">{chicken.health_notes ?? ""}</textarea>
          </div>
        </div>
        {(chicken.image_urls ?? []).length > 0 && (
          <div>
            <label className="block text-sm font-medium mb-2 text-charcoal">Existing images</label>
            <div className="flex gap-2 mb-3">
              {(chicken.image_urls ?? []).map((url, i) => (
                <div key={i} className="relative w-20 h-20 rounded overflow-hidden border border-border">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <span className="absolute top-1 right-1 bg-black/60 text-white text-xs px-1 rounded">Keep</span>
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Add more images</label>
          <input name="images" type="file" multiple accept="image/*" className="block w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
        </div>
        <div className="flex items-start gap-2">
          <input name="is_featured" type="checkbox" defaultChecked={chicken.is_featured} className="mt-0.5" />
          <label className="text-sm text-charcoal">Featured</label>
        </div>
        <div className="flex items-start gap-2">
          <input name="is_published" type="checkbox" defaultChecked={chicken.is_published} className="mt-0.5" />
          <label className="text-sm text-charcoal">Published</label>
        </div>
        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

// app/admin/chickens/new/page.tsx
// Add a new chicken. Image files are uploaded to Supabase Storage on submit.

"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { Category } from "@/lib/types";

const SEXES = ["Male", "Female", "Unsexed"] as const;

export default function NewChickenPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const supabase = getSupabase();
    supabase.from("categories").select("*").order("sort_order", { ascending: true }).then(({ data }) => setCategories(data ?? []));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.currentTarget as HTMLFormElement;
    const formData = new FormData(form);
    const supabase = getSupabase();

    const fields = {
      name: formData.get("name") as string,
      breed: formData.get("breed") as string,
      age_months: Number(formData.get("age_months")),
      sex: formData.get("sex") as "Male" | "Female" | "Unsexed",
      weight_kg: formData.get("weight_kg") ? Number(formData.get("weight_kg")) : null,
      color: (formData.get("color") as string) || null,
      price: Number(formData.get("price")),
      stock_quantity: Number(formData.get("stock_quantity")),
      description: formData.get("description") as string,
      health_notes: (formData.get("health_notes") as string) || null,
      category_id: formData.get("category_id") as string,
      is_featured: formData.get("is_featured") === "on",
      is_published: formData.get("is_published") === "on",
    };

    const { data: chicken, error: insertError } = await supabase
      .from("chickens")
      .insert({ ...fields, image_urls: [] })
      .select()
      .single();

    if (insertError || !chicken) {
      setError(insertError?.message || "Failed to create chicken");
      setLoading(false);
      return;
    }

    const files = formData.getAll("images") as File[];
    const urls: string[] = [];
    for (const file of files) {
      if (!file || file.size === 0) continue;
      const ext = file.name.split(".").pop() ?? "jpg";
      const path = `chicken-images/${chicken.id}/${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from("chicken-images").upload(path, file, { cacheControl: "3600", upsert: false });
      if (uploadError) continue;
      const { data: urlData } = supabase.storage.from("chicken-images").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }

    if (urls.length) {
      await supabase.from("chickens").update({ image_urls: urls }).eq("id", chicken.id);
    }

    router.push("/admin/chickens");
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-charcoal">Add Chicken</h1>
        <Link href="/admin/chickens" className="text-sm text-primary hover:underline">← Back to list</Link>
      </div>
      {error && <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/30 text-danger text-sm">{error}</div>}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-border shadow-sm p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Name</label>
            <input name="name" required placeholder="e.g. Rhode Island Red Pullet" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Breed</label>
            <input name="breed" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Category</label>
            <select name="category_id" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Age (months)</label>
            <input name="age_months" type="number" required min="0" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Sex</label>
            <select name="sex" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40">
              {SEXES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Weight (kg)</label>
            <input name="weight_kg" type="number" step="0.1" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Color</label>
            <input name="color" className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Price</label>
            <input name="price" type="number" step="0.01" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-charcoal">Stock quantity</label>
            <input name="stock_quantity" type="number" min="0" required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Description</label>
            <textarea name="description" rows={3} required className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40"></textarea>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-1 text-charcoal">Health notes</label>
            <textarea name="health_notes" rows={2} className="w-full px-3 py-2 rounded-lg border border-border bg-white text-charcoal focus:outline-none focus:ring-2 focus:ring-primary/40"></textarea>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1 text-charcoal">Images</label>
          <input name="images" type="file" multiple accept="image/*" className="block w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark" />
        </div>
        <div className="flex items-start gap-2">
          <input name="is_featured" type="checkbox" className="mt-0.5" />
          <label className="text-sm text-charcoal">Featured</label>
        </div>
        <div className="flex items-start gap-2">
          <input name="is_published" type="checkbox" defaultChecked className="mt-0.5" />
          <label className="text-sm text-charcoal">Published</label>
        </div>
        <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50">
          {loading ? "Saving..." : "Add Chicken"}
        </button>
      </form>
    </div>
  );
}

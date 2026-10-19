// lib/actions/categories.ts
// Server actions for category management. Uses the service role client.

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const minAge = Number(formData.get("min_age_months"));
  const maxAgeRaw = formData.get("max_age_months");
  const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;
  const sortOrder = Number(formData.get("sort_order") || 0);

  const { error } = await supabaseAdmin.from("categories").insert({
    name,
    slug,
    min_age_months: minAge,
    max_age_months: maxAge,
    sort_order: sortOrder,
  });

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function updateCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const minAge = Number(formData.get("min_age_months"));
  const maxAgeRaw = formData.get("max_age_months");
  const maxAge = maxAgeRaw ? Number(maxAgeRaw) : null;
  const sortOrder = Number(formData.get("sort_order") || 0);

  const { error } = await supabaseAdmin
    .from("categories")
    .update({ name, slug, min_age_months: minAge, max_age_months: maxAge, sort_order: sortOrder })
    .eq("id", id);

  if (error) throw new Error(error.message);

  revalidatePath("/admin");
  revalidatePath("/admin/categories");
  redirect("/admin/categories");
}

export async function deleteCategory(id: string) {
  const { error } = await supabaseAdmin.from("categories").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/categories");
}

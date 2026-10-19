// lib/actions/chickens.ts
// Server actions for chicken management. Uses the service role client so admin writes bypass RLS.

"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/admin";

function randomId() {
  return crypto.randomUUID();
}

async function uploadImages(chickenId: string, files: File[]): Promise<string[]> {
  if (!files.length) return [];
  const urls: string[] = [];
  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `chicken-images/${chickenId}/${randomId()}.${ext}`;
    const { error } = await supabaseAdmin.storage.from("chicken-images").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) continue;
    const { data } = supabaseAdmin.storage.from("chicken-images").getPublicUrl(path);
    urls.push(data.publicUrl);
  }
  return urls;
}

function chickenFields(formData: FormData) {
  return {
    name: formData.get("name") as string,
    breed: formData.get("breed") as string,
    age_months: Number(formData.get("age_months")),
    sex: formData.get("sex") as "Male" | "Female" | "Unsexed",
    weight_kg: formData.get("weight_kg") ? Number(formData.get("weight_kg")) : null,
    color: formData.get("color") as string || null,
    price: Number(formData.get("price")),
    stock_quantity: Number(formData.get("stock_quantity")),
    description: formData.get("description") as string,
    health_notes: formData.get("health_notes") as string || null,
    category_id: formData.get("category_id") as string,
    is_featured: formData.get("is_featured") === "on",
    is_published: formData.get("is_published") === "on",
  };
}

export async function createChicken(formData: FormData) {
  const fields = chickenFields(formData);
  const files = formData.getAll("images") as File[];

  const { data: chicken, error } = await supabaseAdmin
    .from("chickens")
    .insert({ ...fields, image_urls: [] })
    .select()
    .single();

  if (error || !chicken) {
    throw new Error(error?.message || "Failed to create chicken");
  }

  const urls = await uploadImages(chicken.id, files);
  if (urls.length) {
    await supabaseAdmin.from("chickens").update({ image_urls: urls }).eq("id", chicken.id);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/chickens");
  redirect("/admin/chickens");
}

export async function updateChicken(id: string, formData: FormData) {
  const fields = chickenFields(formData);
  const files = formData.getAll("images") as File[];
  const keepUrls = ((formData.get("keep_urls") as string) ?? "").split(",").filter(Boolean);

  await supabaseAdmin.from("chickens").update(fields).eq("id", id);

  const newUrls = await uploadImages(id, files);
  await supabaseAdmin.from("chickens").update({ image_urls: [...keepUrls, ...newUrls] }).eq("id", id);

  revalidatePath("/admin");
  revalidatePath("/admin/chickens");
  redirect("/admin/chickens");
}

export async function deleteChicken(id: string) {
  await supabaseAdmin.from("chickens").delete().eq("id", id);
  revalidatePath("/admin/chickens");
}

export async function toggleChickenField(id: string, field: "is_published" | "is_featured", value: boolean) {
  await supabaseAdmin.from("chickens").update({ [field]: value }).eq("id", id);
  revalidatePath("/admin/chickens");
}

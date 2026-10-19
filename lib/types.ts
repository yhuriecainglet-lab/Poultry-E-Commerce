// lib/types.ts
// Shared TypeScript types for the poultry e-commerce app.

export interface Category {
  id: string;
  name: string;
  slug: string;
  min_age_months: number;
  max_age_months: number | null;
  sort_order: number;
}

export interface Chicken {
  id: string;
  name: string;
  breed: string;
  age_months: number;
  sex: "Male" | "Female" | "Unsexed";
  weight_kg: number | null;
  color: string | null;
  price: number;
  stock_quantity: number;
  description: string;
  health_notes: string | null;
  image_urls: string[];
  category_id: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  category?: Category;
}

export type AvailabilityStatus = "In Stock" | "Low Stock" | "Sold Out";

// Derive availability from stock quantity (never stored in the DB).
export function getAvailability(stock_quantity: number): {
  status: AvailabilityStatus;
  remaining: number | null;
} {
  if (stock_quantity > 5) {
    return { status: "In Stock", remaining: null };
  }
  if (stock_quantity >= 1) {
    return { status: "Low Stock", remaining: stock_quantity };
  }
  return { status: "Sold Out", remaining: 0 };
}
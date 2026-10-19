// lib/helpers.ts
// Shared utility helpers.

import { CURRENCY } from "./config";

// Format a numeric price using the single currency constant.
// Example: formatPrice(1200) => "₱1,200.00"
export function formatPrice(amount: number): string {
  if (amount == null || Number.isNaN(amount)) {
    return `${CURRENCY.symbol}0.00`;
  }
  return new Intl.NumberFormat(CURRENCY.locale, {
    style: "currency",
    currency: CURRENCY.code,
  }).format(amount);
}

// Derive the category slug from a chicken's age in months.
// Ages below 4 return null — the admin must pick a category manually.
export function categorySlugForAge(ageMonths: number): string | null {
  if (ageMonths === 4) return "4-months";
  if (ageMonths === 5) return "5-months";
  if (ageMonths >= 6) return "6-months-and-older";
  return null;
}

// Build a comma-separated list of image URLs, filtering out empty values.
export function cleanImageUrls(urls: (string | null | undefined)[]): string[] {
  return (urls ?? []).filter((u): u is string => !!u && u.trim().length > 0);
}

// Truncate text to a maximum length, adding an ellipsis.
export function truncate(text: string, maxLength: number): string {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}
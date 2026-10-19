// lib/config.ts
// Single source of truth for business configuration.
// Edit these values in one place.

export const BUSINESS = {
  name: "Farm Fresh Poultry",
  tagline: "Healthy, home-raised chickens delivered fresh to your table.",
  contactPhone: "+63 912 345 6789",
  facebookMessengerLink: "https://m.me/farmfreshpoultry",
} as const;

// ONE constant for currency. Change here to update all prices globally.
export const CURRENCY = {
  code: "PHP",
  symbol: "₱",
  locale: "en-PH",
} as const;
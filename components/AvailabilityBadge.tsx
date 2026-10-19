// components/AvailabilityBadge.tsx
// Shows a color-coded badge derived from stock quantity.
// Rules (derived in code, never stored):
//   stock > 5  -> In Stock (green)
//   stock 1-5  -> Low Stock (orange) with "Only X left"
//   stock = 0  -> Sold Out (gray)

import { getAvailability } from "@/lib/types";

interface Props {
  stockQuantity: number;
  className?: string;
}

export function AvailabilityBadge({ stockQuantity, className = "" }: Props) {
  const { status, remaining } = getAvailability(stockQuantity);

  const styles: Record<string, string> = {
    "In Stock": "bg-success/15 text-success",
    "Low Stock": "bg-warning/15 text-warning",
    "Sold Out": "bg-gray-200 text-gray-600",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${styles[status]} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "In Stock"
            ? "bg-success"
            : status === "Low Stock"
            ? "bg-warning"
            : "bg-gray-500"
        }`}
      />
      {status}
      {remaining !== null && remaining > 0 && (
        <span className="opacity-80">({remaining} left)</span>
      )}
    </span>
  );
}
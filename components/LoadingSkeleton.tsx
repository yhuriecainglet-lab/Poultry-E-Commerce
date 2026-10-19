// components/LoadingSkeleton.tsx
// Reusable loading skeletons for product grids and detail pages.

interface GridProps {
  count?: number;
}

export function ProductGridSkeleton({ count = 8 }: GridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="aspect-[4/3] bg-gray-200 animate-pulse" />
          <div className="p-4 space-y-3">
            <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
            <div className="h-5 bg-gray-200 rounded w-1/4 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ProductDetailSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6 animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="aspect-square bg-gray-200 rounded-xl animate-pulse" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-5 bg-gray-200 rounded w-1/2 animate-pulse" />
          <div className="h-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-12 bg-gray-200 rounded w-1/3 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
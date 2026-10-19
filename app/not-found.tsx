// app/not-found.tsx
// Custom 404 page shown when a route does not exist.

import Link from "next/link";
import { PublicLayout } from "@/components/PublicLayout";

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="text-7xl sm:text-8xl mb-4" aria-hidden="true">
            🐔
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-2">
            Page Not Found
          </h1>
          <p className="text-muted mb-8">
            Sorry, we cannot find the page you were looking for. It may have
            been moved, deleted, or the link is incorrect.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-charcoal font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Browse Shop
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
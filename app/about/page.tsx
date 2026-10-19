// app/about/page.tsx
// Simple static About page using values from lib/config.ts.

import Link from "next/link";
import { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: "About",
  description: `Learn more about ${BUSINESS.name} and our farming practices.`,
};

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">
            About {BUSINESS.name}
          </h1>
          <div className="prose prose-charcoal max-w-none">
            <p className="text-lg text-muted leading-relaxed">
              {BUSINESS.tagline}
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              We are a family-run poultry farm dedicated to raising healthy,
              well-cared-for chickens. Our birds are free-range, grain-fed, and
              regularly checked by a veterinarian. We sell by age group so you
              can choose the right chicken for your needs — whether you want a
              young pullet for egg production or a mature bird for the table.
            </p>
            <p className="mt-4 text-muted leading-relaxed">
              We believe in fair prices, reliable service, and direct
              communication with our customers. No middlemen, no hidden fees —
              just honest, farm-fresh poultry.
            </p>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors"
            >
              Shop Chickens
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-border text-charcoal font-semibold text-sm hover:bg-gray-50 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
// app/contact/page.tsx
// Simple static Contact page using values from lib/config.ts.

import Link from "next/link";
import { Metadata } from "next";
import { PublicLayout } from "@/components/PublicLayout";
import { BUSINESS } from "@/lib/config";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${BUSINESS.name} via Messenger or phone.`,
};

export default function ContactPage() {
  return (
    <PublicLayout>
      <section className="py-12 sm:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-charcoal mb-6">
            Contact Us
          </h1>
          <p className="text-lg text-muted mb-8">
            Have a question or want to place an order? Reach out to us — we
            reply fast!
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Phone */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <div className="text-2xl mb-3" aria-hidden="true">📞</div>
              <h2 className="font-semibold text-charcoal mb-1">Call Us</h2>
              <a
                href={`tel:${BUSINESS.contactPhone.replace(/\s/g, "")}`}
                className="text-primary font-medium hover:underline"
              >
                {BUSINESS.contactPhone}
              </a>
            </div>

            {/* Messenger */}
            <div className="bg-white rounded-xl border border-border shadow-sm p-6">
              <div className="text-2xl mb-3" aria-hidden="true">💬</div>
              <h2 className="font-semibold text-charcoal mb-1">Message Us</h2>
              <p className="text-muted text-sm mb-3">
                Chat with us on Facebook Messenger for quick replies.
              </p>
              <a
                href={BUSINESS.facebookMessengerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors"
              >
                Open Messenger
              </a>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="text-sm font-medium text-primary hover:underline"
            >
              ← Back to Shop
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
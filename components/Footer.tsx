// components/Footer.tsx
// Site footer with business name, contact info, and copyright.

import { BUSINESS } from "@/lib/config";

export function Footer() {
  return (
    <footer className="mt-auto bg-charcoal text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
          <div>
            <p className="font-bold text-white text-lg">{BUSINESS.name}</p>
            <p className="text-sm text-muted mt-1 max-w-xs">
              {BUSINESS.tagline}
            </p>
          </div>
          <div className="text-sm">
            <p>
              <a
                href={`tel:${BUSINESS.contactPhone.replace(/\s/g, "")}`}
                className="hover:text-white transition-colors"
              >
                {BUSINESS.contactPhone}
              </a>
            </p>
            <p className="mt-1">
              <a
                href={BUSINESS.facebookMessengerLink}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors"
              >
                Message on Messenger
              </a>
            </p>
          </div>
        </div>
        <div className="mt-6 pt-6 border-t border-gray-700 text-center text-xs text-muted">
          &copy; {BUSINESS.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
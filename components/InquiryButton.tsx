// components/InquiryButton.tsx
// Opens the Messenger link from lib/config.ts in a new tab.
// Also shows a "Call" link using the phone number.
// Disabled (shows "Currently Unavailable") when the chicken is sold out.

import { BUSINESS } from "@/lib/config";

interface Props {
  isAvailable: boolean;
}

export function InquiryButton({ isAvailable }: Props) {
  if (!isAvailable) {
    return (
      <div className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gray-200 text-gray-600 font-semibold text-sm cursor-not-allowed">
        Currently Unavailable
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <a
        href={BUSINESS.facebookMessengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-white font-semibold text-sm hover:bg-primary-dark transition-colors shadow-sm"
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 5.078 3.657 9.32 8.5 10.477.25.047.54.01.79-.01.25-.02.5-.14.62-.38l.26-.77c.11-.32.05-.67-.14-.93-.19-.26-.5-.34-.78-.42-1.48-.4-2.9-1.2-3.8-2.5-.7-1.1-1.1-2.4-1.1-3.9 0-3.2 2.6-5.8 5.8-5.8s5.8 2.6 5.8 5.8c0 1.5-.4 2.8-1.1 3.9-.9 1.3-2.3 2.1-3.8 2.5-.28.08-.59.16-.78.42-.19.26-.25.61-.14.93l.26.77c.12.24.37.36.62.38.25.02.54 0 .79-.01C18.34 21.32 22 17.078 22 12 22 6.477 17.523 2 12 2zm-2.2 10.4c.1.2.1.4 0 .6-.1.2-.3.3-.5.3H6.9l-.5-.5v-2.4c0-1.8 1.4-3.2 3.2-3.2s3.2 1.4 3.2 3.2v1.2c0 .4-.3.7-.7.7h-1.2c-.4 0-.7-.3-.7-.7v-1.2c0-1-.8-1.8-1.8-1.8s-1.8.8-1.8 1.8v1.2c0 .2.1.4.2.5.1.1.3.2.4.2h1.2c.2 0 .4-.1.5-.2z" />
        </svg>
        Inquire on Messenger
      </a>
      <a
        href={`tel:${BUSINESS.contactPhone.replace(/\s/g, "")}`}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border-2 border-primary text-primary font-semibold text-sm hover:bg-primary/5 transition-colors"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 5a2 2 0 012-2h3.28a2 2 0 011.89 1.21l1.3 3.2a2 2 0 01-.45 2.11l-1.1 1.1a16.9 16.9 0 006.5 6.5l1.1-1.1a2 2 0 012.11-.45l3.2 1.3A2 2 0 0122 18.72V21a2 2 0 01-2 2A16.9 16.9 0 013 6z"
          />
        </svg>
        Call {BUSINESS.contactPhone}
      </a>
    </div>
  );
}
// app/layout.tsx
// Root layout — applies the chosen Google Font (Poppins) and global metadata.

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { BUSINESS } from "@/lib/config";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: BUSINESS.name,
    template: `%s | ${BUSINESS.name}`,
  },
  description: BUSINESS.tagline,
  metadataBase: new URL("https://example.com"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-cream text-charcoal">
        {children}
      </body>
    </html>
  );
}
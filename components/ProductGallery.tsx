// components/ProductGallery.tsx
// Image gallery: large main image plus clickable thumbnails.

"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [];

  if (safeImages.length === 0) {
    return (
      <div className="aspect-square bg-gray-200 rounded-xl flex items-center justify-center text-8xl">
        🐔
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
        <Image
          src={safeImages[active]}
          alt={`${name} - image ${active + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 40vw"
          className="object-cover"
          priority
        />
      </div>

      {/* Thumbnails */}
      {safeImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Select image ${idx + 1}`}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                idx === active
                  ? "border-primary"
                  : "border-transparent hover:border-primary/50"
              }`}
            >
              <Image
                src={src}
                alt={`${name} thumbnail ${idx + 1}`}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
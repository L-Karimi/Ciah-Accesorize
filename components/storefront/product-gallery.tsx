"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductGalleryImage } from "@/lib/catalog";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: ProductGalleryImage[];
  name: string;
  accent: string;
}

export function ProductGallery({ images, name, accent }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedImage = images[selectedIndex] ?? images[0];

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "group relative overflow-hidden rounded-[34px] bg-gradient-to-br shadow-[0_24px_80px_rgba(17,17,17,0.08)]",
          accent,
        )}
      >
        <div className="absolute left-5 top-5 z-10 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5E3C]">
          Product Gallery
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={selectedImage.src}
            alt={selectedImage.alt}
            fill
            priority
            className="object-contain p-8 transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute bottom-4 right-4 rounded-full bg-black/65 px-3 py-1 text-xs font-medium text-white">
          Hover to zoom
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {images.map((image, index) => (
          <button
            key={`${image.src}-${index}`}
            type="button"
            onClick={() => setSelectedIndex(index)}
            className={cn(
              "relative overflow-hidden rounded-[22px] border bg-white p-2 shadow-sm transition-all",
              index === selectedIndex
                ? "border-[#8B5E3C] ring-2 ring-[#8B5E3C]/20"
                : "border-border/70 hover:border-[#d6c2a6]",
            )}
            aria-label={`View gallery image ${index + 1} for ${name}`}
          >
            <div className={cn("relative aspect-square rounded-[16px] bg-gradient-to-br", accent)}>
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-contain p-3"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

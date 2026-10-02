"use client";

import Image from "next/image";
import { useState } from "react";

export type GallerySlide = { url: string; alt: string };

export function ProductGallery({ images }: { images: GallerySlide[] }) {
  const [active, setActive] = useState(0);
  const current = images[active] ?? images[0];
  if (!current) {
    return <div className="flex aspect-[4/5] items-center justify-center bg-card text-sm text-muted">Görsel yok</div>;
  }

  return (
    <div>
      <div className="relative aspect-[4/5] bg-card sm:aspect-[5/4]">
        <Image
          src={current.url}
          alt={current.alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 58vw"
          className="object-cover"
        />
      </div>
      {images.length > 1 ? (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`}>
              <button
                type="button"
                aria-label={`${image.alt} görselini göster`}
                aria-current={index === active ? "true" : undefined}
                onClick={() => setActive(index)}
                className={`relative h-20 w-16 overflow-hidden bg-card sm:h-24 sm:w-20 ${index === active ? "ring-2 ring-accent" : ""}`}
              >
                <Image src={image.url} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

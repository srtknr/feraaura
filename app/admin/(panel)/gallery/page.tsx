import type { Metadata } from "next";
import { GalleryManager } from "@/components/admin/GalleryManager";
import { listGallery } from "@/lib/data/gallery";

export const metadata: Metadata = { title: "Galeri" };

export default async function GalleryPage() {
  const images = await listGallery();

  return (
    <div>
      <h1 className="font-serif text-4xl">Galeri</h1>
      <p className="mt-2 text-sm text-muted">Ana sayfadaki görsel bölüm. Sıra küçükten büyüğe dizilir.</p>
      <div className="mt-8">
        <GalleryManager
          images={images.map((image) => ({
            id: image.id,
            url: image.url,
            alt: image.alt,
            caption: image.caption,
            displayOrder: image.displayOrder,
          }))}
        />
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { addGalleryImage, deleteGalleryAction, updateGalleryAction } from "@/lib/actions";
import { initialActionState } from "@/lib/validators";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { uploadImage } from "@/components/admin/upload";
import { Banner, ConfirmButton, SubmitButton } from "@/components/admin/ui";

type GalleryItem = {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
  displayOrder: number;
};

export function GalleryManager({ images }: { images: GalleryItem[] }) {
  const [state, action, pending] = useActionState(addGalleryImage, initialActionState);
  const [uploaded, setUploaded] = useState<{ url: string; key: string } | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (state.ok) setUploaded(null);
  }, [state.ok, state.stamp]);

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      setUploaded(await uploadImage(file, "gallery"));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-8">
      <form action={action} className="grid max-w-xl gap-4 border border-line bg-card p-5">
        <h2 className="font-serif text-2xl">Görsel ekle</h2>
        <Banner message={state.ok ? state.message : undefined} />
        <Banner message={!state.ok ? state.message : undefined} tone="error" />
        <input type="hidden" name="url" value={uploaded?.url ?? ""} />
        <input type="hidden" name="storageKey" value={uploaded?.key ?? ""} />
        <div className="flex items-center gap-4">
          <div className="relative h-24 w-24 border border-line bg-ink">
            {uploaded ? <Image src={uploaded.url} alt="" fill sizes="96px" className="object-cover" /> : null}
          </div>
          <label className="cursor-pointer border border-line px-3 py-2 text-sm hover:border-accent">
            {uploading ? "Yükleniyor..." : "Dosya seç"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" onChange={onFile} />
          </label>
        </div>
        {error ? <p className="text-sm text-red-300">{error}</p> : null}
        <label className="text-sm text-muted">
          Alt metin
          <input name="alt" className={inputClass} />
        </label>
        <label className="text-sm text-muted">
          Altyazı
          <input name="caption" className={inputClass} />
        </label>
        <label className="text-sm text-muted">
          Sıra
          <input name="displayOrder" type="number" defaultValue={images.length} className={inputClass} />
        </label>
        <button type="submit" disabled={pending || !uploaded} className={buttonClass}>
          {pending ? "Ekleniyor..." : "Galeriye ekle"}
        </button>
      </form>
      {images.length === 0 ? (
        <p className="text-sm text-muted">Henüz galeri görseli yok.</p>
      ) : (
        <ul className="space-y-4">
          {images.map((image) => (
            <li key={image.id} className="grid gap-4 border border-line p-4 md:grid-cols-[140px_minmax(0,1fr)_auto]">
              <div className="relative h-28 bg-card">
                <Image src={image.url} alt={image.alt || ""} fill sizes="140px" className="object-cover" />
              </div>
              <form action={updateGalleryAction} className="grid gap-3 sm:grid-cols-3">
                <input type="hidden" name="id" value={image.id} />
                <label className="text-xs text-muted">
                  Alt metin
                  <input name="alt" defaultValue={image.alt ?? ""} className={inputClass} />
                </label>
                <label className="text-xs text-muted">
                  Altyazı
                  <input name="caption" defaultValue={image.caption ?? ""} className={inputClass} />
                </label>
                <label className="text-xs text-muted">
                  Sıra
                  <input name="displayOrder" type="number" defaultValue={image.displayOrder} className={inputClass} />
                </label>
                <SubmitButton className={buttonClass}>Sırayı kaydet</SubmitButton>
              </form>
              <form action={deleteGalleryAction}>
                <input type="hidden" name="id" value={image.id} />
                <ConfirmButton label="Sil" message="Görsel silinsin mi?" className="text-sm text-red-300" />
              </form>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

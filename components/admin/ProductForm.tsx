"use client";

import Image from "next/image";
import { useActionState, useState } from "react";
import { saveProduct } from "@/lib/actions";
import { slugify } from "@/lib/format";
import { initialActionState } from "@/lib/validators";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { uploadImage } from "@/components/admin/upload";
import { Banner, FieldError } from "@/components/admin/ui";

type GalleryItem = { url: string; storageKey: string | null; alt: string };

export type ProductFormValues = {
  id?: string;
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: string;
  currency: string;
  coverImage: string | null;
  coverImageKey: string | null;
  categoryId: string;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  images: GalleryItem[];
};

export function ProductForm({
  values,
  categories,
  saved = false,
}: {
  values: ProductFormValues;
  categories: { id: string; name: string }[];
  saved?: boolean;
}) {
  const [state, action, pending] = useActionState(saveProduct, initialActionState);
  const [name, setName] = useState(values.name);
  const [slug, setSlug] = useState(values.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(values.id));
  const [images, setImages] = useState<GalleryItem[]>(values.images);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const errors = state.fieldErrors ?? {};

  async function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setUploading(true);
    setUploadError("");
    try {
      const uploaded = await Promise.all(files.map((file) => uploadImage(file, "products")));
      setImages((current) => [
        ...current,
        ...uploaded.map((image) => ({ url: image.url, storageKey: image.key, alt: name })),
      ]);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Görseller yüklenemedi.");
    } finally {
      setUploading(false);
    }
  }

  function move(index: number, direction: -1 | 1) {
    setImages((current) => {
      const next = [...current];
      const target = index + direction;
      if (target < 0 || target >= next.length) return current;
      const [item] = next.splice(index, 1);
      next.splice(target, 0, item);
      return next;
    });
  }

  return (
    <form action={action} className="grid max-w-3xl gap-6">
      {saved ? <Banner message="Ürün kaydedildi." /> : null}
      <Banner message={state.message} tone="error" />
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <input type="hidden" name="imagesJson" value={JSON.stringify(images)} />
      {categories.length === 0 ? (
        <Banner tone="error" message="Ürün eklemeden önce bir kategori oluşturun." />
      ) : null}
      <label className="block text-sm text-muted">
        Ad
        <input
          name="name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            if (!slugTouched) setSlug(slugify(event.target.value));
          }}
          className={inputClass}
          required
        />
        <FieldError message={errors.name} />
      </label>
      <label className="block text-sm text-muted">
        Slug
        <input
          name="slug"
          value={slug}
          onChange={(event) => {
            setSlugTouched(true);
            setSlug(event.target.value.toLowerCase());
          }}
          onBlur={(event) => setSlug(slugify(event.target.value))}
          className={inputClass}
          required
        />
        <FieldError message={errors.slug} />
      </label>
      <label className="block text-sm text-muted">
        Kısa açıklama
        <textarea name="shortDescription" defaultValue={values.shortDescription} rows={3} className={inputClass} required />
        <FieldError message={errors.shortDescription} />
      </label>
      <label className="block text-sm text-muted">
        Açıklama
        <textarea name="description" defaultValue={values.description} rows={8} className={inputClass} required />
        <FieldError message={errors.description} />
      </label>
      <div className="grid gap-6 sm:grid-cols-3">
        <label className="block text-sm text-muted">
          Fiyat
          <input name="price" defaultValue={values.price} inputMode="decimal" className={inputClass} placeholder="Boş bırakılabilir" />
          <FieldError message={errors.price} />
        </label>
        <label className="block text-sm text-muted">
          Para birimi
          <select name="currency" defaultValue={values.currency} className={inputClass}>
            <option value="TRY">TRY</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
          </select>
        </label>
        <label className="block text-sm text-muted">
          Sıra
          <input name="displayOrder" type="number" defaultValue={values.displayOrder} className={inputClass} />
          <FieldError message={errors.displayOrder} />
        </label>
      </div>
      <label className="block text-sm text-muted">
        Kategori
        <select name="categoryId" defaultValue={values.categoryId} className={inputClass} required>
          <option value="">Seçin</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <FieldError message={errors.categoryId} />
      </label>
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isPublished" defaultChecked={values.isPublished} className="size-4 accent-[#D96B27]" />
          Yayında
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" name="isFeatured" defaultChecked={values.isFeatured} className="size-4 accent-[#D96B27]" />
          Öne çıkan
        </label>
      </div>
      <ImagePicker
        folder="products"
        label="Kapak görseli"
        urlName="coverImage"
        keyName="coverImageKey"
        initialUrl={values.coverImage}
        initialKey={values.coverImageKey}
      />
      <div>
        <p className="text-sm text-muted">Galeri</p>
        <label className="mt-2 inline-flex cursor-pointer border border-line px-3 py-2 text-sm hover:border-accent">
          {uploading ? "Yükleniyor..." : "Görsel ekle"}
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={addFiles} disabled={uploading} />
        </label>
        {uploadError ? <p className="mt-2 text-sm text-red-300">{uploadError}</p> : null}
        <ul className="mt-4 space-y-4">
          {images.map((image, index) => (
            <li key={`${image.url}-${index}`} className="grid gap-3 border border-line p-3 sm:grid-cols-[96px_minmax(0,1fr)]">
              <div className="relative h-24 w-24 bg-ink">
                <Image src={image.url} alt="" fill sizes="96px" className="object-cover" />
              </div>
              <div className="space-y-2">
                <label className="block text-xs text-muted">
                  Alt metin
                  <input
                    value={image.alt}
                    onChange={(event) =>
                      setImages((current) => current.map((item, itemIndex) => (itemIndex === index ? { ...item, alt: event.target.value } : item)))
                    }
                    className={inputClass}
                  />
                </label>
                <div className="flex flex-wrap gap-3 text-sm">
                  <button type="button" className="text-muted hover:text-cream" onClick={() => move(index, -1)} aria-label="Yukarı taşı">
                    Yukarı
                  </button>
                  <button type="button" className="text-muted hover:text-cream" onClick={() => move(index, 1)} aria-label="Aşağı taşı">
                    Aşağı
                  </button>
                  <button
                    type="button"
                    className="text-red-300"
                    onClick={() => setImages((current) => current.filter((_, itemIndex) => itemIndex !== index))}
                  >
                    Kaldır
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {images.length === 0 ? <p className="mt-3 text-sm text-muted">Henüz galeri görseli yok.</p> : null}
      </div>
      <button type="submit" disabled={pending || categories.length === 0} className={buttonClass}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { uploadImage } from "@/components/admin/upload";

export function ImagePicker({
  folder,
  label,
  urlName,
  keyName,
  initialUrl,
  initialKey,
}: {
  folder: string;
  label: string;
  urlName: string;
  keyName: string;
  initialUrl?: string | null;
  initialKey?: string | null;
}) {
  const [url, setUrl] = useState(initialUrl ?? "");
  const [storageKey, setStorageKey] = useState(initialKey ?? "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setPending(true);
    setError("");
    try {
      const uploaded = await uploadImage(file, folder);
      setUrl(uploaded.url);
      setStorageKey(uploaded.key);
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Görsel yüklenemedi.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <span className="text-sm text-muted">{label}</span>
      <input type="hidden" name={urlName} value={url} />
      <input type="hidden" name={keyName} value={storageKey} />
      <div className="mt-2 flex flex-wrap items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden border border-line bg-ink">
          {url ? <Image src={url} alt="" fill sizes="96px" className="object-cover" /> : null}
        </div>
        <label className="cursor-pointer border border-line px-3 py-2 text-sm hover:border-accent">
          {pending ? "Yükleniyor..." : url ? "Görseli değiştir" : "Görsel yükle"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="sr-only"
            onChange={onChange}
            disabled={pending}
          />
        </label>
        {url ? (
          <button
            type="button"
            className="text-sm text-muted hover:text-cream"
            onClick={() => {
              setUrl("");
              setStorageKey("");
            }}
          >
            Kaldır
          </button>
        ) : null}
      </div>
      {error ? (
        <p className="mt-2 text-sm text-red-300" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

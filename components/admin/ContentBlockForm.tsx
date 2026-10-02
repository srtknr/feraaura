"use client";

import { useActionState } from "react";
import { saveContent } from "@/lib/actions";
import type { ContentVariant, ContentView } from "@/lib/content";
import { initialActionState } from "@/lib/validators";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { Banner, FieldError } from "@/components/admin/ui";

export function ContentBlockForm({
  label,
  variant,
  content,
}: {
  label: string;
  variant: ContentVariant;
  content: ContentView;
}) {
  const [state, action, pending] = useActionState(saveContent, initialActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 border border-line bg-card p-5">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-serif text-2xl">{label}</h2>
        <span className="text-xs uppercase tracking-wide text-muted">{content.key}</span>
      </div>
      <Banner message={state.ok ? state.message : undefined} />
      <Banner message={state.ok ? undefined : state.message} tone="error" />
      <input type="hidden" name="key" value={content.key} />
      <label className="text-sm text-muted">
        Başlık
        <input name="title" required defaultValue={content.title} className={inputClass} />
        <FieldError message={errors.title} />
      </label>
      <label className="text-sm text-muted">
        Metin
        <textarea name="description" required rows={5} defaultValue={content.description} className={inputClass} />
        <FieldError message={errors.description} />
      </label>
      {variant === "hero" || variant === "story" ? (
        <ImagePicker
          folder="content"
          label="Görsel"
          urlName="imageUrl"
          keyName="imageKey"
          initialUrl={content.imageUrl}
          initialKey={content.imageKey}
        />
      ) : (
        <>
          <input type="hidden" name="imageUrl" value={content.imageUrl ?? ""} />
          <input type="hidden" name="imageKey" value={content.imageKey ?? ""} />
        </>
      )}
      {variant === "hero" ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-muted">
            Birincil düğme
            <input name="primaryButtonText" defaultValue={content.primaryButtonText ?? ""} className={inputClass} />
          </label>
          <label className="text-sm text-muted">
            Birincil bağlantı
            <input name="primaryButtonUrl" defaultValue={content.primaryButtonUrl ?? ""} className={inputClass} />
            <FieldError message={errors.primaryButtonUrl} />
          </label>
          <label className="text-sm text-muted">
            İkincil düğme
            <input name="secondaryButtonText" defaultValue={content.secondaryButtonText ?? ""} className={inputClass} />
          </label>
          <label className="text-sm text-muted">
            İkincil bağlantı
            <input name="secondaryButtonUrl" defaultValue={content.secondaryButtonUrl ?? ""} className={inputClass} />
            <FieldError message={errors.secondaryButtonUrl} />
          </label>
        </div>
      ) : (
        <>
          <input type="hidden" name="primaryButtonText" value="" />
          <input type="hidden" name="primaryButtonUrl" value="" />
          <input type="hidden" name="secondaryButtonText" value="" />
          <input type="hidden" name="secondaryButtonUrl" value="" />
        </>
      )}
      <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-end">
        <label className="text-sm text-muted">
          Sıra
          <input name="displayOrder" type="number" defaultValue={content.displayOrder} className={inputClass} />
          <FieldError message={errors.displayOrder} />
        </label>
        <label className="flex items-center gap-3 pb-3 text-sm">
          <input type="checkbox" name="isVisible" defaultChecked={content.isVisible} className="size-4 accent-[#D96B27]" />
          Görünür
        </label>
      </div>
      {content.key === "featured" || content.key === "categories" || content.key === "brand_story" || content.key === "gallery" ? (
        <p className="text-xs text-muted">Ana sayfada karşılama sabit kalır. Bu blok, sırasına göre diğer bölümlerle dizilir.</p>
      ) : null}
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}

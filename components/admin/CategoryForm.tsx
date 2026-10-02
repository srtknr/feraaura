"use client";

import { useActionState } from "react";
import { deleteCategoryAction, saveCategory } from "@/lib/actions";
import { initialActionState } from "@/lib/validators";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { Banner, ConfirmButton, FieldError } from "@/components/admin/ui";

export type CategoryFormValues = {
  id?: string;
  name: string;
  slug: string;
  description: string;
  displayOrder: number;
  isPublished: boolean;
};

export function CategoryForm({ values }: { values: CategoryFormValues }) {
  const [state, action, pending] = useActionState(saveCategory, initialActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid gap-4 border border-line bg-card p-5">
      <h2 className="font-serif text-2xl">{values.id ? "Kategoriyi düzenle" : "Yeni kategori"}</h2>
      <Banner message={state.message} tone="error" />
      {values.id ? <input type="hidden" name="id" value={values.id} /> : null}
      <label className="text-sm text-muted">
        Ad
        <input name="name" required defaultValue={values.name} className={inputClass} />
        <FieldError message={errors.name} />
      </label>
      <label className="text-sm text-muted">
        Slug
        <input name="slug" defaultValue={values.slug} className={inputClass} placeholder="Boşsa addan üretilir" />
        <FieldError message={errors.slug} />
      </label>
      <label className="text-sm text-muted">
        Açıklama
        <textarea name="description" defaultValue={values.description} rows={3} className={inputClass} />
      </label>
      <label className="text-sm text-muted">
        Sıra
        <input name="displayOrder" type="number" defaultValue={values.displayOrder} className={inputClass} />
        <FieldError message={errors.displayOrder} />
      </label>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="isPublished" defaultChecked={values.isPublished} className="size-4 accent-[#D96B27]" />
        Yayında
      </label>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
}

export function DeleteCategoryButton({ id }: { id: string }) {
  const [state, action] = useActionState(deleteCategoryAction, initialActionState);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {state.message ? <p className="mb-2 text-xs text-red-300">{state.message}</p> : null}
      <ConfirmButton label="Sil" message="Kategori silinsin mi?" className="text-sm text-red-300" />
    </form>
  );
}

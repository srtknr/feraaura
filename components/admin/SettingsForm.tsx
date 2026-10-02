"use client";

import { useActionState } from "react";
import { saveSettingsAction } from "@/lib/actions";
import type { SettingsView } from "@/lib/data/settings";
import { initialActionState } from "@/lib/validators";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { Banner, FieldError } from "@/components/admin/ui";

export function SettingsForm({ settings }: { settings: SettingsView }) {
  const [state, action, pending] = useActionState(saveSettingsAction, initialActionState);
  const errors = state.fieldErrors ?? {};

  return (
    <form action={action} className="grid max-w-2xl gap-5">
      <Banner message={state.ok ? state.message : undefined} />
      <Banner message={!state.ok ? state.message : undefined} tone="error" />
      <label className="text-sm text-muted">
        Marka adı
        <input name="brandName" required defaultValue={settings.brandName} className={inputClass} />
        <FieldError message={errors.brandName} />
      </label>
      <ImagePicker
        folder="settings"
        label="Logo"
        urlName="logoUrl"
        keyName="logoKey"
        initialUrl={settings.logoUrl}
        initialKey={settings.logoKey}
      />
      <label className="text-sm text-muted">
        Instagram
        <input name="instagramUrl" defaultValue={settings.instagramUrl ?? ""} placeholder="https://instagram.com/..." className={inputClass} />
        <FieldError message={errors.instagramUrl} />
      </label>
      <label className="text-sm text-muted">
        E-posta
        <input name="email" type="email" defaultValue={settings.email ?? ""} className={inputClass} />
        <FieldError message={errors.email} />
      </label>
      <label className="text-sm text-muted">
        Telefon
        <input name="phone" defaultValue={settings.phone ?? ""} className={inputClass} />
      </label>
      <label className="text-sm text-muted">
        Adres
        <input name="address" defaultValue={settings.address ?? ""} className={inputClass} />
      </label>
      <label className="text-sm text-muted">
        Alt bilgi
        <textarea name="footerDescription" required rows={4} defaultValue={settings.footerDescription} className={inputClass} />
        <FieldError message={errors.footerDescription} />
      </label>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Kaydediliyor..." : "Ayarları kaydet"}
      </button>
    </form>
  );
}

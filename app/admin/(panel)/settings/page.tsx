import type { Metadata } from "next";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getSettings } from "@/lib/data/settings";

export const metadata: Metadata = { title: "Ayarlar" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="font-serif text-4xl">Ayarlar</h1>
      <p className="mt-2 text-sm text-muted">Marka adı, logo ve alt bilgide görünen iletişim.</p>
      <div className="mt-8">
        <SettingsForm settings={settings} />
      </div>
    </div>
  );
}

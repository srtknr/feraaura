import { prisma } from "@/lib/db";
import type { SettingsInput } from "@/lib/validators";
import { removeStoredImage } from "@/lib/storage";

export type SettingsView = {
  id: string;
  brandName: string;
  logoUrl: string | null;
  logoKey: string | null;
  instagramUrl: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  footerDescription: string;
};

const fallbackSettings: SettingsView = {
  id: "default",
  brandName: "feraaura",
  logoUrl: null,
  logoKey: null,
  instagramUrl: null,
  email: null,
  phone: null,
  address: null,
  footerDescription: "El emeği seramik, tekstil, ahşap ve takı. Küçük atölyeden, yavaş üretilmiş parçalar.",
};

export async function getSettings(): Promise<SettingsView> {
  const settings = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  return settings ?? fallbackSettings;
}

export async function saveSettings(input: SettingsInput) {
  const current = await prisma.siteSettings.findUnique({ where: { id: "default" } });
  if (current?.logoKey && current.logoKey !== input.logoKey) {
    await removeStoredImage(current.logoKey);
  }

  const data = {
    brandName: input.brandName,
    logoUrl: input.logoUrl,
    logoKey: input.logoKey,
    instagramUrl: input.instagramUrl || null,
    email: input.email || null,
    phone: input.phone || null,
    address: input.address || null,
    footerDescription: input.footerDescription,
  };

  return prisma.siteSettings.upsert({
    where: { id: "default" },
    create: { id: "default", ...data },
    update: data,
  });
}

import { z } from "zod";

export type ActionState = {
  ok: boolean;
  message?: string;
  fieldErrors?: Record<string, string>;
  mailto?: string;
  stamp?: number;
};

export const initialActionState: ActionState = { ok: false };

const imageSchema = z.object({
  url: z.string().trim().min(1),
  storageKey: z.string().trim().nullable().optional(),
  alt: z.string().trim().max(180).nullable().optional(),
  displayOrder: z.number().int().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı.").max(120),
  slug: z
    .string()
    .trim()
    .min(2, "Slug en az 2 karakter olmalı.")
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  shortDescription: z
    .string()
    .trim()
    .min(10, "Kısa açıklama en az 10 karakter olmalı.")
    .max(300),
  description: z.string().trim().min(20, "Açıklama en az 20 karakter olmalı.").max(8000),
  price: z.number().min(0, "Fiyat negatif olamaz.").nullable(),
  currency: z
    .string()
    .trim()
    .length(3, "Para birimi 3 harf olmalı.")
    .transform((value) => value.toUpperCase()),
  coverImage: z.string().trim().nullable(),
  coverImageKey: z.string().trim().nullable(),
  categoryId: z.string().trim().min(1, "Kategori seçin."),
  isFeatured: z.boolean(),
  isPublished: z.boolean(),
  displayOrder: z.number().int("Sıra tam sayı olmalı."),
  images: z.array(imageSchema),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2, "Ad en az 2 karakter olmalı.").max(80),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug yalnızca küçük harf, rakam ve tire içerebilir."),
  description: z.string().trim().max(400).nullable(),
  isPublished: z.boolean(),
  displayOrder: z.number().int(),
});

const optionalLink = z
  .string()
  .trim()
  .max(300)
  .refine((value) => value === "" || value.startsWith("/") || /^https?:\/\//.test(value), {
    message: "Bağlantı / ile başlamalı veya tam bir adres olmalı.",
  });

export const contentSchema = z.object({
  key: z.string().trim().min(2).max(40),
  title: z.string().trim().min(2, "Başlık en az 2 karakter olmalı.").max(180),
  description: z.string().trim().min(10, "Metin en az 10 karakter olmalı.").max(8000),
  imageUrl: z.string().trim().nullable(),
  imageKey: z.string().trim().nullable(),
  primaryButtonText: z.string().trim().max(60).nullable(),
  primaryButtonUrl: optionalLink.nullable(),
  secondaryButtonText: z.string().trim().max(60).nullable(),
  secondaryButtonUrl: optionalLink.nullable(),
  isVisible: z.boolean(),
  displayOrder: z.number().int(),
});

export const gallerySchema = z.object({
  url: z.string().trim().min(1, "Görsel gerekli."),
  storageKey: z.string().trim().nullable(),
  alt: z.string().trim().max(180).nullable(),
  caption: z.string().trim().max(180).nullable(),
  displayOrder: z.number().int(),
});

export const settingsSchema = z.object({
  brandName: z.string().trim().min(2, "Marka adı gerekli.").max(80),
  logoUrl: z.string().trim().nullable(),
  logoKey: z.string().trim().nullable(),
  instagramUrl: z
    .string()
    .trim()
    .max(300)
    .refine((value) => value === "" || /^https?:\/\//.test(value), {
      message: "Instagram adresi http ile başlamalı.",
    }),
  email: z
    .string()
    .trim()
    .max(180)
    .refine((value) => value === "" || z.string().email().safeParse(value).success, {
      message: "Geçerli bir e-posta girin.",
    }),
  phone: z.string().trim().max(40),
  address: z.string().trim().max(240),
  footerDescription: z.string().trim().min(10, "Alt bilgi metni çok kısa.").max(600),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Adınızı yazın.").max(80),
  email: z.string().trim().email("Geçerli bir e-posta girin.").max(180),
  message: z.string().trim().min(10, "Mesaj en az 10 karakter olmalı.").max(4000),
  company: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Geçerli bir e-posta girin."),
  password: z.string().min(8, "Şifre en az 8 karakter olmalı."),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ContentInput = z.infer<typeof contentSchema>;
export type GalleryInput = z.infer<typeof gallerySchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && !errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function emptyToNull(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim();
  return text === "" ? null : text;
}

export function readBool(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

export function readNumber(value: FormDataEntryValue | null) {
  const text = String(value ?? "").trim().replace(",", ".");
  if (!text) return null;
  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

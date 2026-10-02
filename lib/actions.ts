"use server";

import { redirect } from "next/navigation";
import { Prisma } from "@prisma/client";
import { createSession, clearSession } from "@/lib/auth/session";
import { verifyPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/db";
import {
  categorySchema,
  contactSchema,
  contentSchema,
  emptyToNull,
  fieldErrors,
  gallerySchema,
  loginSchema,
  productSchema,
  readBool,
  readNumber,
  settingsSchema,
  type ActionState,
  type ProductInput,
} from "@/lib/validators";
import { slugify } from "@/lib/format";
import { createCategory, deleteCategory, updateCategory } from "@/lib/data/categories";
import { upsertContent } from "@/lib/data/content";
import { createGalleryImage, deleteGalleryImage, updateGalleryImage } from "@/lib/data/gallery";
import { createProduct, deleteProduct, setProductFlags, updateProduct } from "@/lib/data/products";
import { getSettings, saveSettings } from "@/lib/data/settings";
import { revalidateSite } from "@/lib/revalidate";

function uniqueSlugMessage(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
    return "Bu slug zaten kullanılıyor.";
  }
  return null;
}

function parseImages(raw: FormDataEntryValue | null) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(String(raw));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return null;
  }
}

function productFromForm(formData: FormData) {
  const name = String(formData.get("name") ?? "");
  const slugValue = String(formData.get("slug") ?? "").trim();
  const price = readNumber(formData.get("price"));
  const displayOrder = readNumber(formData.get("displayOrder"));
  const images = parseImages(formData.get("imagesJson"));

  if (images == null) {
    return { error: { ok: false, message: "Görsel listesi okunamadı." } as ActionState };
  }
  if (price !== null && Number.isNaN(price)) {
    return { error: { ok: false, fieldErrors: { price: "Geçerli bir fiyat girin." } } as ActionState };
  }
  if (displayOrder == null || Number.isNaN(displayOrder)) {
    return { error: { ok: false, fieldErrors: { displayOrder: "Sıra sayı olmalı." } } as ActionState };
  }

  const parsed = productSchema.safeParse({
    name,
    slug: slugify(slugValue || name),
    shortDescription: String(formData.get("shortDescription") ?? ""),
    description: String(formData.get("description") ?? ""),
    price,
    currency: String(formData.get("currency") ?? "TRY"),
    coverImage: emptyToNull(formData.get("coverImage")),
    coverImageKey: emptyToNull(formData.get("coverImageKey")),
    categoryId: String(formData.get("categoryId") ?? ""),
    isFeatured: readBool(formData, "isFeatured"),
    isPublished: readBool(formData, "isPublished"),
    displayOrder,
    images,
  });

  if (!parsed.success) {
    return { error: { ok: false, fieldErrors: fieldErrors(parsed.error) } as ActionState };
  }
  return { data: parsed.data as ProductInput };
}

export async function loginAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = loginSchema.safeParse({
    email: String(formData.get("email") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) {
    return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return { ok: false, message: "E-posta veya şifre hatalı." };
  }

  await createSession(user.id);
  const next = String(formData.get("next") ?? "");
  const target = next.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/dashboard";
  redirect(target);
}

export async function logoutAction() {
  await clearSession();
  redirect("/admin/login");
}

export async function saveProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = productFromForm(formData);
  if ("error" in parsed && parsed.error) return parsed.error;
  const input = parsed.data;
  if (!input) return { ok: false, message: "Form okunamadı." };

  const id = String(formData.get("id") ?? "");
  try {
    if (id) {
      const updated = await updateProduct(id, input);
      if (!updated) return { ok: false, message: "Ürün bulunamadı." };
      revalidateSite([`/products/${updated.slug}`]);
      redirect(`/admin/products/${updated.id}?saved=1`);
    }
    const created = await createProduct(input);
    revalidateSite([`/products/${created.slug}`]);
    redirect(`/admin/products/${created.id}?saved=1`);
  } catch (error) {
    const message = uniqueSlugMessage(error);
    if (message) return { ok: false, fieldErrors: { slug: message } };
    throw error;
  }
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  await deleteProduct(id);
  revalidateSite(existing ? [`/products/${existing.slug}`] : []);
  redirect("/admin/products");
}

export async function toggleProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const field = String(formData.get("field") ?? "");
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) return;
  if (field === "published") {
    await setProductFlags(id, { isPublished: !product.isPublished });
  } else if (field === "featured") {
    await setProductFlags(id, { isFeatured: !product.isFeatured });
  }
  revalidateSite([`/products/${product.slug}`]);
}

export async function saveCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const name = String(formData.get("name") ?? "");
  const slugValue = String(formData.get("slug") ?? "").trim();
  const displayOrder = readNumber(formData.get("displayOrder"));
  if (displayOrder == null || Number.isNaN(displayOrder)) {
    return { ok: false, fieldErrors: { displayOrder: "Sıra sayı olmalı." } };
  }
  const parsed = categorySchema.safeParse({
    name,
    slug: slugify(slugValue || name),
    description: emptyToNull(formData.get("description")),
    isPublished: readBool(formData, "isPublished"),
    displayOrder,
  });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) };

  const id = String(formData.get("id") ?? "");
  try {
    if (id) await updateCategory(id, parsed.data);
    else await createCategory(parsed.data);
  } catch (error) {
    const message = uniqueSlugMessage(error);
    if (message) return { ok: false, fieldErrors: { slug: message } };
    throw error;
  }
  revalidateSite();
  redirect("/admin/categories?saved=1");
}

export async function deleteCategoryAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const id = String(formData.get("id") ?? "");
  try {
    await deleteCategory(id);
  } catch (error) {
    return { ok: false, message: error instanceof Error ? error.message : "Kategori silinemedi." };
  }
  revalidateSite();
  redirect("/admin/categories?saved=1");
}

export async function saveContent(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const displayOrder = readNumber(formData.get("displayOrder"));
  if (displayOrder == null || Number.isNaN(displayOrder)) {
    return { ok: false, fieldErrors: { displayOrder: "Sıra sayı olmalı." } };
  }
  const primaryUrl = String(formData.get("primaryButtonUrl") ?? "").trim();
  const secondaryUrl = String(formData.get("secondaryButtonUrl") ?? "").trim();
  const parsed = contentSchema.safeParse({
    key: String(formData.get("key") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
    imageUrl: emptyToNull(formData.get("imageUrl")),
    imageKey: emptyToNull(formData.get("imageKey")),
    primaryButtonText: emptyToNull(formData.get("primaryButtonText")),
    primaryButtonUrl: primaryUrl === "" ? null : primaryUrl,
    secondaryButtonText: emptyToNull(formData.get("secondaryButtonText")),
    secondaryButtonUrl: secondaryUrl === "" ? null : secondaryUrl,
    isVisible: readBool(formData, "isVisible"),
    displayOrder,
  });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  await upsertContent(parsed.data);
  revalidateSite();
  return { ok: true, message: "İçerik kaydedildi." };
}

export async function addGalleryImage(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const displayOrder = readNumber(formData.get("displayOrder"));
  const parsed = gallerySchema.safeParse({
    url: String(formData.get("url") ?? ""),
    storageKey: emptyToNull(formData.get("storageKey")),
    alt: emptyToNull(formData.get("alt")),
    caption: emptyToNull(formData.get("caption")),
    displayOrder: displayOrder == null || Number.isNaN(displayOrder) ? 0 : displayOrder,
  });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error), message: "Görsel eklenemedi." };
  await createGalleryImage(parsed.data);
  revalidateSite();
  return { ok: true, message: "Görsel eklendi.", stamp: Date.now() };
}

export async function updateGalleryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  const displayOrder = readNumber(formData.get("displayOrder"));
  await updateGalleryImage(id, {
    alt: emptyToNull(formData.get("alt")),
    caption: emptyToNull(formData.get("caption")),
    displayOrder: displayOrder == null || Number.isNaN(displayOrder) ? 0 : displayOrder,
  });
  revalidateSite();
}

export async function deleteGalleryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "");
  await deleteGalleryImage(id);
  revalidateSite();
}

export async function saveSettingsAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = settingsSchema.safeParse({
    brandName: String(formData.get("brandName") ?? ""),
    logoUrl: emptyToNull(formData.get("logoUrl")),
    logoKey: emptyToNull(formData.get("logoKey")),
    instagramUrl: String(formData.get("instagramUrl") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim(),
    phone: String(formData.get("phone") ?? "").trim(),
    address: String(formData.get("address") ?? "").trim(),
    footerDescription: String(formData.get("footerDescription") ?? ""),
  });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  await saveSettings(parsed.data);
  revalidateSite();
  return { ok: true, message: "Ayarlar kaydedildi." };
}

export async function prepareContact(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const parsed = contactSchema.safeParse({
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    message: String(formData.get("message") ?? ""),
    company: String(formData.get("company") ?? ""),
  });
  if (!parsed.success) return { ok: false, fieldErrors: fieldErrors(parsed.error) };
  if (parsed.data.company) return { ok: true, message: "Teşekkürler." };

  const settings = await getSettings();
  if (!settings.email) {
    return { ok: false, message: "Atölye e-postası henüz tanımlanmamış." };
  }
  const subject = encodeURIComponent(`${settings.brandName} — ${parsed.data.name}`);
  const body = encodeURIComponent(`${parsed.data.message}\n\n${parsed.data.name}\n${parsed.data.email}`);
  return {
    ok: true,
    message: "Mesajınız hazır. E-posta uygulamanız açılıyor.",
    mailto: `mailto:${settings.email}?subject=${subject}&body=${body}`,
    stamp: Date.now(),
  };
}

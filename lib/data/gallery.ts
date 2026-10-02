import { prisma } from "@/lib/db";
import type { GalleryInput } from "@/lib/validators";
import { removeStoredImage } from "@/lib/storage";

export async function listGallery() {
  return prisma.galleryImage.findMany({ orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }] });
}

export async function createGalleryImage(input: GalleryInput) {
  return prisma.galleryImage.create({ data: input });
}

export async function updateGalleryImage(id: string, input: Pick<GalleryInput, "alt" | "caption" | "displayOrder">) {
  return prisma.galleryImage.update({ where: { id }, data: input });
}

export async function deleteGalleryImage(id: string) {
  const image = await prisma.galleryImage.findUnique({ where: { id } });
  if (!image) return false;
  await prisma.galleryImage.delete({ where: { id } });
  await removeStoredImage(image.storageKey);
  return true;
}

import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import type { ProductInput } from "@/lib/validators";
import { removeStoredImage } from "@/lib/storage";

export const productInclude = {
  category: true,
  images: { orderBy: { displayOrder: "asc" as const } },
} satisfies Prisma.ProductInclude;

export type ProductWithRelations = Prisma.ProductGetPayload<{ include: typeof productInclude }>;

export function serializeProduct(product: ProductWithRelations) {
  return {
    ...product,
    price: product.price == null ? null : Number(product.price.toString()),
  };
}

function imageData(input: ProductInput) {
  return input.images.map((image, index) => ({
    url: image.url,
    storageKey: image.storageKey ?? null,
    alt: image.alt?.trim() || input.name,
    displayOrder: image.displayOrder ?? index,
  }));
}

export async function listAdminProducts(query?: string, status?: string) {
  const q = query?.trim();
  return prisma.product.findMany({
    where: {
      ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
      ...(status === "published" ? { isPublished: true } : {}),
      ...(status === "draft" ? { isPublished: false } : {}),
      ...(status === "featured" ? { isFeatured: true } : {}),
    },
    include: productInclude,
    orderBy: [{ displayOrder: "asc" }, { updatedAt: "desc" }],
  });
}

export async function listPublishedProducts(categorySlug?: string) {
  return prisma.product.findMany({
    where: {
      isPublished: true,
      ...(categorySlug ? { category: { slug: categorySlug, isPublished: true } } : {}),
    },
    include: productInclude,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
  });
}

export async function listFeaturedProducts() {
  return prisma.product.findMany({
    where: { isPublished: true, isFeatured: true },
    include: productInclude,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
    take: 6,
  });
}

export async function getPublishedProduct(slug: string) {
  return prisma.product.findFirst({
    where: { slug, isPublished: true },
    include: productInclude,
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({ where: { id }, include: productInclude });
}

export async function listRelatedProducts(categoryId: string, productId: string) {
  return prisma.product.findMany({
    where: { categoryId, isPublished: true, NOT: { id: productId } },
    include: productInclude,
    orderBy: { displayOrder: "asc" },
    take: 3,
  });
}

export async function createProduct(input: ProductInput) {
  return prisma.product.create({
    data: {
      name: input.name,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      price: input.price,
      currency: input.currency,
      coverImage: input.coverImage,
      coverImageKey: input.coverImageKey,
      categoryId: input.categoryId,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      displayOrder: input.displayOrder,
      images: { create: imageData(input) },
    },
    include: productInclude,
  });
}

export async function updateProduct(id: string, input: ProductInput) {
  const previous = await prisma.product.findUnique({
    where: { id },
    include: { images: true },
  });
  if (!previous) return null;

  const nextKeys = new Set(input.images.map((image) => image.storageKey).filter(Boolean));
  if (previous.coverImageKey && previous.coverImageKey !== input.coverImageKey) {
    await removeStoredImage(previous.coverImageKey);
  }
  await Promise.all(
    previous.images
      .filter((image) => image.storageKey && !nextKeys.has(image.storageKey))
      .map((image) => removeStoredImage(image.storageKey)),
  );

  return prisma.product.update({
    where: { id },
    data: {
      name: input.name,
      slug: input.slug,
      shortDescription: input.shortDescription,
      description: input.description,
      price: input.price,
      currency: input.currency,
      coverImage: input.coverImage,
      coverImageKey: input.coverImageKey,
      categoryId: input.categoryId,
      isFeatured: input.isFeatured,
      isPublished: input.isPublished,
      displayOrder: input.displayOrder,
      images: {
        deleteMany: {},
        create: imageData(input),
      },
    },
    include: productInclude,
  });
}

export async function deleteProduct(id: string) {
  const product = await prisma.product.findUnique({ where: { id }, include: { images: true } });
  if (!product) return false;
  await prisma.product.delete({ where: { id } });
  await removeStoredImage(product.coverImageKey);
  await Promise.all(product.images.map((image) => removeStoredImage(image.storageKey)));
  return true;
}

export async function setProductFlags(
  id: string,
  flags: Partial<Pick<ProductInput, "isPublished" | "isFeatured" | "displayOrder">>,
) {
  return prisma.product.update({ where: { id }, data: flags });
}

export async function countProductStats() {
  const [total, published, featured] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isPublished: true } }),
    prisma.product.count({ where: { isFeatured: true } }),
  ]);
  return { total, published, featured };
}

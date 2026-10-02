import { prisma } from "@/lib/db";
import type { CategoryInput } from "@/lib/validators";

export async function listCategories(publishedOnly = false) {
  return prisma.category.findMany({
    where: publishedOnly ? { isPublished: true } : undefined,
    orderBy: [{ displayOrder: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({ where: { id } });
}

export async function createCategory(input: CategoryInput) {
  return prisma.category.create({ data: input });
}

export async function updateCategory(id: string, input: CategoryInput) {
  return prisma.category.update({ where: { id }, data: input });
}

export async function deleteCategory(id: string) {
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    throw new Error("Bu kategoride ürün var. Silmeden önce ürünleri başka kategoriye taşıyın.");
  }
  await prisma.category.delete({ where: { id } });
}

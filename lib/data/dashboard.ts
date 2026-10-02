import { prisma } from "@/lib/db";
import { countProductStats } from "@/lib/data/products";

export async function getDashboard() {
  const [stats, categories, recent] = await Promise.all([
    countProductStats(),
    prisma.category.count(),
    prisma.product.findMany({
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { category: true },
    }),
  ]);

  return { ...stats, categories, recent };
}

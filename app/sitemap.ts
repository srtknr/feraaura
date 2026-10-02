import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = ["", "/products", "/about", "/contact"].map((path) => ({
    url: `${site}${path || "/"}`,
    lastModified: new Date(),
  }));

  try {
    const products = await prisma.product.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
    });
    return [
      ...staticRoutes,
      ...products.map((product) => ({
        url: `${site}/products/${product.slug}`,
        lastModified: product.updatedAt,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}

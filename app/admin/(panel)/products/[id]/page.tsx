import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/data/categories";
import { getProductById } from "@/lib/data/products";

export const metadata: Metadata = { title: "Ürünü düzenle" };

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
}) {
  const { id } = await params;
  const { saved } = await searchParams;
  const [product, categories] = await Promise.all([getProductById(id), listCategories()]);
  if (!product) notFound();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-cream">
        Ürünlere dön
      </Link>
      <h1 className="mt-3 font-serif text-4xl">{product.name}</h1>
      <div className="mt-8">
        <ProductForm
          saved={saved === "1"}
          categories={categories.map((category) => ({ id: category.id, name: category.name }))}
          values={{
            id: product.id,
            name: product.name,
            slug: product.slug,
            shortDescription: product.shortDescription,
            description: product.description,
            price: product.price == null ? "" : product.price.toString(),
            currency: product.currency,
            coverImage: product.coverImage,
            coverImageKey: product.coverImageKey,
            categoryId: product.categoryId,
            isFeatured: product.isFeatured,
            isPublished: product.isPublished,
            displayOrder: product.displayOrder,
            images: product.images.map((image) => ({
              url: image.url,
              storageKey: image.storageKey,
              alt: image.alt ?? "",
            })),
          }}
        />
      </div>
    </div>
  );
}

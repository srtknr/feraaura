import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm, type ProductFormValues } from "@/components/admin/ProductForm";
import { listCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Yeni ürün" };

const emptyProduct: ProductFormValues = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  price: "",
  currency: "TRY",
  coverImage: null,
  coverImageKey: null,
  categoryId: "",
  isFeatured: false,
  isPublished: true,
  displayOrder: 0,
  images: [],
};

export default async function NewProductPage() {
  const categories = await listCategories();

  return (
    <div>
      <Link href="/admin/products" className="text-sm text-muted hover:text-cream">
        Ürünlere dön
      </Link>
      <h1 className="mt-3 font-serif text-4xl">Yeni ürün</h1>
      <div className="mt-8">
        <ProductForm values={emptyProduct} categories={categories.map((category) => ({ id: category.id, name: category.name }))} />
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { listCategories } from "@/lib/data/categories";
import { getContentMap } from "@/lib/data/content";
import { listPublishedProducts } from "@/lib/data/products";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentMap();
  return {
    title: content.products_page.title,
    description: content.products_page.description,
  };
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;
  const [content, categories, products] = await Promise.all([
    getContentMap(),
    listCategories(true),
    listPublishedProducts(kategori),
  ]);
  const active = categories.find((category) => category.slug === kategori);

  return (
    <div className="mx-auto max-w-[1600px] px-5 py-14 sm:px-8 lg:px-12 lg:py-20">
      <p className="text-xs uppercase tracking-[0.28em] text-accent">Koleksiyon</p>
      <h1 className="mt-3 font-serif text-5xl text-cream sm:text-6xl">{content.products_page.title}</h1>
      <p className="mt-5 max-w-xl text-base leading-7 text-muted">{content.products_page.description}</p>
      <nav aria-label="Kategori süzgeci" className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-y border-line py-4 text-sm">
        <Link href="/products" aria-current={!kategori ? "page" : undefined} className={!kategori ? "text-accent" : "text-cream hover:text-accent"}>
          Tümü
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?kategori=${category.slug}`}
            aria-current={kategori === category.slug ? "page" : undefined}
            className={kategori === category.slug ? "text-accent" : "text-cream hover:text-accent"}
          >
            {category.name}
          </Link>
        ))}
      </nav>
      {kategori && !active ? (
        <p className="mt-16 text-muted">Bu kategori bulunamadı.</p>
      ) : products.length === 0 ? (
        <p className="mt-16 text-muted">Bu seçkide henüz yayındaki parça yok.</p>
      ) : (
        <>
          <p className="mt-8 text-sm text-muted">{products.length} parça</p>
          <div className="mt-8 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 3} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

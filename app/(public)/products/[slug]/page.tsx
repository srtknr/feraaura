import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { formatPrice } from "@/lib/format";
import { getPublishedProduct, listRelatedProducts } from "@/lib/data/products";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) return { title: "Parça bulunamadı" };
  return {
    title: product.name,
    description: product.shortDescription,
    openGraph: {
      title: product.name,
      description: product.shortDescription,
      images: product.coverImage ? [{ url: product.coverImage }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getPublishedProduct(slug);
  if (!product) notFound();

  const related = await listRelatedProducts(product.categoryId, product.id);
  const price = formatPrice(product.price, product.currency);
  const slides = uniqueSlides([
    product.coverImage ? { url: product.coverImage, alt: product.name } : null,
    ...product.images.map((image) => ({ url: image.url, alt: image.alt || product.name })),
  ]);
  const extraImages = slides.slice(1);
  const paragraphs = product.description.split(/\n+/).filter(Boolean);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    image: slides.map((slide) => slide.url),
    category: product.category.name,
    ...(product.price != null
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: product.currency,
            price: Number(product.price),
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
  };

  return (
    <article className="mx-auto max-w-[1600px] px-5 py-10 sm:px-8 lg:px-12 lg:py-16">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <nav aria-label="Konum" className="mb-8 text-sm text-muted">
        <Link href="/" className="hover:text-accent">
          Ana Sayfa
        </Link>
        <span aria-hidden="true"> / </span>
        <Link href="/products" className="hover:text-accent">
          Ürünler
        </Link>
        <span aria-hidden="true"> / </span>
        <span className="text-cream">{product.name}</span>
      </nav>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)] lg:gap-16">
        <ProductGallery images={slides} />
        <div className="lg:sticky lg:top-28 lg:self-start">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">
            <Link href={`/products?kategori=${product.category.slug}`} className="hover:text-accent-hover">
              {product.category.name}
            </Link>
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">{product.name}</h1>
          <p className="mt-5 text-lg text-cream">{price ?? "Fiyat için yazın"}</p>
          <div className="mt-6 space-y-4 text-base leading-8 text-muted">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Link
            href={`/contact?urun=${product.slug}`}
            className="mt-10 inline-flex bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover"
          >
            Bu parça hakkında sorun
          </Link>
        </div>
      </div>
      {extraImages.length > 0 ? (
        <section className="mt-16 space-y-4" aria-label="Ek görseller">
          {extraImages.map((image) => (
            <figure key={image.url} className="relative aspect-[16/10] bg-card">
              <Image src={image.url} alt={image.alt} fill sizes="100vw" className="object-cover" />
            </figure>
          ))}
        </section>
      ) : null}
      {related.length > 0 ? (
        <section className="mt-20 border-t border-line pt-14">
          <h2 className="font-serif text-3xl text-cream sm:text-4xl">Yakın parçalar</h2>
          <div className="mt-8 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  );
}

function uniqueSlides(slides: ({ url: string; alt: string } | null)[]) {
  const seen = new Set<string>();
  const result: { url: string; alt: string }[] = [];
  for (const slide of slides) {
    if (!slide || seen.has(slide.url)) continue;
    seen.add(slide.url);
    result.push(slide);
  }
  return result;
}

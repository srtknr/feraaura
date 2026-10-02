import Image from "next/image";
import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import type { ProductWithRelations } from "@/lib/data/products";
import type { ContentView } from "@/lib/content";

export function Hero({ content }: { content: ContentView }) {
  if (!content.isVisible) return null;

  return (
    <section className="grid min-h-[calc(100vh-4.75rem)] lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
      <div className="order-2 flex flex-col justify-center px-5 py-16 sm:px-8 lg:order-1 lg:px-14 lg:py-20">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">El yapımı</p>
        <h1 className="mt-6 max-w-xl font-serif text-[2.7rem] leading-[1.02] text-cream sm:text-6xl xl:text-7xl">
          {content.title}
        </h1>
        <p className="mt-6 max-w-md text-base leading-7 text-muted sm:text-lg">{content.description}</p>
        <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
          {content.primaryButtonText && content.primaryButtonUrl ? (
            <Link href={content.primaryButtonUrl} className="bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover">
              {content.primaryButtonText}
            </Link>
          ) : null}
          {content.secondaryButtonText && content.secondaryButtonUrl ? (
            <Link
              href={content.secondaryButtonUrl}
              className="text-sm text-cream underline decoration-accent underline-offset-[10px] transition hover:text-accent"
            >
              {content.secondaryButtonText}
            </Link>
          ) : null}
        </div>
      </div>
      <div className="relative order-1 min-h-[68vh] bg-card lg:order-2 lg:min-h-full">
        {content.imageUrl ? (
          <Image
            src={content.imageUrl}
            alt={content.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 58vw"
            className="object-cover"
          />
        ) : null}
      </div>
    </section>
  );
}

export function FeaturedProducts({
  content,
  products,
}: {
  content: ContentView;
  products: ProductWithRelations[];
}) {
  if (!content.isVisible || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-accent">Seçki</p>
          <h2 className="mt-3 font-serif text-4xl text-cream sm:text-5xl">{content.title}</h2>
        </div>
        <p className="max-w-sm text-sm leading-7 text-muted">{content.description}</p>
      </div>
      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-12">
        {products.map((product, index) => (
          <div key={product.id} className={featuredSpan(index)}>
            <ProductCard product={product} priority={index < 2} large={index === 0} />
          </div>
        ))}
      </div>
      <Link href="/products" className="mt-12 inline-block text-sm text-cream underline decoration-accent underline-offset-[10px] hover:text-accent">
        Tüm parçalar
      </Link>
    </section>
  );
}

function featuredSpan(index: number) {
  if (index === 0) return "sm:col-span-2 lg:col-span-7";
  if (index === 1 || index === 2) return "lg:col-span-5";
  return "lg:col-span-4";
}

export function CategoryIndex({
  content,
  categories,
}: {
  content: ContentView;
  categories: { id: string; name: string; slug: string; description: string | null }[];
}) {
  if (!content.isVisible || categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-8 sm:px-8 lg:px-12 lg:py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-accent">Kategoriler</p>
      <h2 className="mt-3 max-w-xl font-serif text-4xl text-cream sm:text-5xl">{content.title}</h2>
      {content.description ? <p className="mt-4 max-w-lg text-sm leading-7 text-muted">{content.description}</p> : null}
      <ul className="mt-10 border-t border-line">
        {categories.map((category, index) => (
          <li key={category.id} className="border-b border-line">
            <Link href={`/products?kategori=${category.slug}`} className="group flex flex-col gap-2 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:py-7">
              <span className="flex items-baseline gap-5 sm:gap-8">
                <span className="w-8 text-xs text-accent">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-serif text-3xl text-cream transition-colors group-hover:text-accent sm:text-5xl">
                  {category.name}
                </span>
              </span>
              {category.description ? (
                <span className="max-w-sm text-sm leading-6 text-muted sm:text-right">{category.description}</span>
              ) : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function BrandStory({ content }: { content: ContentView }) {
  if (!content.isVisible) return null;
  const paragraphs = content.description.split(/\n+/).filter(Boolean);

  return (
    <section className="mx-auto grid max-w-[1600px] lg:grid-cols-2">
      <div className="relative min-h-[420px] bg-card">
        {content.imageUrl ? (
          <Image src={content.imageUrl} alt={content.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
        ) : null}
      </div>
      <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Atölye</p>
        <h2 className="mt-4 font-serif text-4xl leading-tight text-cream sm:text-5xl">{content.title}</h2>
        <div className="mt-6 space-y-4 text-base leading-8 text-muted">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <Link href="/about" className="mt-8 text-sm text-cream underline decoration-accent underline-offset-[10px] hover:text-accent">
          Hikâyenin devamı
        </Link>
      </div>
    </section>
  );
}

export function HomeGallery({
  content,
  images,
}: {
  content: ContentView;
  images: { id: string; url: string; alt: string | null; caption: string | null }[];
}) {
  if (!content.isVisible || images.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
      <p className="text-xs uppercase tracking-[0.28em] text-accent">Görseller</p>
      <div className="mt-3 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="font-serif text-4xl text-cream sm:text-5xl">{content.title}</h2>
        <p className="max-w-sm text-sm leading-7 text-muted">{content.description}</p>
      </div>
      <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-12 md:gap-4">
        {images.map((image, index) => (
          <figure key={image.id} className={gallerySpan(index)}>
            <div className="relative h-full min-h-[220px] overflow-hidden bg-card md:min-h-[280px]">
              <Image
                src={image.url}
                alt={image.alt || image.caption || "Atölye görseli"}
                fill
                sizes="(max-width: 768px) 50vw, 40vw"
                className="object-cover"
              />
            </div>
            {image.caption ? <figcaption className="mt-2 text-xs leading-5 text-muted">{image.caption}</figcaption> : null}
          </figure>
        ))}
      </div>
    </section>
  );
}

function gallerySpan(index: number) {
  const spans = [
    "col-span-2 md:col-span-7 md:row-span-2",
    "col-span-2 md:col-span-5",
    "col-span-2 md:col-span-5",
    "col-span-2 md:col-span-4",
    "col-span-2 md:col-span-4",
    "col-span-2 md:col-span-4",
  ];
  return spans[index] ?? "col-span-2 md:col-span-4";
}

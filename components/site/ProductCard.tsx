import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { ProductWithRelations } from "@/lib/data/products";

export function ProductCard({
  product,
  priority = false,
  large = false,
}: {
  product: ProductWithRelations;
  priority?: boolean;
  large?: boolean;
}) {
  const price = formatPrice(product.price, product.currency);

  return (
    <article className={large ? "lg:pr-6" : undefined}>
      <Link href={`/products/${product.slug}`} className="group block">
        <div className={`relative overflow-hidden bg-card ${large ? "aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]" : "aspect-[4/5]"}`}>
          {product.coverImage ? (
            <Image
              src={product.coverImage}
              alt={product.name}
              fill
              priority={priority}
              sizes={large ? "(max-width: 1024px) 100vw, 55vw" : "(max-width: 640px) 100vw, 33vw"}
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted">Görsel yok</div>
          )}
        </div>
        <div className="mt-4 flex items-baseline justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{product.category.name}</p>
            <h3 className="mt-1 font-serif text-2xl text-cream transition-colors group-hover:text-accent sm:text-[1.7rem]">
              {product.name}
            </h3>
          </div>
          {price ? <p className="shrink-0 text-sm text-cream">{price}</p> : null}
        </div>
        <p className="mt-2 max-w-md text-sm leading-6 text-muted">{product.shortDescription}</p>
      </Link>
    </article>
  );
}

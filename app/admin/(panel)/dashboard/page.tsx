import type { Metadata } from "next";
import Link from "next/link";
import { getDashboard } from "@/lib/data/dashboard";

export const metadata: Metadata = { title: "Özet" };

export default async function DashboardPage() {
  const stats = await getDashboard();
  const cards = [
    { label: "Ürün", value: stats.total },
    { label: "Yayında", value: stats.published },
    { label: "Kategori", value: stats.categories },
    { label: "Öne çıkan", value: stats.featured },
  ];

  return (
    <div>
      <h1 className="font-serif text-4xl">Özet</h1>
      <p className="mt-2 text-sm text-muted">Atölyedeki içeriklerin kısa görünümü.</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="border border-line bg-card px-5 py-6">
            <p className="text-xs uppercase tracking-[0.18em] text-muted">{card.label}</p>
            <p className="mt-3 font-serif text-4xl">{card.value}</p>
          </article>
        ))}
      </div>
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl">Son ürünler</h2>
          <Link href="/admin/products/new" className="text-sm text-accent hover:text-accent-hover">
            Yeni ürün
          </Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="mt-6 border border-dashed border-line px-4 py-8 text-sm text-muted">Henüz ürün yok.</p>
        ) : (
          <ul className="mt-6 divide-y divide-line border border-line">
            {stats.recent.map((product) => (
              <li key={product.id} className="flex items-center justify-between gap-4 px-4 py-3 text-sm">
                <div>
                  <Link href={`/admin/products/${product.id}`} className="text-cream hover:text-accent">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted">{product.category.name}</p>
                </div>
                <span className="text-xs text-muted">{product.isPublished ? "Yayında" : "Taslak"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

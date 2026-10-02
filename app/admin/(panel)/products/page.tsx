import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { deleteProductAction, toggleProductAction } from "@/lib/actions";
import { ConfirmButton } from "@/components/admin/ui";
import { quietButtonClass } from "@/components/admin/styles";
import { listAdminProducts } from "@/lib/data/products";

export const metadata: Metadata = { title: "Ürünler" };

const filters = [
  { href: "/admin/products", label: "Tümü", status: undefined },
  { href: "/admin/products?status=published", label: "Yayında", status: "published" },
  { href: "/admin/products?status=draft", label: "Taslak", status: "draft" },
  { href: "/admin/products?status=featured", label: "Öne çıkan", status: "featured" },
] as const;

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string }>;
}) {
  const { q = "", status } = await searchParams;
  const products = await listAdminProducts(q, status);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Ürünler</h1>
          <p className="mt-2 text-sm text-muted">{products.length} kayıt</p>
        </div>
        <Link href="/admin/products/new" className="bg-accent px-4 py-2.5 text-sm font-medium text-ink hover:bg-accent-hover">
          Yeni ürün
        </Link>
      </div>
      <form className="mt-6 flex flex-wrap gap-3">
        {status ? <input type="hidden" name="status" value={status} /> : null}
        <label className="sr-only" htmlFor="q">
          Ürün ara
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Ada göre ara"
          className="border border-line bg-ink px-3 py-2.5 text-sm text-cream outline-none focus:border-accent"
        />
        <button className={quietButtonClass}>Ara</button>
      </form>
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        {filters.map((filter) => (
          <Link
            key={filter.label}
            href={filter.href}
            aria-current={status === filter.status || (!status && !filter.status) ? "page" : undefined}
            className={status === filter.status || (!status && !filter.status) ? "text-accent" : "text-muted hover:text-cream"}
          >
            {filter.label}
          </Link>
        ))}
      </div>
      {products.length === 0 ? (
        <p className="mt-8 border border-dashed border-line px-4 py-10 text-sm text-muted">Bu süzgeçte ürün yok.</p>
      ) : (
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-3 py-3 font-medium">Ürün</th>
                <th className="px-3 py-3 font-medium">Kategori</th>
                <th className="px-3 py-3 font-medium">Sıra</th>
                <th className="px-3 py-3 font-medium">Durum</th>
                <th className="px-3 py-3 font-medium">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {products.map((product) => (
                <tr key={product.id}>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-14 w-12 shrink-0 bg-card">
                        {product.coverImage ? (
                          <Image src={product.coverImage} alt="" fill sizes="48px" className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <Link href={`/admin/products/${product.id}`} className="hover:text-accent">
                          {product.name}
                        </Link>
                        <p className="text-xs text-muted">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-muted">{product.category.name}</td>
                  <td className="px-3 py-3">{product.displayOrder}</td>
                  <td className="px-3 py-3 text-muted">
                    {product.isPublished ? "Yayında" : "Taslak"}
                    {product.isFeatured ? " · Öne çıkan" : ""}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Link href={`/admin/products/${product.id}`} className="hover:text-accent">
                        Düzenle
                      </Link>
                      <form action={toggleProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="field" value="published" />
                        <button className="hover:text-accent">{product.isPublished ? "Yayından kaldır" : "Yayınla"}</button>
                      </form>
                      <form action={toggleProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <input type="hidden" name="field" value="featured" />
                        <button className="hover:text-accent">{product.isFeatured ? "Öne çıkandan al" : "Öne çıkar"}</button>
                      </form>
                      <form action={deleteProductAction}>
                        <input type="hidden" name="id" value={product.id} />
                        <ConfirmButton label="Sil" message={`${product.name} silinsin mi?`} className="text-red-300" />
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CategoryForm, DeleteCategoryButton, type CategoryFormValues } from "@/components/admin/CategoryForm";
import { listCategories } from "@/lib/data/categories";

export const metadata: Metadata = { title: "Kategoriler" };

const emptyCategory: CategoryFormValues = {
  name: "",
  slug: "",
  description: "",
  displayOrder: 0,
  isPublished: true,
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; saved?: string }>;
}) {
  const { edit, saved } = await searchParams;
  const categories = await listCategories();
  const editing = categories.find((category) => category.id === edit);

  return (
    <div>
      <h1 className="font-serif text-4xl">Kategoriler</h1>
      <p className="mt-2 text-sm text-muted">Vitrindeki gruplar. Sıra, sitedeki dizilişi belirler.</p>
      {saved === "1" ? <p className="mt-4 border border-accent px-4 py-3 text-sm">Kategori kaydedildi.</p> : null}
      <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <CategoryForm
          values={
            editing
              ? {
                  id: editing.id,
                  name: editing.name,
                  slug: editing.slug,
                  description: editing.description ?? "",
                  displayOrder: editing.displayOrder,
                  isPublished: editing.isPublished,
                }
              : { ...emptyCategory, displayOrder: categories.length }
          }
        />
        {categories.length === 0 ? (
          <p className="border border-dashed border-line px-4 py-10 text-sm text-muted">Henüz kategori yok.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-3 font-medium">Ad</th>
                  <th className="px-3 py-3 font-medium">Sıra</th>
                  <th className="px-3 py-3 font-medium">Ürün</th>
                  <th className="px-3 py-3 font-medium">Durum</th>
                  <th className="px-3 py-3 font-medium">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {categories.map((category) => (
                  <tr key={category.id}>
                    <td className="px-3 py-3">
                      <p>{category.name}</p>
                      <p className="text-xs text-muted">{category.slug}</p>
                    </td>
                    <td className="px-3 py-3">{category.displayOrder}</td>
                    <td className="px-3 py-3">{category._count.products}</td>
                    <td className="px-3 py-3 text-muted">{category.isPublished ? "Yayında" : "Gizli"}</td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-4">
                        <Link href={`/admin/categories?edit=${category.id}`} className="hover:text-accent">
                          Düzenle
                        </Link>
                        <DeleteCategoryButton id={category.id} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

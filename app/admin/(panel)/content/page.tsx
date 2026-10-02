import type { Metadata } from "next";
import { ContentBlockForm } from "@/components/admin/ContentBlockForm";
import { listContent } from "@/lib/data/content";

export const metadata: Metadata = { title: "İçerik" };

export default async function ContentPage() {
  const blocks = await listContent();

  return (
    <div>
      <h1 className="font-serif text-4xl">İçerik</h1>
      <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
        Karşılama, hikâye ve bölüm başlıkları buradan değişir. Kayıttan sonra herkese açık site güncellenir.
      </p>
      <div className="mt-8 grid gap-6">
        {blocks.map((block) => (
          <ContentBlockForm key={block.key} label={block.label} variant={block.variant} content={block.content} />
        ))}
      </div>
    </div>
  );
}

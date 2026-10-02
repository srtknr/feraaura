import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getContentMap } from "@/lib/data/content";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentMap();
  return {
    title: content.about.title,
    description: content.about.description.slice(0, 180),
    openGraph: {
      title: content.about.title,
      description: content.about.description.slice(0, 180),
      images: content.about.imageUrl ? [{ url: content.about.imageUrl }] : undefined,
    },
  };
}

export default async function AboutPage() {
  const content = await getContentMap();
  const story = content.about;
  const paragraphs = story.description.split(/\n+/).filter(Boolean);

  return (
    <article className="mx-auto max-w-[1600px]">
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col justify-end px-5 py-14 sm:px-8 lg:px-12 lg:py-24">
          <p className="text-xs uppercase tracking-[0.28em] text-accent">feraaura</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-cream sm:text-6xl">{story.title}</h1>
        </div>
        <div className="relative min-h-[420px] bg-card">
          {story.imageUrl ? (
            <Image src={story.imageUrl} alt={story.title} fill priority sizes="(max-width: 1024px) 100vw, 55vw" className="object-cover" />
          ) : null}
        </div>
      </div>
      <div className="grid gap-10 px-5 py-16 sm:px-8 lg:grid-cols-[220px_minmax(0,720px)] lg:px-12 lg:py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">Atölye notu</p>
        <div className="space-y-6 text-lg leading-9 text-cream/90">
          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <Link href="/products" className="inline-block pt-4 text-sm text-cream underline decoration-accent underline-offset-[10px] hover:text-accent">
            Parçalara bak
          </Link>
        </div>
      </div>
    </article>
  );
}

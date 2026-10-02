import type { Metadata } from "next";
import { BrandStory, CategoryIndex, FeaturedProducts, Hero, HomeGallery } from "@/components/site/HomeSections";
import { getContentMap } from "@/lib/data/content";
import { listGallery } from "@/lib/data/gallery";
import { listFeaturedProducts } from "@/lib/data/products";
import { listCategories } from "@/lib/data/categories";
import { getSettings } from "@/lib/data/settings";
import { getSiteUrl } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const [settings, content] = await Promise.all([getSettings(), getContentMap()]);
  return {
    title: { absolute: settings.brandName },
    description: content.hero.description,
    openGraph: {
      title: content.hero.title,
      description: content.hero.description,
      images: content.hero.imageUrl ? [{ url: content.hero.imageUrl }] : undefined,
    },
  };
}

export default async function HomePage() {
  const [content, featured, categories, gallery, settings] = await Promise.all([
    getContentMap(),
    listFeaturedProducts(),
    listCategories(true),
    listGallery(),
    getSettings(),
  ]);

  const sections = [
    {
      key: "featured",
      order: content.featured.displayOrder,
      node: <FeaturedProducts content={content.featured} products={featured} />,
    },
    {
      key: "categories",
      order: content.categories.displayOrder,
      node: <CategoryIndex content={content.categories} categories={categories} />,
    },
    {
      key: "brand_story",
      order: content.brand_story.displayOrder,
      node: <BrandStory content={content.brand_story} />,
    },
    {
      key: "gallery",
      order: content.gallery.displayOrder,
      node: <HomeGallery content={content.gallery} images={gallery} />,
    },
  ].sort((a, b) => a.order - b.order);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings.brandName,
    url: getSiteUrl(),
    email: settings.email ?? undefined,
    telephone: settings.phone ?? undefined,
    address: settings.address ?? undefined,
    sameAs: settings.instagramUrl ? [settings.instagramUrl] : undefined,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Hero content={content.hero} />
      {sections.map((section) => (
        <div key={section.key}>{section.node}</div>
      ))}
    </>
  );
}

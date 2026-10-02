import type { HomepageContent } from "@prisma/client";

export const contentDefinitions = [
  { key: "hero", label: "Karşılama", variant: "hero" },
  { key: "featured", label: "Öne çıkanlar", variant: "section" },
  { key: "categories", label: "Kategoriler", variant: "section" },
  { key: "brand_story", label: "Marka hikâyesi", variant: "story" },
  { key: "gallery", label: "Galeri", variant: "section" },
  { key: "about", label: "Hakkımızda sayfası", variant: "story" },
  { key: "products_page", label: "Ürünler sayfası", variant: "section" },
  { key: "contact", label: "İletişim sayfası", variant: "section" },
] as const;

export type ContentKey = (typeof contentDefinitions)[number]["key"];
export type ContentVariant = (typeof contentDefinitions)[number]["variant"];

export type ContentView = {
  key: string;
  title: string;
  description: string;
  imageUrl: string | null;
  imageKey: string | null;
  primaryButtonText: string | null;
  primaryButtonUrl: string | null;
  secondaryButtonText: string | null;
  secondaryButtonUrl: string | null;
  isVisible: boolean;
  displayOrder: number;
};

export const contentFallbacks: Record<ContentKey, ContentView> = {
  hero: {
    key: "hero",
    title: "El emeğinin izini taşıyan parçalar.",
    description: "Her biri özenle hazırlanan, kendine ait bir hikâyeye sahip el işi ürünleri keşfedin.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: "Ürünleri Keşfet",
    primaryButtonUrl: "/products",
    secondaryButtonText: "Hakkımızda",
    secondaryButtonUrl: "/about",
    isVisible: true,
    displayOrder: 0,
  },
  featured: {
    key: "featured",
    title: "Öne Çıkanlar",
    description: "Atölyeden yeni çıkan, tek tek hazırlanmış parçalar.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 1,
  },
  categories: {
    key: "categories",
    title: "Atölyeden",
    description: "Seramik, tekstil, ahşap ve küçük takılar. Hepsi elde, yavaş.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 2,
  },
  brand_story: {
    key: "brand_story",
    title: "Ellerin yavaşladığı yer",
    description:
      "feraaura, küçük bir atölyede doğdu. Seri üretim yok. Her parça tek tek hazırlanır; sırı, dikişi ya da cilası aynı günün ışığını taşır.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 3,
  },
  gallery: {
    key: "gallery",
    title: "Atölyeden kareler",
    description: "Çamur, keten, ahşap ve tezgâhın üstünde kalan izler.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 4,
  },
  about: {
    key: "about",
    title: "Hakkımızda",
    description:
      "feraaura, evde uzun yıllar kalacak parçalar bırakmak için kuruldu. Çok üretmek değil, kullanıldıkça güzelleşen işler yapmak istiyoruz.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 5,
  },
  products_page: {
    key: "products_page",
    title: "Parçalar",
    description: "Atölyede tek tek hazırlanan seramik, tekstil, ahşap ve takılar.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 6,
  },
  contact: {
    key: "contact",
    title: "İletişim",
    description: "Bir parça, bir ölçü ya da atölye ziyareti için yazın. Her mesajı kendimiz okuruz.",
    imageUrl: null,
    imageKey: null,
    primaryButtonText: null,
    primaryButtonUrl: null,
    secondaryButtonText: null,
    secondaryButtonUrl: null,
    isVisible: true,
    displayOrder: 7,
  },
};

export function toContentView(row: HomepageContent): ContentView {
  return {
    key: row.key,
    title: row.title,
    description: row.description,
    imageUrl: row.imageUrl,
    imageKey: row.imageKey,
    primaryButtonText: row.primaryButtonText,
    primaryButtonUrl: row.primaryButtonUrl,
    secondaryButtonText: row.secondaryButtonText,
    secondaryButtonUrl: row.secondaryButtonUrl,
    isVisible: row.isVisible,
    displayOrder: row.displayOrder,
  };
}

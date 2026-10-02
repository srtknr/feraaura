export const primaryNav = [
  { href: "/", label: "Ana Sayfa" },
  { href: "/products", label: "Ürünler" },
  { href: "/about", label: "Hakkımızda" },
  { href: "/contact", label: "İletişim" },
] as const;

export const adminNav = [
  { href: "/admin/dashboard", label: "Özet" },
  { href: "/admin/products", label: "Ürünler" },
  { href: "/admin/categories", label: "Kategoriler" },
  { href: "/admin/content", label: "İçerik" },
  { href: "/admin/gallery", label: "Galeri" },
  { href: "/admin/settings", label: "Ayarlar" },
] as const;

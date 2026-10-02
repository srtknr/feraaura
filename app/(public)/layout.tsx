import type { Metadata } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { getSettings } from "@/lib/data/settings";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: {
      default: settings.brandName,
      template: `%s · ${settings.brandName}`,
    },
    description: settings.footerDescription,
    openGraph: {
      type: "website",
      locale: "tr_TR",
      siteName: settings.brandName,
      title: settings.brandName,
      description: settings.footerDescription,
    },
  };
}

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <>
      <a
        href="#icerik"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        İçeriğe geç
      </a>
      <Header settings={settings} />
      <main id="icerik">{children}</main>
      <Footer settings={settings} />
    </>
  );
}

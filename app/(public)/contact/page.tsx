import type { Metadata } from "next";
import { ContactForm } from "@/components/site/ContactForm";
import { getContentMap } from "@/lib/data/content";
import { getPublishedProduct } from "@/lib/data/products";
import { getSettings } from "@/lib/data/settings";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContentMap();
  return {
    title: content.contact.title,
    description: content.contact.description,
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ urun?: string }>;
}) {
  const { urun } = await searchParams;
  const [content, settings, product] = await Promise.all([
    getContentMap(),
    getSettings(),
    urun ? getPublishedProduct(urun) : Promise.resolve(null),
  ]);

  return (
    <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1fr)] lg:px-12 lg:py-20">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-accent">Yazın</p>
        <h1 className="mt-3 font-serif text-5xl text-cream sm:text-6xl">{content.contact.title}</h1>
        <p className="mt-5 max-w-md text-base leading-7 text-muted">{content.contact.description}</p>
        <address className="mt-10 space-y-3 text-sm not-italic leading-7">
          {settings.address ? <p>{settings.address}</p> : null}
          {settings.email ? (
            <p>
              <a className="underline decoration-accent underline-offset-4 hover:text-accent" href={`mailto:${settings.email}`}>
                {settings.email}
              </a>
            </p>
          ) : null}
          {settings.phone ? (
            <p>
              <a className="hover:text-accent" href={`tel:${settings.phone.replace(/\s/g, "")}`}>
                {settings.phone}
              </a>
            </p>
          ) : null}
          {settings.instagramUrl ? (
            <p>
              <a className="hover:text-accent" href={settings.instagramUrl} target="_blank" rel="noreferrer">
                Instagram
              </a>
            </p>
          ) : null}
        </address>
      </div>
      <ContactForm defaultMessage={product ? `${product.name} hakkında bilgi almak istiyorum.` : ""} />
    </div>
  );
}

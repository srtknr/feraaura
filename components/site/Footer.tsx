import Link from "next/link";
import { primaryNav } from "@/lib/navigation";
import type { SettingsView } from "@/lib/data/settings";

export function Footer({ settings }: { settings: SettingsView }) {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line">
      <div className="mx-auto grid max-w-[1600px] gap-14 px-5 py-16 sm:px-8 md:grid-cols-12 lg:px-12 lg:py-20">
        <div className="md:col-span-5">
          <p className="font-serif text-4xl tracking-tight">{settings.brandName}</p>
          <p className="mt-5 max-w-sm text-sm leading-7 text-muted">{settings.footerDescription}</p>
        </div>
        <nav aria-label="Alt menü" className="md:col-span-3">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Gezinti</p>
          <ul className="mt-5 space-y-3 text-sm">
            {primaryNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-cream transition-colors hover:text-accent">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <p className="text-xs uppercase tracking-[0.22em] text-accent">Atölye</p>
          <address className="mt-5 space-y-3 text-sm not-italic leading-7 text-cream">
            {settings.address ? <p>{settings.address}</p> : null}
            {settings.email ? (
              <p>
                <a className="underline decoration-line underline-offset-4 hover:text-accent" href={`mailto:${settings.email}`}>
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
                <a className="hover:text-accent" href={settings.instagramUrl} rel="noreferrer" target="_blank">
                  Instagram
                </a>
              </p>
            ) : null}
          </address>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 pb-8 text-xs text-muted sm:px-8 lg:px-12">
        <p>
          © {year} {settings.brandName}
        </p>
        <p>El yapımı</p>
      </div>
    </footer>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Mark } from "@/components/site/Mark";
import { MobileNav } from "@/components/site/MobileNav";
import { NavLinks } from "@/components/site/NavLinks";
import { primaryNav } from "@/lib/navigation";
import type { SettingsView } from "@/lib/data/settings";

export function Header({ settings }: { settings: SettingsView }) {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-ink">
      <div className="h-0.5 bg-accent" />
      <div className="mx-auto flex h-[4.5rem] max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-12">
        <Link href="/" className="flex items-center gap-3">
          {settings.logoUrl ? (
            <Image
              src={settings.logoUrl}
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
            />
          ) : (
            <Mark className="h-8 w-8 text-accent" />
          )}
          <span className="font-serif text-[1.7rem] leading-none tracking-tight">{settings.brandName}</span>
        </Link>
        <nav aria-label="Ana menü" className="hidden md:block">
          <NavLinks items={primaryNav} className="flex items-center gap-8 text-sm tracking-wide text-cream" />
        </nav>
        <div className="flex items-center gap-5">
          <Link
            href="/contact"
            className="hidden text-sm text-cream underline decoration-accent underline-offset-[10px] transition-colors hover:text-accent md:inline"
          >
            Atölyeye yaz
          </Link>
          <MobileNav brandName={settings.brandName} />
        </div>
      </div>
    </header>
  );
}

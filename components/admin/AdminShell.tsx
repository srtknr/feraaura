"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/lib/actions";
import { adminNav } from "@/lib/navigation";

export function AdminShell({ children, userName }: { children: React.ReactNode; userName: string }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-ink md:grid md:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="border-b border-line bg-ink-soft md:min-h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between px-5 py-5 md:block">
          <Link href="/admin/dashboard" className="font-serif text-2xl">
            feraaura
          </Link>
          <p className="mt-1 text-xs text-muted">{userName}</p>
        </div>
        <nav aria-label="Yönetim menüsü" className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:px-3 md:pb-8">
          {adminNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`shrink-0 px-3 py-2 text-sm transition-colors ${active ? "bg-card text-accent" : "text-cream hover:text-accent"}`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link href="/" className="shrink-0 px-3 py-2 text-sm text-muted hover:text-cream">
            Siteyi gör
          </Link>
        </nav>
      </aside>
      <div>
        <div className="flex items-center justify-end border-b border-line px-5 py-3">
          <form action={logoutAction}>
            <button type="submit" className="text-sm text-muted hover:text-cream">
              Çıkış
            </button>
          </form>
        </div>
        <div className="px-5 py-8 lg:px-10">{children}</div>
      </div>
    </div>
  );
}

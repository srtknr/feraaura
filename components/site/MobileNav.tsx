"use client";

import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { primaryNav } from "@/lib/navigation";
import { NavLinks } from "@/components/site/NavLinks";

export function MobileNav({ brandName }: { brandName: string }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        className="text-sm tracking-wide text-cream"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen(true)}
      >
        Menü
      </button>
      {open ? (
        <div id={menuId} role="dialog" aria-modal="true" aria-label="Site menüsü" className="fixed inset-0 z-50 flex flex-col bg-ink px-6 pb-10 pt-5">
          <div className="flex items-center justify-between">
            <p className="font-serif text-2xl">{brandName}</p>
            <button type="button" className="text-sm text-cream" onClick={() => setOpen(false)} autoFocus>
              Kapat
            </button>
          </div>
          <NavLinks
            items={primaryNav}
            onNavigate={() => setOpen(false)}
            className="mt-16 flex flex-col gap-6 text-cream"
            linkClassName="font-serif text-4xl"
          />
          <Link
            href="/contact"
            onClick={() => setOpen(false)}
            className="mt-auto inline-flex w-fit bg-accent px-5 py-3 text-sm font-medium text-ink"
          >
            Atölyeye yaz
          </Link>
        </div>
      ) : null}
    </div>
  );
}

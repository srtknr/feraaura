"use client";

export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-lg px-5 py-24">
      <h1 className="font-serif text-4xl">Sayfa açılamadı</h1>
      <p className="mt-4 text-sm leading-7 text-muted">Bağlantı ya da içerik yüklenirken bir sorun oluştu.</p>
      <button type="button" onClick={reset} className="mt-8 bg-accent px-5 py-3 text-sm font-medium text-ink">
        Tekrar dene
      </button>
    </div>
  );
}

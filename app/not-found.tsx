import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-accent">feraaura</p>
      <h1 className="mt-4 font-serif text-5xl">Bu sayfa yok</h1>
      <p className="mt-4 text-sm leading-7 text-muted">Aradığınız parça taşınmış ya da hiç olmamış olabilir.</p>
      <Link href="/" className="mt-8 text-sm text-cream underline decoration-accent underline-offset-[10px]">
        Ana sayfaya dön
      </Link>
    </div>
  );
}

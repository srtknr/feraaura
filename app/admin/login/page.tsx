import type { Metadata } from "next";
import { LoginForm } from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Giriş",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/admin") && !next.startsWith("//") ? next : "/admin/dashboard";

  return (
    <main className="flex min-h-screen items-center justify-center px-5">
      <div className="w-full max-w-md border border-line bg-card px-6 py-8">
        <p className="text-xs uppercase tracking-[0.22em] text-accent">feraaura</p>
        <h1 className="mt-3 font-serif text-4xl">Yönetim girişi</h1>
        <p className="mt-3 text-sm leading-6 text-muted">Atölye içeriğini buradan düzenleyin. Bu sayfa sitede gösterilmez.</p>
        <LoginForm next={safeNext} />
      </div>
    </main>
  );
}

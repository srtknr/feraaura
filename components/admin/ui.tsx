"use client";

import { useFormStatus } from "react-dom";
import { buttonClass } from "@/components/admin/styles";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <span className="mt-1 block text-sm text-red-300" role="alert">
      {message}
    </span>
  );
}

export function Banner({ message, tone = "ok" }: { message?: string; tone?: "ok" | "error" }) {
  if (!message) return null;
  return (
    <p
      role="status"
      className={`border px-4 py-3 text-sm ${tone === "error" ? "border-red-400/50 text-red-200" : "border-accent text-cream"}`}
    >
      {message}
    </p>
  );
}

export function SubmitButton({
  children,
  pendingLabel = "Kaydediliyor...",
  className = buttonClass,
}: {
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending} className={className}>
      {pending ? pendingLabel : children}
    </button>
  );
}

export function ConfirmButton({ label, message, className }: { label: string; message: string; className?: string }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {label}
    </button>
  );
}

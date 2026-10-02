"use client";

import { useActionState } from "react";
import { loginAction } from "@/lib/actions";
import { initialActionState } from "@/lib/validators";
import { buttonClass, inputClass } from "@/components/admin/styles";
import { Banner, FieldError } from "@/components/admin/ui";

export function LoginForm({ next }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialActionState);

  return (
    <form action={action} className="mt-8 space-y-5">
      <input type="hidden" name="next" value={next ?? ""} />
      <Banner message={state.message} tone="error" />
      <label className="block text-sm text-muted">
        E-posta
        <input name="email" type="email" autoComplete="username" required className={inputClass} />
        <FieldError message={state.fieldErrors?.email} />
      </label>
      <label className="block text-sm text-muted">
        Şifre
        <input name="password" type="password" autoComplete="current-password" required className={inputClass} />
        <FieldError message={state.fieldErrors?.password} />
      </label>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}

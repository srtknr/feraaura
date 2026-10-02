"use client";

import { useActionState, useEffect } from "react";
import { prepareContact } from "@/lib/actions";
import { initialActionState } from "@/lib/validators";

const fieldClass =
  "mt-2 w-full border border-line bg-ink-soft px-3 py-3 text-cream outline-none transition focus:border-accent";

export function ContactForm({ defaultMessage = "" }: { defaultMessage?: string }) {
  const [state, action, pending] = useActionState(prepareContact, initialActionState);

  useEffect(() => {
    if (state.mailto) window.location.href = state.mailto;
  }, [state.stamp, state.mailto]);

  return (
    <form action={action} className="space-y-5" noValidate>
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Şirket
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {state.message ? (
        <p role="status" className={`text-sm ${state.ok ? "text-cream" : "text-red-300"}`}>
          {state.message}
        </p>
      ) : null}
      <label className="block text-sm text-muted">
        Ad
        <input name="name" required autoComplete="name" className={fieldClass} />
        {state.fieldErrors?.name ? <span className="mt-1 block text-red-300">{state.fieldErrors.name}</span> : null}
      </label>
      <label className="block text-sm text-muted">
        E-posta
        <input name="email" type="email" required autoComplete="email" className={fieldClass} />
        {state.fieldErrors?.email ? <span className="mt-1 block text-red-300">{state.fieldErrors.email}</span> : null}
      </label>
      <label className="block text-sm text-muted">
        Mesaj
        <textarea name="message" required rows={6} defaultValue={defaultMessage} className={fieldClass} />
        {state.fieldErrors?.message ? (
          <span className="mt-1 block text-red-300">{state.fieldErrors.message}</span>
        ) : null}
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bg-accent px-6 py-3 text-sm font-medium text-ink transition hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? "Hazırlanıyor..." : "Mesajı hazırla"}
      </button>
    </form>
  );
}

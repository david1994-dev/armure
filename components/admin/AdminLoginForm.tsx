"use client";

import { useActionState } from "react";
import { loginAdminAction } from "@/lib/actions/admin-auth";

export function AdminLoginForm() {
  const [state, formAction, isPending] = useActionState(loginAdminAction, null);

  return (
    <form action={formAction} className="mt-8 flex max-w-[22rem] flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="admin-password" className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-ink-faint">
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border border-line-strong bg-surface px-4 py-3 text-base text-ink placeholder:text-ink-faint focus:border-ink focus:outline-none"
        />
      </div>

      {state?.error ? <p className="text-sm text-urgent">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>
    </form>
  );
}

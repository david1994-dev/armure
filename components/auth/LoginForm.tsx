"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  return (
    <form action={formAction} className="mt-8 flex max-w-[26rem] flex-col gap-5">
      <AuthField id="login-username" name="username" label="Username" type="text" autoComplete="username" />
      <AuthField id="login-password" name="password" label="Password" type="password" autoComplete="current-password" />

      {state?.error ? <p className="text-sm text-urgent">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </button>

      <p className="text-sm text-ink-soft">
        New to TeeWorld?{" "}
        <Link href="/register" className="font-semibold text-ink underline-offset-2 hover:text-accent hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}

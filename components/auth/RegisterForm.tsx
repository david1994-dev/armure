"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/lib/actions/auth";
import { AuthField } from "@/components/auth/AuthField";

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  return (
    <form action={formAction} className="mt-8 flex max-w-[26rem] flex-col gap-5">
      <AuthField id="register-username" name="username" label="Username" type="text" autoComplete="username" />
      <AuthField
        id="register-password"
        name="password"
        label="Password"
        type="password"
        autoComplete="new-password"
        minLength={6}
      />
      <AuthField
        id="register-confirm-password"
        name="confirmPassword"
        label="Confirm Password"
        type="password"
        autoComplete="new-password"
        minLength={6}
      />

      {state?.error ? <p className="text-sm text-urgent">{state.error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="mt-2 bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
      >
        {isPending ? "Creating account…" : "Create Account"}
      </button>

      <p className="text-sm text-ink-soft">
        Already have an account?{" "}
        <Link href="/login" className="font-semibold text-ink underline-offset-2 hover:text-accent hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}

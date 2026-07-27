"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthField } from "@/components/auth/AuthField";

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const result = await login(username, password);
    setSubmitting(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.push("/account");
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex max-w-[26rem] flex-col gap-5">
      <AuthField
        id="login-username"
        label="Username"
        type="text"
        value={username}
        onChange={setUsername}
        autoComplete="username"
      />
      <AuthField
        id="login-password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />

      {error ? <p className="text-sm text-urgent">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign In"}
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

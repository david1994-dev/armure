"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/components/auth/AuthProvider";
import { AuthField } from "@/components/auth/AuthField";

export function RegisterForm() {
  const { register } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitting(true);
    const result = await register(username, password);
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
        id="register-username"
        label="Username"
        type="text"
        value={username}
        onChange={setUsername}
        autoComplete="username"
      />
      <AuthField
        id="register-password"
        label="Password"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
        minLength={6}
      />
      <AuthField
        id="register-confirm-password"
        label="Confirm Password"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
        minLength={6}
      />

      {error ? <p className="text-sm text-urgent">{error}</p> : null}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink disabled:opacity-60"
      >
        {submitting ? "Creating account…" : "Create Account"}
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

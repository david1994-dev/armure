"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";

const STORAGE_KEY = "armure-cookie-consent";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let consent: string | null = null;
    try {
      consent = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      // Ignore malformed or inaccessible storage.
    }
    // One-time sync from localStorage on mount, not state derived from
    // props/state — the recommended exception to this rule.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!consent) setVisible(true);
  }, []);

  function respond(value: "accepted" | "declined") {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore malformed or inaccessible storage.
    }
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] w-[100dvw] border-t border-line-strong bg-surface">
      <Container className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="max-w-[60ch] text-sm text-ink-soft">
          We use cookies to keep your cart working and improve ARMURE. See our{" "}
          <Link href="/" className="underline underline-offset-2 hover:text-ink">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="flex shrink-0 gap-3">
          <button
            type="button"
            onClick={() => respond("declined")}
            className="border border-ink bg-transparent px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-ink transition-colors hover:bg-ink hover:text-bg"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => respond("accepted")}
            className="border border-ink bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
          >
            Accept
          </button>
        </div>
      </Container>
    </div>
  );
}

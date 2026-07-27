"use client";

import { useEffect, useState, type FormEvent } from "react";

const STORAGE_KEY = "armure-entry-popup-seen";
const DELAY_MS = 3500;

export function EntryPopup() {
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // Ignore malformed or inaccessible storage.
    }
    if (alreadySeen) return;

    const timer = window.setTimeout(() => setVisible(true), DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore malformed or inaccessible storage.
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // Ignore malformed or inaccessible storage.
    }
    window.setTimeout(() => setVisible(false), 1800);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Get 15% off your first order"
      className="fixed inset-0 z-[70] flex h-[100dvh] w-[100dvw] items-center justify-center bg-ink/60 p-4"
    >
      <div className="relative w-full max-w-[26rem] border border-line-strong bg-surface p-8">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center text-ink-soft transition-colors hover:text-ink"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {submitted ? (
          <p className="pr-6 text-sm text-ink-soft">Thanks — check your inbox for your 15% off code.</p>
        ) : (
          <>
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent">Before you go</p>
            <h2 className="mt-2 font-display text-[1.6rem] font-extrabold uppercase tracking-[-0.01em]">
              Get 15% off your first order
            </h2>
            <p className="mt-2 text-sm text-ink-soft">
              Join the list for early access to new drops, restocks, and subscriber-only pricing.
            </p>
            <form onSubmit={handleSubmit} className="mt-5 flex border border-ink">
              <label className="sr-only" htmlFor="entry-popup-email">
                Email address
              </label>
              <input
                id="entry-popup-email"
                type="email"
                required
                placeholder="Your email"
                className="min-w-0 flex-1 bg-transparent px-[0.9rem] py-3 text-base text-ink placeholder:text-ink-faint"
              />
              <button
                type="submit"
                className="whitespace-nowrap bg-ink px-[1.1rem] text-[0.7rem] font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink"
              >
                Claim 15%
              </button>
            </form>
            <button
              type="button"
              onClick={dismiss}
              className="mt-4 text-[0.78rem] text-ink-faint underline-offset-2 hover:text-ink hover:underline"
            >
              No thanks, I&apos;ll pay full price
            </button>
          </>
        )}
      </div>
    </div>
  );
}

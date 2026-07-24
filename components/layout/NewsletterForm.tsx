"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return <p className="mt-5 max-w-[22rem] text-sm text-ink-soft">Thanks — check your inbox for 10% off.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="mt-5 flex max-w-[22rem] border border-ink">
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        placeholder="Your email"
        required
        className="min-w-0 flex-1 bg-transparent px-[0.9rem] py-3 text-base text-ink placeholder:text-ink-faint"
      />
      <button
        type="submit"
        className="whitespace-nowrap bg-ink px-[1.1rem] text-[0.7rem] font-bold uppercase tracking-[0.08em] text-bg transition-colors hover:bg-accent hover:text-accent-ink"
      >
        Join
      </button>
    </form>
  );
}

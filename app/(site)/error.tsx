"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Container } from "@/components/ui/Container";

interface ErrorPageProps {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: ErrorPageProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="font-mono text-xs uppercase tracking-[0.1em] text-urgent">Error</p>
      <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[-0.01em]">
        Something went wrong
      </h1>
      <p className="mt-3 max-w-md text-sm text-ink-soft">
        An unexpected error occurred loading this page. You can try again, or head back home.
      </p>
      <div className="mt-8 flex gap-4">
        <button
          type="button"
          onClick={() => unstable_retry()}
          className="border border-ink bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-bg transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
        >
          Try again
        </button>
        <Link
          href="/"
          className="border border-ink px-6 py-3.5 text-xs font-bold uppercase tracking-[0.1em] text-ink transition-colors hover:bg-ink hover:text-bg"
        >
          Back to home
        </Link>
      </div>
    </Container>
  );
}

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { UtilityBar } from "@/components/layout/UtilityBar";

// Lives at the app root (not inside (site)/) because only the root not-found.tsx catches
// arbitrary unmatched URLs sitewide — a nested route group's not-found.tsx only fires for an
// explicit notFound() call within that segment's own pages.
export default function NotFound() {
  return (
    <>
      <UtilityBar />
      <SiteHeader />
      <main className="flex-1">
        <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-accent">404</p>
          <h1 className="mt-3 font-display text-3xl font-extrabold uppercase tracking-[-0.01em]">
            Page not found
          </h1>
          <p className="mt-3 max-w-md text-sm text-ink-soft">
            The page you&apos;re looking for doesn&apos;t exist or may have moved.
          </p>
          <Button href="/" className="mt-8">
            Back to home
          </Button>
        </Container>
      </main>
      <SiteFooter />
    </>
  );
}

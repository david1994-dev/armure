import type { Metadata } from "next";
import { AccountView } from "@/components/auth/AccountView";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  ...buildMetadata({
    title: "Your Account",
    description: "View your TeeWorld profile.",
    path: "/account",
  }),
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return (
    <Container className="py-10 lg:py-16">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <h1 className="mt-4 font-display text-[clamp(1.8rem,3.6vw,2.75rem)] font-extrabold uppercase tracking-[-0.01em]">
        Your Account
      </h1>
      <AccountView />
    </Container>
  );
}

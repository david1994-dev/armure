import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { body, display } from "./fonts";
import "./globals.css";
import { CartProvider } from "@/components/cart/CartProvider";
import { TeeIconDefs } from "@/components/ui/TeeIcon";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: "%s | ARMURE",
    default: `${SITE_NAME} — Heavyweight Cotton Tees Built to Last`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#e7e1d2" },
    { media: "(prefers-color-scheme: dark)", color: "#19160f" },
  ],
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  areaServed: "US",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        <TeeIconDefs />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}

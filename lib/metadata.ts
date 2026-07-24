import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/lib/constants";

interface BuildMetadataOptions {
  /** Page-specific title. Runs through the root layout's "%s | ARMURE" template. */
  title: string;
  /** Set when the page should render its own full <title>, bypassing the template (e.g. the homepage). */
  absoluteTitle?: boolean;
  description: string;
  /** Path relative to SITE_URL, e.g. "/", "/shop", "/shop/ridge-tee-clay". */
  path: string;
  image?: string;
}

export function buildMetadata({
  title,
  absoluteTitle = false,
  description,
  path,
  image = "/opengraph-image",
}: BuildMetadataOptions): Metadata {
  const url = new URL(path, SITE_URL).toString();

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale: "en_US",
      type: "website",
      images: [{ url: image }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

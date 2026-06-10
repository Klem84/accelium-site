import type { Metadata } from "next";
import { site } from "@/config/site";

export type Seo = {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
};

export function buildMetadata(seo: Seo, path: string = "/"): Metadata {
  const canonical = seo.canonical || path;
  const url = new URL(canonical, site.url).toString();
  const ogImage = seo.ogImage || "/assets/logo-horizontal-bleu-orange.png";

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical: url },
    robots: seo.noindex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      type: "website",
      locale: "fr_FR",
      url,
      siteName: site.name,
      title: seo.title,
      description: seo.description,
      images: [{ url: new URL(ogImage, site.url).toString() }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [new URL(ogImage, site.url).toString()],
    },
  };
}

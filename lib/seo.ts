import type { Metadata } from "next";
import { site } from "@/config/site";

export type Seo = {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
  /** Titre absolu (accueil) : ignore le template `%s | Accelium` du layout. */
  absoluteTitle?: boolean;
};

/** Image OG par défaut (générée par app/opengraph-image.tsx), utilisée quand la page n'en fournit pas. */
export const defaultOgImage = "/opengraph-image";

export function buildMetadata(seo: Seo, path: string = "/"): Metadata {
  const canonical = seo.canonical || path;
  const url = new URL(canonical, site.url).toString();
  const ogImage = seo.ogImage || defaultOgImage;
  const ogImageUrl = new URL(ogImage, site.url).toString();

  return {
    title: seo.absoluteTitle ? { absolute: seo.title } : seo.title,
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
      images: [{ url: ogImageUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImageUrl],
    },
  };
}

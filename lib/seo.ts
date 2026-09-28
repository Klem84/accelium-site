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

/** Image OG par défaut (générée par scripts/build-og.ts), utilisée quand la page n'en fournit pas. */
export const defaultOgImage = "/og-default.png";

/** Longueur maximale d'un title rendu (suffixe compris), cf. plan V2 §8 axe F. */
const TITLE_MAX = 60;
const SUFFIX = ` | ${site.shortName}`;

/**
 * Titre final : retire un éventuel suffixe « | Accelium… » saisi à la main, puis
 * laisse le layout ajouter « | Accelium » seulement si le total tient dans 60 caractères.
 */
function resolveTitle(seo: Seo): Metadata["title"] {
  const title = seo.title.replace(/\s*\|\s*Accelium.*$/i, "").trim();
  if (seo.absoluteTitle || title.length + SUFFIX.length > TITLE_MAX) return { absolute: title };
  return title;
}

export function buildMetadata(seo: Seo, path: string = "/"): Metadata {
  const canonical = seo.canonical || path;
  const url = new URL(canonical, site.url).toString();
  const ogImage = seo.ogImage || defaultOgImage;
  const ogImageUrl = new URL(ogImage, site.url).toString();

  return {
    title: resolveTitle(seo),
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

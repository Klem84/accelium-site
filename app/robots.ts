import type { MetadataRoute } from "next";
import { site } from "@/config/site";

// Robots explicites (fiche J.1.7) : autorise les agents IA de citation (objectif « site cité par les
// moteurs IA »). Bytespider (TikTok) et CCBot (Common Crawl) sont autorisés par cohérence avec cet objectif.
const IA_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Bytespider",
  "Amazonbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/merci-diagnostic", "/merci-livre-blanc"],
      },
      ...IA_BOTS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/api/"],
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}

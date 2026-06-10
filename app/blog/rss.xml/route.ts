import { getArticles } from "@/lib/content";
import { site } from "@/config/site";

export const dynamic = "force-static";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function GET() {
  const articles = getArticles();
  const items = articles
    .map(
      (a) => `    <item>
      <title>${escape(a.titre)}</title>
      <link>${site.url}/blog/${a.slug}</link>
      <guid>${site.url}/blog/${a.slug}</guid>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <description>${escape(a.excerpt)}</description>
    </item>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Accelium Conseil — Blog</title>
    <link>${site.url}/blog</link>
    <description>Décryptages, actualités et conseils sur les financements publics.</description>
    <language>fr-FR</language>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}

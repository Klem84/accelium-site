import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlogCard } from "@/components/blocks/BlogCard";
import { getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { clusterLabels } from "@/lib/utils";

export const metadata: Metadata = buildMetadata(
  {
    title: "Comprendre les financements publics — le blog | Accelium",
    description:
      "Décryptages, actualités et conseils pour ne rien manquer des aides mobilisables : dispositifs, secteurs, méthode et cas clients.",
  },
  "/blog"
);

export default function BlogHub() {
  const articles = getArticles();
  const clusters = Array.from(new Set(articles.map((a) => a.cluster)));

  return (
    <>
      <PageHero
        kicker="Le blog"
        title="Comprendre les financements publics"
        intro="Décryptages, actualités et conseils pour ne rien manquer des aides mobilisables."
        crumbs={[{ name: "Blog", url: "/blog" }]}
      />
      <section className="wrap py-16 lg:py-24">
        {clusters.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-10">
            <span className="inline-flex rounded-full bg-ink text-white px-4 py-2 text-[0.85rem] font-500">Tous</span>
            {clusters.map((c) => (
              <Link
                key={c}
                href={`/blog/cluster/${c}`}
                className="inline-flex rounded-full border border-line px-4 py-2 text-[0.85rem] font-500 text-ink hover:border-ink focusable"
              >
                {clusterLabels[c] || c}
              </Link>
            ))}
          </div>
        )}
        {articles.length === 0 ? (
          <p className="text-body">Articles en cours de publication. <span className="text-orange700">[à compléter]</span></p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((a) => (
              <BlogCard key={a.slug} article={a} />
            ))}
          </div>
        )}
      </section>
      <CtaBlock />
    </>
  );
}

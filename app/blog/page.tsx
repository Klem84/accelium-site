import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlogExplorer } from "@/components/blocks/BlogExplorer";
import Link from "next/link";
import { getArticles } from "@/lib/content";
import { clusterLabels } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Blog : comprendre les financements publics",
    description:
      "Décryptages des appels à projets ADEME, Bpifrance et Régions, actualité du CIR et du CII, conseils pour financer vos projets. Par les consultants Accelium.",
  },
  "/blog"
);

export default function BlogHub() {
  const articles = getArticles();
  // Rubriques ayant au moins un article : liens rendus côté serveur (crawl sans JS).
  const rubriques = Object.entries(clusterLabels).filter(([slug]) => articles.some((a) => a.cluster === slug));

  return (
    <>
      <PageHero
        kicker="Le blog"
        title="Comprendre les financements publics"
        intro="Décryptages, actualités et conseils pour ne rien manquer des aides mobilisables."
        crumbs={[{ name: "Blog", url: "/blog" }]}
      />
      <nav aria-label="Rubriques du blog" className="wrap pt-12">
        <ul className="flex flex-wrap gap-3">
          {rubriques.map(([slug, label]) => (
            <li key={slug}>
              <Link
                href={`/blog/cluster/${slug}`}
                className="focusable inline-block rounded-full border border-slate px-4 py-2 text-[0.92rem] text-ink hover:bg-sand"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <section className="wrap py-16 lg:py-24">
        <BlogExplorer articles={articles} />
      </section>

      <CtaBlock />
    </>
  );
}

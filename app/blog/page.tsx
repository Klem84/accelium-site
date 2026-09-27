import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlogExplorer } from "@/components/blocks/BlogExplorer";
import { getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Comprendre les financements publics — le blog | Accelium",
    description:
      "Décryptages, actualités et conseils pour ne rien manquer des aides mobilisables : dispositifs, secteurs, méthode, fiches de décryptage et cas clients.",
  },
  "/blog"
);

export default function BlogHub() {
  const articles = getArticles();

  return (
    <>
      <PageHero
        kicker="Le blog"
        title="Comprendre les financements publics"
        intro="Décryptages, actualités et conseils pour ne rien manquer des aides mobilisables."
        crumbs={[{ name: "Blog", url: "/blog" }]}
      />
      <section className="wrap py-16 lg:py-24">
        <BlogExplorer articles={articles} />
      </section>

      <CtaBlock />
    </>
  );
}

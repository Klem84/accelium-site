import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { BlogCard } from "@/components/blocks/BlogCard";
import { getArticles } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { clusterLabels } from "@/lib/utils";

export function generateStaticParams() {
  return Array.from(new Set(getArticles().map((a) => a.cluster))).map((cluster) => ({ cluster }));
}

export function generateMetadata({ params }: { params: { cluster: string } }): Metadata {
  const label = clusterLabels[params.cluster] || params.cluster;
  return buildMetadata(
    {
      title: `${label} : financements publics`,
      description: `Tous nos articles de la catégorie ${label} sur les financements publics des entreprises.`,
    },
    `/blog/cluster/${params.cluster}`
  );
}

export default function ClusterPage({ params }: { params: { cluster: string } }) {
  const articles = getArticles().filter((a) => a.cluster === params.cluster);
  if (articles.length === 0) notFound();
  const label = clusterLabels[params.cluster] || params.cluster;

  return (
    <>
      <PageHero
        kicker="Blog"
        title={label}
        crumbs={[
          { name: "Blog", url: "/blog" },
          { name: label, url: `/blog/cluster/${params.cluster}` },
        ]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {articles.map((a) => (
            <BlogCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
      <CtaBlock />
    </>
  );
}

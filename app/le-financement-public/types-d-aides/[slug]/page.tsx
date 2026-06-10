import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { getPage, getPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PREFIX = "types-d-aides-";

export function generateStaticParams() {
  return getPages()
    .filter((p) => p.slug.startsWith(PREFIX))
    .map((p) => ({ slug: p.slug.replace(PREFIX, "") }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(PREFIX + params.slug);
  if (!p) return {};
  return buildMetadata(p.seo, `/le-financement-public/types-d-aides/${params.slug}`);
}

export default function TypeAidePage({ params }: { params: { slug: string } }) {
  const p = getPage(PREFIX + params.slug);
  if (!p) notFound();
  return (
    <>
      <PageHero
        kicker="Type d'aide"
        title={p.h1}
        intro={p.intro}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: p.titre, url: `/le-financement-public/types-d-aides/${params.slug}` },
        ]}
      />
      <section className="wrap py-16 lg:py-24">
        <div className="max-w-[70ch]">
          <Mdx source={p.body} />
        </div>
      </section>
      <CtaBlock />
    </>
  );
}

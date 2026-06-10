import type { Metadata } from "next";
import { EditorialPage } from "@/components/blocks/EditorialPage";
import { getPages, getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const PREFIX = "cabinet-";

const labels: Record<string, string> = {
  "a-propos": "À propos",
  methodologie: "Méthodologie",
  "nos-atouts": "Nos atouts",
  equipe: "L'équipe",
  partenaires: "Partenaires",
  deontologie: "Déontologie",
};

export function generateStaticParams() {
  return getPages()
    .filter((p) => p.slug.startsWith(PREFIX))
    .map((p) => ({ slug: p.slug.replace(PREFIX, "") }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(PREFIX + params.slug);
  if (!p) return {};
  return buildMetadata(p.seo, `/cabinet/${params.slug}`);
}

export default function CabinetPage({ params }: { params: { slug: string } }) {
  return (
    <EditorialPage
      slug={PREFIX + params.slug}
      kicker="Le cabinet"
      crumbs={[
        { name: "Le cabinet", url: "/cabinet/a-propos" },
        { name: labels[params.slug] || params.slug, url: `/cabinet/${params.slug}` },
      ]}
    />
  );
}

import type { Metadata } from "next";
import { EditorialPage } from "@/components/blocks/EditorialPage";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "politique-de-confidentialite";
export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(
    p?.seo || { title: "Politique de confidentialité", description: "Politique de confidentialité et traitement des données personnelles du site Accelium Conseil." },
    `/${SLUG}`
  );
}
export default function Page() {
  return <EditorialPage slug={SLUG} kicker="Informations légales" crumbs={[{ name: "Politique de confidentialité", url: `/${SLUG}` }]} showCta={false} />;
}

import type { Metadata } from "next";
import { EditorialPage } from "@/components/blocks/EditorialPage";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "cgu";
export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(p?.seo || { title: "CGU", description: "Conditions générales d'utilisation du site Accelium Conseil." }, `/${SLUG}`);
}
export default function Page() {
  return <EditorialPage slug={SLUG} kicker="Informations légales" crumbs={[{ name: "CGU", url: `/${SLUG}` }]} showCta={false} />;
}

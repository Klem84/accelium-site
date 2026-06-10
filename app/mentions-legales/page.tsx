import type { Metadata } from "next";
import { EditorialPage } from "@/components/blocks/EditorialPage";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "mentions-legales";
export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(p?.seo || { title: "Mentions légales | Accelium", description: "Mentions légales du site Accelium Conseil." }, `/${SLUG}`);
}
export default function Page() {
  return <EditorialPage slug={SLUG} kicker="Informations légales" crumbs={[{ name: "Mentions légales", url: `/${SLUG}` }]} showCta={false} />;
}

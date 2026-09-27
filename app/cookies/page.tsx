import type { Metadata } from "next";
import { EditorialPage } from "@/components/blocks/EditorialPage";
import { getPage } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

const SLUG = "cookies";
export function generateMetadata(): Metadata {
  const p = getPage(SLUG);
  return buildMetadata(p?.seo || { title: "Cookies", description: "Gestion des cookies et traceurs du site Accelium Conseil." }, `/${SLUG}`);
}
export default function Page() {
  return <EditorialPage slug={SLUG} kicker="Informations légales" crumbs={[{ name: "Cookies", url: `/${SLUG}` }]} showCta={false} />;
}

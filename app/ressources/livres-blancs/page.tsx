import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { LivresBlancs } from "@/components/ressources/LivresBlancs";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Livres blancs financements publics",
    description:
      "Guides gratuits : CIR/CII, aides forêt-bois, programme des agences de l'eau. Téléchargez nos livres blancs rédigés par les consultants Accelium.",
  },
  "/ressources/livres-blancs"
);

export default function LivresBlancsPage() {
  return (
    <>
      <PageHero
        kicker="Ressources · Livres blancs"
        title="Nos guides à télécharger gratuitement"
        intro="Des référentiels complets pour comprendre les dispositifs et passer à l'action. Renseignez votre email : nous vous envoyons le document immédiatement, directement dans votre boîte mail."
        crumbs={[
          { name: "Ressources", url: "/ressources" },
          { name: "Livres blancs", url: "/ressources/livres-blancs" },
        ]}
      />

      <section id="livres-blancs" className="wrap py-16 lg:py-24">
        <LivresBlancs />
      </section>

      <CtaBlock />
    </>
  );
}

import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { FaqBlock } from "@/components/collections/FaqBlock";
import { getFaqTransversale } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, faqSchema } from "@/lib/schema-org";

export const metadata: Metadata = buildMetadata(
  {
    title: "Questions fréquentes sur le financement public",
    description:
      "Éligibilité, calendrier, cumul des aides, contrôle et méthode Accelium : les réponses aux questions que nous recevons le plus souvent.",
  },
  "/le-financement-public/questions-frequentes"
);

export default function FaqTransversalePage() {
  const { themes } = getFaqTransversale();
  const total = themes.reduce((n, t) => n + t.questions.length, 0);
  const toutes = themes.flatMap((t) => t.questions);

  return (
    <>
      {total > 0 && <JsonLd data={faqSchema(toutes)} />}

      <PageHero
        kicker="Le financement public"
        title="Questions fréquentes"
        intro="Les questions que nous recevons le plus souvent sur l'éligibilité, le calendrier, le cumul des aides et notre méthode."
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Questions fréquentes", url: "/le-financement-public/questions-frequentes" },
        ]}
      />

      <section className="wrap py-16 lg:py-24 max-w-3xl">
        {total === 0 ? (
          <div className="rounded-2xl border border-line bg-cream p-10 text-center">
            <p className="text-body">Cette FAQ transversale est en cours de rédaction. Elle comptera au moins 20 questions.</p>
          </div>
        ) : (
          <div className="space-y-14">
            {themes.map((t) => (
              <FaqBlock key={t.theme} items={t.questions} title={t.theme} withSchema={false} />
            ))}
          </div>
        )}
      </section>

      <CtaBlock />
    </>
  );
}

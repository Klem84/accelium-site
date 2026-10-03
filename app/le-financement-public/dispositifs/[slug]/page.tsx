import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Mdx } from "@/components/Mdx";
import { DispositifTable } from "@/components/collections/DispositifTable";
import { VerifiedBadge } from "@/components/collections/VerifiedBadge";
import { FaqBlock } from "@/components/collections/FaqBlock";
import { SourcesBlock } from "@/components/collections/SourcesBlock";
import { CtaContext } from "@/components/collections/CtaContext";
import { CaseCard } from "@/components/collections/CaseCard";
import { getDispositif, getDispositifs, getFinanceur, getCasClient, getSecteur } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, articleSchema } from "@/lib/schema-org";

// Financeurs cités par les dispositifs mais qui n'ont pas encore de page dédiée
// dans content/financeurs (§6.1 : kicker et tableau d'identité affichent le nom
// sans lien plutôt que de masquer l'information).
const FINANCEUR_LABELS: Record<string, string> = {
  etat: "État",
  "agences-de-l-eau": "Agences de l'eau",
};

export function generateStaticParams() {
  return getDispositifs().map((d) => ({ slug: d.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const d = getDispositif(params.slug);
  if (!d) return {};
  return buildMetadata(d.seo, `/le-financement-public/dispositifs/${d.slug}`);
}

export default function DispositifPage({ params }: { params: { slug: string } }) {
  const d = getDispositif(params.slug);
  if (!d) notFound();

  const financeur = d.financeur ? getFinanceur(d.financeur) : undefined;
  const financeurNom = financeur?.nom || (d.financeur ? FINANCEUR_LABELS[d.financeur] : undefined);
  const casClients = (d.casClients || [])
    .map((slug) => getCasClient(slug))
    .filter((c): c is NonNullable<typeof c> => Boolean(c) && Boolean(c!.montantLabel?.includes("obtenu")))
    .map((c) => {
      const secteur = c!.secteur ? getSecteur(c!.secteur) : undefined;
      return {
        slug: c!.slug,
        montant: c!.montant,
        montantLabel: c!.montantLabel,
        titre: c!.titre,
        contexte: c!.contexte,
        taux: c!.taux,
        delai: c!.delai,
        secteurNom: secteur?.nom,
      };
    });

  return (
    <>
      <JsonLd
        data={articleSchema({
          title: d.seo.title,
          description: d.seo.description,
          url: `/le-financement-public/dispositifs/${d.slug}`,
          datePublished: d.derniereVerification || d.updatedAt || new Date().toISOString(),
          dateModified: d.updatedAt || d.derniereVerification,
          auteur: d.auteur,
        })}
      />

      <PageHero
        kicker={`Dispositif${financeurNom ? ` · ${financeurNom}` : ""}`}
        title={d.h1}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Dispositifs", url: "/le-financement-public/dispositifs" },
          { name: d.nomCourt || d.nom, url: `/le-financement-public/dispositifs/${d.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="max-w-3xl">
          <div className="space-y-8">
            <div>
              <VerifiedBadge derniereVerification={d.derniereVerification} auteur={d.auteur} />
              <p className="lede text-ink leading-relaxed mt-3 measure">{d.definition}</p>
            </div>

            <DispositifTable
              financeur={financeurNom}
              financeurHref={financeur ? `/le-financement-public/financeurs/${financeur.slug}` : undefined}
              beneficiaires={d.beneficiaires}
              depensesEligibles={d.depensesEligibles}
              tauxPlafond={d.tauxPlafond}
              forme={d.forme}
              calendrier={d.calendrier}
              cumul={d.cumul}
              lienOfficiel={d.lienOfficiel}
            />

            {d.body && <Mdx source={d.body} />}

            <div>
              <h2 className="display h-sec font-600 text-ink mb-4">Comment Accelium vous accompagne</h2>
              {d.accompagnement && <p className="text-body leading-relaxed measure mb-6">{d.accompagnement}</p>}
              <CtaContext
                label={`Étudier mon projet ${d.nomCourt || d.nom}`}
                param="dispositif"
                value={d.slug}
              />
            </div>

            {casClients.length > 0 && (
              <div>
                <h2 className="display h-sec font-600 text-ink mb-6">Projets financés</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {casClients.map((c) => (
                    <CaseCard key={c.slug} item={c} />
                  ))}
                </div>
              </div>
            )}

            <div>
              <FaqBlock items={d.faq || []} />
            </div>

            <SourcesBlock sources={d.sources} />
          </div>
        </div>
      </section>

      <RelatedLinks
        related={{
          financeurs: d.financeur ? [d.financeur] : undefined,
          secteurs: d.secteurs,
          offres: d.offres,
          dispositifs: d.dispositifsVoisins,
        }}
        title="Pages liées"
      />
      <CtaBlock />
    </>
  );
}

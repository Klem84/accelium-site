import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { CasGrid, type CasCard } from "@/components/blocks/CasGrid";
import { VerifiedBadge } from "@/components/collections/VerifiedBadge";
import { FaqBlock } from "@/components/collections/FaqBlock";
import { SourcesBlock } from "@/components/collections/SourcesBlock";
import { Mdx } from "@/components/Mdx";
import { getSecteur, getSecteurs, getCasClients, getDispositifs, getRegions } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { estNoindexTemporaire } from "@/config/indexation";

export function generateStaticParams() {
  return getSecteurs().map((s) => ({ slug: s.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const s = getSecteur(params.slug);
  if (!s) return {};
  const noindex = s.seo.noindex || estNoindexTemporaire(`secteurs/${s.slug}`);
  return buildMetadata({ ...s.seo, noindex }, `/secteurs/${s.slug}`);
}

export default function SecteurPage({ params }: { params: { slug: string } }) {
  const s = getSecteur(params.slug);
  if (!s) notFound();

  const dispositifs = getDispositifs();
  const regions = getRegions();

  const cas = getCasClients()
    .filter((c) => c.secteur === s.slug)
    .filter((c) => c.indexable !== false && (c.montantLabel || "").includes("obtenu"))
    .sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  const casItems: CasCard[] = cas.map((c) => ({
    slug: c.slug,
    montant: c.montant,
    titre: c.titre,
    contexte: c.contexte,
  }));

  // Découpe du corps MDX par titre de niveau 2 : chaque section peut recevoir un
  // enrichissement (puces des enjeux, tableau des aides) juste après son H2.
  const sections = s.body.split(/^(?=## )/m);
  const enjeuxSection = sections.find((sec) => /^## Les enjeux/i.test(sec));
  const aidesSection = sections.find((sec) => /^## Les aides/i.test(sec));
  const autresSections = sections.filter((sec) => sec !== enjeuxSection && sec !== aidesSection);

  const regionsActives = (s.regionsActives || [])
    .map((slug) => regions.find((r) => r.slug === slug))
    .filter((r): r is NonNullable<typeof r> => Boolean(r));

  return (
    <>
      <PageHero
        kicker="Secteur"
        title={s.h1}
        intro={s.accroche}
        crumbs={[
          { name: "Secteurs", url: "/secteurs" },
          { name: s.nom, url: `/secteurs/${s.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        <div className="max-w-3xl mx-auto">
          {s.derniereVerification && (
            <div className="mb-8">
              <VerifiedBadge derniereVerification={s.derniereVerification} />
            </div>
          )}

          {enjeuxSection && (
            <div className="">
              <Mdx source={enjeuxSection} />
              {s.enjeux?.length ? (
                <ul className="mt-4 space-y-2 list-disc pl-5 text-body">
                  {s.enjeux.map((e, i) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          {aidesSection && (
            <div className="mt-12">
              <Mdx source={aidesSection} />
              {s.aides?.length ? (
                <div className="mt-6 -mx-4 px-4 sm:mx-0 sm:px-0 overflow-x-auto">
                  <table className="w-full min-w-[640px] sm:min-w-0 border-collapse rounded-2xl overflow-hidden border border-line text-[0.9rem]">
                    <thead>
                      <tr className="bg-cream text-left">
                        <th className="px-4 py-3 font-600 text-ink">Dispositif</th>
                        <th className="px-4 py-3 font-600 text-ink">Pour quoi</th>
                        <th className="px-4 py-3 font-600 text-ink">Taux</th>
                        <th className="px-4 py-3 font-600 text-ink">Calendrier</th>
                      </tr>
                    </thead>
                    <tbody>
                      {s.aides.map((a, i) => {
                        const d = dispositifs.find((x) => x.slug === a.dispositif);
                        return (
                          <tr key={i} className="border-t border-line even:bg-cream/60 align-top">
                            <td className="px-4 py-3">
                              {d ? (
                                <Link
                                  href={`/le-financement-public/dispositifs/${d.slug}`}
                                  className="text-orange700 font-600 focusable"
                                >
                                  {d.nomCourt || d.nom}
                                </Link>
                              ) : (
                                a.dispositif
                              )}
                            </td>
                            <td className="px-4 py-3 text-body">{a.pourquoi}</td>
                            <td className="px-4 py-3 text-body">{a.taux || ""}</td>
                            <td className="px-4 py-3 text-body">{a.calendrier || ""}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : null}
            </div>
          )}

          {autresSections.map((sec, i) => (
            <div key={i} className="mt-12">
              <Mdx source={sec} />
            </div>
          ))}

          {regionsActives.length > 0 && (
            <div className="mt-12">
              <p className="kicker text-orange700 mb-4">Régions actives sur ce secteur</p>
              <div className="flex flex-wrap gap-2">
                {regionsActives.map((r) => (
                  <Link
                    key={r.slug}
                    href={`/regions/${r.slug}`}
                    className="inline-flex items-center rounded-full border border-line px-4 py-2 text-[0.85rem] font-600 text-ink hover:border-ink focusable"
                  >
                    {r.nom}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {casItems.length > 0 && (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16 lg:py-24">
            <h2 className="display h-sec font-600 text-ink mb-8">Projets financés</h2>
            <CasGrid items={casItems} initial={6} step={6} />
          </div>
        </section>
      )}

      <section className="wrap py-16 lg:py-24 max-w-3xl mx-auto">
        <FaqBlock items={s.faq || []} />
      </section>

      <section className="wrap pb-16 max-w-3xl mx-auto">
        <SourcesBlock sources={s.sources} />
      </section>

      <RelatedLinks related={s.related} title="Secteurs proches & ressources" />
      <CtaBlock />
    </>
  );
}

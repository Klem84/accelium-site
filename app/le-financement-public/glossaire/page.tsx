import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { SourcesBlock } from "@/components/collections/SourcesBlock";
import { VerifiedBadge } from "@/components/collections/VerifiedBadge";
import { getGlossaire } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd } from "@/lib/schema-org";
import { site } from "@/config/site";

export function generateMetadata(): Metadata {
  const g = getGlossaire();
  return buildMetadata(
    g.seo || { title: g.titre || g.h1 || "Glossaire du financement public", description: g.intro || "" },
    "/le-financement-public/glossaire"
  );
}

export default function GlossairePage() {
  const g = getGlossaire();
  const { termes } = g;

  const definedTermSet = {
    "@context": "https://schema.org",
    "@type": "DefinedTermSet",
    name: g.titre || "Glossaire du financement public Accelium",
    url: new URL("/le-financement-public/glossaire", site.url).toString(),
    hasDefinedTerm: termes.map((t) => ({
      "@type": "DefinedTerm",
      name: t.terme,
      description: t.definition,
      url: new URL(`/le-financement-public/glossaire#${t.slug}`, site.url).toString(),
    })),
  };

  return (
    <>
      {termes.length > 0 && <JsonLd data={definedTermSet} />}

      <PageHero
        kicker="Le financement public"
        title={g.h1 || "Glossaire du financement public"}
        intro={g.intro || "Les acronymes et notions que vous croiserez sur nos pages, expliqués en une phrase ou deux."}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Glossaire", url: "/le-financement-public/glossaire" },
        ]}
      />

      <section className="wrap py-16 lg:py-24">
        {termes.length === 0 ? (
          <div className="rounded-2xl border border-line bg-cream p-10 text-center max-w-2xl mx-auto">
            <p className="text-body">Le glossaire est en cours de rédaction. Il comptera plus de 40 entrées.</p>
          </div>
        ) : (
          <div className="max-w-3xl">
            {g.derniereVerification && (
              <div className="mb-8">
                <VerifiedBadge derniereVerification={g.derniereVerification} />
              </div>
            )}

            {/* Index alphabétique rapide */}
            <nav aria-label="Index du glossaire" className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-line">
              {termes.map((t) => (
                <a
                  key={t.slug}
                  href={`#${t.slug}`}
                  className="inline-flex rounded-full border border-line px-3 py-1.5 text-[0.82rem] font-500 text-slateD hover:border-ink focusable"
                >
                  {t.terme}
                </a>
              ))}
            </nav>

            <dl className="divide-y divide-line">
              {termes.map((t) => (
                <div key={t.slug} id={t.slug} className="py-6 scroll-mt-28">
                  <dt className="display text-[1.15rem] font-600 text-ink">{t.terme}</dt>
                  <dd className="mt-2 text-body leading-relaxed measure">
                    {t.definition}
                    {t.lien && (
                      <>
                        {" "}
                        <a href={t.lien} className="text-orange700 font-600 focusable">
                          En savoir plus →
                        </a>
                      </>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            {g.sources && g.sources.length > 0 && (
              <div className="mt-10">
                <SourcesBlock sources={g.sources} />
              </div>
            )}
          </div>
        )}
      </section>

      <CtaBlock />
    </>
  );
}

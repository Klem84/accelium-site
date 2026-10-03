import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { VerifiedBadge } from "@/components/collections/VerifiedBadge";
import { FaqBlock } from "@/components/collections/FaqBlock";
import { SourcesBlock } from "@/components/collections/SourcesBlock";
import { CtaContext } from "@/components/collections/CtaContext";
import { getFinanceur, getFinanceurs, getDispositifs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { IconEurope, IconEtat, IconRegion } from "@/components/blocks/Icons";

const echelonIcons = {
  europe: IconEurope,
  etat: IconEtat,
  region: IconRegion,
};

export function generateStaticParams() {
  return getFinanceurs().map((f) => ({ slug: f.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const f = getFinanceur(params.slug);
  if (!f) return {};
  return buildMetadata(f.seo, `/le-financement-public/financeurs/${f.slug}`);
}

export default function FinanceurPage({ params }: { params: { slug: string } }) {
  const f = getFinanceur(params.slug);
  if (!f) notFound();

  const EchelonIcon = f.echelonIcon ? echelonIcons[f.echelonIcon] : undefined;
  const dispositifs = getDispositifs().filter((d) => f.dispositifs?.includes(d.slug));
  const autres = getFinanceurs().filter((x) => x.slug !== f.slug);

  return (
    <>
      <PageHero
        kicker="Financeur"
        title={f.h1}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Financeurs", url: "/le-financement-public/financeurs" },
          { name: f.nom, url: `/le-financement-public/financeurs/${f.slug}` },
        ]}
      />

      {f.definition && (
        <section className="bg-cream border-b border-line">
          <div className="wrap py-10 lg:py-12">
            <p className="lede text-ink measure">{f.definition}</p>
            {f.derniereVerification && (
              <div className="mt-5">
                <VerifiedBadge derniereVerification={f.derniereVerification} auteur={f.auteur} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* ===== FICHE D'IDENTITÉ ===== */}
      {(f.echelon || f.pourQui || f.interventions?.length) && (
        <section className="border-b border-line">
          <div className="wrap py-10 lg:py-12">
            <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
              {f.echelon && (
                <div className="md:col-span-3 flex items-center gap-4 rounded-2xl bg-surface border border-line p-6">
                  {EchelonIcon && (
                    <span className="inline-flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-ink text-white">
                      <EchelonIcon className="w-6 h-6" />
                    </span>
                  )}
                  <div>
                    <p className="kicker text-orange700 text-[0.68rem]">Échelon</p>
                    <p className="display text-[1.25rem] font-600 text-ink leading-tight">{f.echelon}</p>
                    {f.echelonNote && <p className="text-[0.78rem] text-body mt-0.5">{f.echelonNote}</p>}
                  </div>
                </div>
              )}

              {f.pourQui && (
                <div className="md:col-span-5 rounded-2xl bg-surface border border-line p-6">
                  <p className="kicker text-orange700 text-[0.68rem] mb-2">Pour qui</p>
                  <p className="text-[0.95rem] text-body leading-relaxed">{f.pourQui}</p>
                </div>
              )}

              {f.interventions?.length ? (
                <div className="md:col-span-4 rounded-2xl bg-surface border border-line p-6">
                  <p className="kicker text-orange700 text-[0.68rem] mb-3">Modes d'intervention</p>
                  <ul className="flex flex-wrap gap-2">
                    {f.interventions.map((i) => (
                      <li
                        key={i}
                        className="inline-flex rounded-full bg-cream border border-line px-3 py-1 text-[0.8rem] font-500 text-slateD"
                      >
                        {i}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      )}

      {/* ===== CORPS MDX + ASIDE ===== */}
      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <Mdx source={f.body} />
          </div>

          <aside className="lg:col-span-5 lg:sticky lg:top-28 self-start space-y-4">
            {f.siteOfficiel && (
              <div className="rounded-2xl border border-line bg-surface p-7">
                <p className="kicker text-orange700 mb-3">Site officiel</p>
                <p className="text-[0.9rem] text-body mb-4">
                  Les dispositifs et appels à projets en cours sont publiés sur le site de {f.nom}.
                </p>
                <a
                  href={f.siteOfficiel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 display text-[1.02rem] font-600 text-ink hover:text-orange700 focusable break-all"
                >
                  {f.siteOfficiel.replace(/^https?:\/\//, "")} ↗
                </a>
              </div>
            )}
            <CtaContext
              label="Obtenir mon diagnostic"
              param="objet"
              value={f.slug}
              text={`Gratuit, sans engagement. Nous identifions les dispositifs ${f.nom} mobilisables pour vos projets.`}
            />
          </aside>
        </div>
      </section>

      {/* ===== DISPOSITIFS LIÉS ===== */}
      {dispositifs.length > 0 && (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16 lg:py-20">
            <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink mb-8">
              Dispositifs {f.nom}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {dispositifs.map((d) => (
                <Link
                  key={d.slug}
                  href={`/le-financement-public/dispositifs/${d.slug}`}
                  className="group flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
                >
                  <p className="display text-[1.1rem] font-600 text-ink group-hover:text-orange700 transition-colors">
                    {d.nomCourt || d.nom}
                  </p>
                  {d.definition && <p className="mt-2 text-[0.88rem] text-body">{d.definition}</p>}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="wrap py-16 lg:py-24">
        <FaqBlock items={f.faq || []} />
      </section>

      <section className="wrap pb-16">
        <SourcesBlock sources={f.sources} />
      </section>

      {/* ===== AUTRES FINANCEURS ===== */}
      <section className="bg-ink text-white">
        <div className="wrap py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <h2 className="display h-sec font-600 max-w-[18ch]">Les autres financeurs</h2>
            <Link
              href="/le-financement-public/financeurs"
              className="btn-ghost-d focusable rounded-full px-6 py-3 text-[0.92rem]"
            >
              Tous les financeurs
            </Link>
          </div>
          <div className="flex flex-wrap gap-3">
            {autres.map((x) => (
              <Link
                key={x.slug}
                href={`/le-financement-public/financeurs/${x.slug}`}
                className="inline-flex rounded-full border border-white/20 px-5 py-2.5 text-[0.95rem] font-500 text-white hover:bg-white/10 hover:border-white/40 focusable transition-colors"
              >
                {x.nom}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <CtaBlock />
    </>
  );
}

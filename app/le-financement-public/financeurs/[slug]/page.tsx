import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getFinanceur, getFinanceurs, getSecteur } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { financeursData } from "@/lib/financeursData";
import { IconEurope, IconEtat, IconRegion, IconLayers, IconCheck } from "@/components/blocks/Icons";

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
  const data = financeursData[params.slug];
  if (!f || !data) notFound();

  const EchelonIcon = echelonIcons[data.echelonIcon];
  const secteurs = (f.related?.secteurs || [])
    .map((s) => getSecteur(s))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
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

      {/* ===== FICHE D'IDENTITÉ ===== */}
      <section className="bg-cream border-b border-line">
        <div className="wrap py-10 lg:py-12">
          <div className="grid md:grid-cols-12 gap-6 lg:gap-8 items-stretch">
            {/* Échelon */}
            <div className="md:col-span-3 flex items-center gap-4 rounded-2xl bg-surface border border-line p-6">
              <span className="inline-flex shrink-0 items-center justify-center w-12 h-12 rounded-xl bg-ink text-white">
                <EchelonIcon className="w-6 h-6" />
              </span>
              <div>
                <p className="kicker text-orange700 text-[0.68rem]">Échelon</p>
                <p className="display text-[1.25rem] font-600 text-ink leading-tight">{data.echelon}</p>
                <p className="text-[0.78rem] text-body mt-0.5">{data.echelonNote}</p>
              </div>
            </div>

            {/* Pour qui */}
            <div className="md:col-span-5 rounded-2xl bg-surface border border-line p-6">
              <p className="kicker text-orange700 text-[0.68rem] mb-2">Pour qui</p>
              <p className="text-[0.95rem] text-body leading-relaxed">{data.pourQui}</p>
            </div>

            {/* Modes d'intervention */}
            <div className="md:col-span-4 rounded-2xl bg-surface border border-line p-6">
              <p className="kicker text-orange700 text-[0.68rem] mb-3">Modes d'intervention</p>
              <ul className="flex flex-wrap gap-2">
                {data.interventions.map((i) => (
                  <li
                    key={i}
                    className="inline-flex rounded-full bg-cream border border-line px-3 py-1 text-[0.8rem] font-500 text-slateD"
                  >
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== DESCRIPTION + ASIDE ===== */}
      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
          <div className="lg:col-span-7">
            <p className="kicker text-orange700 mb-4">Le financeur</p>
            <div className="space-y-5">
              {data.description.map((para, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "lede text-ink leading-relaxed"
                      : "text-[1rem] text-body leading-relaxed"
                  }
                >
                  {para}
                </p>
              ))}
            </div>
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
            <div className="rounded-2xl bg-ink text-white p-7">
              <p className="display text-[1.2rem] font-600 leading-snug">
                Vos aides {f.nom} en un diagnostic.
              </p>
              <p className="mt-2 text-[0.9rem] text-white/70">
                Gratuit, sans engagement. Nous identifions les dispositifs mobilisables pour vos projets.
              </p>
              <Link
                href="/contact"
                className="btn-primary focusable rounded-full px-6 py-3 text-[0.92rem] mt-5 inline-flex"
              >
                Obtenir mon diagnostic
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ===== DISPOSITIFS PHARES ===== */}
      <section className="bg-cream border-y border-line">
        <div className="wrap py-16 lg:py-20">
          <div className="flex items-center gap-3 mb-8">
            <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface border border-line text-orange700">
              <IconLayers className="w-5 h-5" />
            </span>
            <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink">Dispositifs phares</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.dispositifs.map((d) => (
              <div
                key={d}
                className="flex items-start gap-3 rounded-2xl bg-surface border border-line p-5"
              >
                <span className="mt-0.5 inline-flex shrink-0 w-6 h-6 items-center justify-center rounded-full bg-orange/10 text-orange700">
                  <IconCheck className="w-3.5 h-3.5" />
                </span>
                <span className="text-[0.96rem] font-500 text-ink leading-snug">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTEURS CONCERNÉS ===== */}
      {secteurs.length > 0 && (
        <section className="wrap py-16 lg:py-20">
          <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink mb-2">
            Secteurs souvent concernés
          </h2>
          <p className="text-body mb-8">Là où {f.nom} intervient le plus auprès de nos clients.</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {secteurs.map((s) => (
              <Link
                key={s.slug}
                href={`/secteurs/${s.slug}`}
                className="group relative rounded-xl overflow-hidden aspect-[16/9] photo focusable border border-line"
              >
                {s.image ? (
                  <img src={s.image} alt={s.nom} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-ink" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
                <span className="absolute left-4 bottom-3 text-white font-600 display text-[1.05rem]">
                  {s.nom}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

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

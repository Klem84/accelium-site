import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Accordion } from "@/components/ui/Accordion";
import { Mdx } from "@/components/Mdx";
import { Button } from "@/components/ui/Button";
import { getOffre, getOffres } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, serviceSchema, faqSchema } from "@/lib/schema-org";
import { site } from "@/config/site";

export function generateStaticParams() {
  return getOffres().map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const o = getOffre(params.slug);
  if (!o) return {};
  return buildMetadata(o.seo, `/offres/${o.slug}`);
}

export default function OffrePage({ params }: { params: { slug: string } }) {
  const o = getOffre(params.slug);
  if (!o) notFound();

  const cta = o.cta || site.cta;
  const schemas: object[] = [
    serviceSchema({ name: o.h1, description: o.seo.description, url: `/offres/${o.slug}` }),
  ];
  if (o.faq?.length) schemas.push(faqSchema(o.faq));

  return (
    <>
      <JsonLd data={schemas} />
      <PageHero
        kicker="Offre"
        title={o.h1}
        intro={o.accroche}
        crumbs={[
          { name: "Nos offres", url: "/offres" },
          { name: o.nomCourt, url: `/offres/${o.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {o.cible && (
            <div className="mb-10 rounded-2xl bg-cream border border-line p-6">
              <p className="kicker text-orange700 mb-2">Pour qui</p>
              <p className="text-body">{o.cible}</p>
            </div>
          )}
          <Mdx source={o.body} />

          {o.tableau && (
            <div className="mt-10 overflow-x-auto">
              <table className="w-full text-left border-collapse text-[0.95rem]">
                <thead>
                  <tr className="border-b-2 border-ink">
                    {o.tableau.entete.map((h) => (
                      <th key={h} className="py-3 pr-4 display font-600 text-ink">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {o.tableau.lignes.map((row, ri) => (
                    <tr key={ri} className="border-b border-line">
                      {row.map((cell, ci) => (
                        <td key={ci} className="py-3 pr-4 align-top text-body">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {o.niveaux?.length ? (
            <div className="mt-12">
              <h2 className="display h-sec font-600 text-ink mb-6">Nos niveaux d'intervention</h2>
              <div className="space-y-4">
                {o.niveaux.map((n, i) => (
                  <div key={i} className="rounded-2xl border border-line bg-surface p-6">
                    <h3 className="display text-[1.25rem] font-600 text-ink">{n.nom}</h3>
                    {n.pourQui && <p className="mt-1 text-[0.85rem] text-slate font-500">{n.pourQui}</p>}
                    <p className="mt-2 text-body">{n.description}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {o.faq?.length ? (
            <div className="mt-12">
              <h2 className="display h-sec font-600 text-ink mb-6">Questions fréquentes</h2>
              <Accordion items={o.faq} />
            </div>
          ) : null}
        </div>

        <aside className="lg:col-span-4 space-y-8">
          {o.benefices?.length ? (
            <div className="rounded-2xl bg-ink text-white p-7">
              <p className="kicker text-orange2 mb-4">Ce que vous y gagnez</p>
              <ul className="space-y-3 text-[0.95rem] text-white/85">
                {o.benefices.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-orange2">→</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {o.pourquoi?.length ? (
            <div className="rounded-2xl border border-line p-7">
              <p className="kicker text-orange700 mb-4">Pourquoi Accelium</p>
              <ul className="space-y-3 text-[0.95rem] text-body">
                {o.pourquoi.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-orange">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          <div className="rounded-2xl bg-cream border border-line p-7">
            <p className="display text-[1.2rem] font-600 text-ink">Un projet à financer ?</p>
            <p className="mt-2 text-[0.92rem] text-body">Le premier diagnostic est gratuit et sans engagement.</p>
            <div className="mt-5">
              <Button href={cta.href} variant="primary" className="!px-6 !py-3 text-[0.95rem]">
                {cta.label}
              </Button>
            </div>
          </div>
        </aside>
      </section>

      <RelatedLinks related={o.related} />
      <CtaBlock />
    </>
  );
}

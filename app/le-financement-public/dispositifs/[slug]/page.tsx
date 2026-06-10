import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Accordion } from "@/components/ui/Accordion";
import { Mdx } from "@/components/Mdx";
import { getDispositif, getDispositifs, getFinanceur } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, faqSchema } from "@/lib/schema-org";

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

  const enBref = d.enBref
    ? [
        { k: "Pour qui", v: d.enBref.pourQui },
        { k: "Finance", v: d.enBref.finance },
        { k: "Combien", v: d.enBref.combien },
        { k: "Quand", v: d.enBref.quand },
      ]
    : [];

  return (
    <>
      {d.faq?.length ? <JsonLd data={faqSchema(d.faq)} /> : null}
      <PageHero
        kicker={d.annee ? `Dispositif · ${d.annee}` : "Dispositif"}
        title={d.h1}
        intro={d.definition}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Dispositifs", url: "/le-financement-public/dispositifs" },
          { name: d.nom, url: `/le-financement-public/dispositifs/${d.slug}` },
        ]}
      />

      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          {enBref.length > 0 && (
            <div className="mb-10 rounded-2xl bg-ink text-white p-7">
              <p className="kicker text-orange2 mb-5">L'essentiel en bref</p>
              <dl className="grid sm:grid-cols-2 gap-5">
                {enBref.map((it) => (
                  <div key={it.k}>
                    <dt className="text-[0.78rem] uppercase tracking-wider text-white/45 font-600">{it.k}</dt>
                    <dd className="mt-1 text-[0.95rem] text-white/85">{it.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          <Mdx source={d.body} />

          {d.faq?.length ? (
            <div className="mt-12">
              <h2 className="display h-sec font-600 text-ink mb-6">Questions fréquentes</h2>
              <Accordion items={d.faq} />
            </div>
          ) : null}

          {d.sources?.length ? (
            <p className="mt-10 text-[0.8rem] text-slate">
              Sources : {d.sources.join(" ; ")}.
              {d.derniereVerification && ` Dernière vérification : ${d.derniereVerification}.`}
            </p>
          ) : null}
        </div>

        <aside className="lg:col-span-4 space-y-6">
          {financeur && (
            <div className="rounded-2xl border border-line p-7">
              <p className="kicker text-orange700 mb-2">Financeur</p>
              <Link href={`/le-financement-public/financeurs/${financeur.slug}`} className="display text-[1.2rem] font-600 text-ink hover:text-orange700 focusable">
                {financeur.nom} →
              </Link>
            </div>
          )}
          <div className="rounded-2xl bg-cream border border-line p-7">
            <p className="display text-[1.15rem] font-600 text-ink">Comment Accelium vous aide</p>
            <p className="mt-2 text-[0.92rem] text-body">
              Nous qualifions votre éligibilité, montons le dossier et le sécurisons jusqu'au versement — prêt à
              affronter un contrôle.
            </p>
          </div>
        </aside>
      </section>

      <RelatedLinks related={d.related} />
      <CtaBlock />
    </>
  );
}

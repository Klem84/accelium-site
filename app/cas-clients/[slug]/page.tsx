import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { Mdx } from "@/components/Mdx";
import { getCasClient, getCasClients, getSecteur, getDispositif } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export function generateStaticParams() {
  return getCasClients().map((c) => ({ slug: c.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const c = getCasClient(params.slug);
  if (!c) return {};
  return buildMetadata(
    c.seo || { title: `Cas client ${c.montant} | Accelium`, description: c.contexte },
    `/cas-clients/${c.slug}`
  );
}

export default function CasClientPage({ params }: { params: { slug: string } }) {
  const c = getCasClient(params.slug);
  if (!c) notFound();
  const secteur = getSecteur(c.secteur);
  const dispositif = c.dispositif ? getDispositif(c.dispositif) : undefined;

  return (
    <>
      <PageHero
        kicker={secteur?.nom || "Cas client"}
        title={`${c.montant} ${c.titre}`}
        crumbs={[
          { name: "Cas clients", url: "/cas-clients" },
          { name: c.montant, url: `/cas-clients/${c.slug}` },
        ]}
      />
      <section className="wrap py-16 lg:py-24 grid lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8">
          <h2 className="display text-[1.4rem] font-600 text-ink">Contexte</h2>
          <p className="mt-3 text-body lede">{c.contexte}</p>
          {c.resultat && (
            <>
              <h2 className="display text-[1.4rem] font-600 text-ink mt-10">Résultat</h2>
              <p className="mt-3 text-body lede">{c.resultat}</p>
            </>
          )}
          {c.body && (
            <div className="mt-8">
              <Mdx source={c.body} />
            </div>
          )}
        </div>
        <aside className="lg:col-span-4 space-y-4">
          <div className="rounded-2xl bg-ink text-white p-7">
            <p className="display text-[2.4rem] font-600 leading-none">{c.montant}</p>
            <p className="mt-2 text-white/70 text-[0.9rem]">d'aide obtenue</p>
          </div>
          <div className="rounded-2xl border border-line p-7 space-y-3 text-[0.92rem]">
            {secteur && (
              <p>
                <span className="text-slate">Secteur :</span>{" "}
                <Link href={`/secteurs/${secteur.slug}`} className="text-orange700 font-600 focusable">{secteur.nom}</Link>
              </p>
            )}
            {dispositif && (
              <p>
                <span className="text-slate">Dispositif :</span>{" "}
                <Link href={`/le-financement-public/dispositifs/${dispositif.slug}`} className="text-orange700 font-600 focusable">{dispositif.nom}</Link>
              </p>
            )}
            {c.anonymise && <p className="text-[0.8rem] text-slate">Client anonymisé à sa demande.</p>}
          </div>
        </aside>
      </section>
      <CtaBlock />
    </>
  );
}

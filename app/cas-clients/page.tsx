import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getCasClients, getSecteurs } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Cas clients & références | Accelium",
    description:
      "Découvrez des projets financés grâce à Accelium : montants obtenus, secteurs, dispositifs mobilisés. Clients anonymisés.",
  },
  "/cas-clients"
);

export default function CasClientsHub() {
  const cas = getCasClients();
  const secteurs = getSecteurs();
  const nomSecteur = (slug: string) => secteurs.find((s) => s.slug === slug)?.nom || slug;

  return (
    <>
      <PageHero
        kicker="Résultats"
        title="Des résultats concrets"
        intro="Derrière chaque accompagnement, un projet financé — montants d'aide obtenus, clients anonymisés."
        crumbs={[{ name: "Cas clients", url: "/cas-clients" }]}
      />
      <section className="wrap py-16 lg:py-24">
        {cas.length === 0 ? (
          <p className="text-body">Nos références sont en cours de publication. <span className="text-orange700">[à compléter]</span></p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {cas.map((c) => (
              <Link
                key={c.slug}
                href={`/cas-clients/${c.slug}`}
                className="group rounded-2xl overflow-hidden border border-line bg-surface shadow-soft block"
              >
                {c.image && (
                  <div className="photo aspect-[16/10]">
                    <img src={c.image} alt={nomSecteur(c.secteur)} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="p-7">
                  <span className="inline-flex text-[0.72rem] font-600 tracking-wide uppercase text-orange700 bg-orange/10 rounded-full px-3 py-1">
                    {nomSecteur(c.secteur)}
                  </span>
                  <p className="display text-[2.2rem] font-600 text-ink mt-4 leading-none">{c.montant}</p>
                  <p className="mt-1 text-[0.82rem] font-600 text-slateD">{c.titre}</p>
                  <p className="mt-2 text-[0.95rem] text-body">{c.contexte}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
      <CtaBlock />
    </>
  );
}

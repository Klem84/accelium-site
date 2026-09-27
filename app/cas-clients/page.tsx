import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { CasGrid, type CasCard } from "@/components/blocks/CasGrid";
import { getCasClients, getSecteurs } from "@/lib/content";
import { visuelCas } from "@/config/cas-clients-visuels";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Cas clients & références | Accelium",
    description:
      "Découvrez des projets accompagnés par Accelium : montants d'aide mobilisés, secteurs, dispositifs. Clients anonymisés.",
  },
  "/cas-clients"
);

export default function CasClientsHub() {
  const secteurs = getSecteurs();
  const nomSecteur = (slug: string) => secteurs.find((s) => s.slug === slug)?.nom || slug;

  // Fiches « soignées » mises en avant en tête, puis le reste entrelacé par
  // secteur (round-robin) pour éviter qu'un secteur (ex. biomasse) ne forme un
  // bloc de cartes identiques.
  const tous = getCasClients();
  const featured = tous.filter((c) => c.featured);
  const reste = tous.filter((c) => !c.featured);

  const parSecteur = new Map<string, typeof reste>();
  for (const c of reste) {
    const arr = parSecteur.get(c.secteur) ?? [];
    arr.push(c);
    parSecteur.set(c.secteur, arr);
  }
  // Les plus gros secteurs en premier dans la rotation : ils se diluent mieux.
  const files = [...parSecteur.values()].sort((a, b) => b.length - a.length);
  const entrelace: typeof reste = [];
  for (let added = true; added; ) {
    added = false;
    for (const file of files) {
      const c = file.shift();
      if (c) {
        entrelace.push(c);
        added = true;
      }
    }
  }
  const cas = [...featured, ...entrelace];

  // Compteur par secteur pour faire tourner les visuels du pool.
  const compteur = new Map<string, number>();
  const items: CasCard[] = cas.map((c) => {
    const i = compteur.get(c.secteur) ?? 0;
    compteur.set(c.secteur, i + 1);
    return {
      slug: c.slug,
      montant: c.montant,
      titre: c.titre,
      contexte: c.contexte,
      secteurNom: nomSecteur(c.secteur),
      image: visuelCas(c.secteur, i, c.image),
    };
  });

  return (
    <>
      <PageHero
        kicker="Résultats"
        title="Des résultats concrets"
        intro="Derrière chaque accompagnement, un projet financé. Montants d'aide mobilisés, clients anonymisés."
        crumbs={[{ name: "Cas clients", url: "/cas-clients" }]}
      />
      <section className="wrap py-16 lg:py-24">
        {items.length === 0 ? (
          <p className="text-body">Nos références sont en cours de publication. <span className="text-orange700">[à compléter]</span></p>
        ) : (
          <>
            <p className="text-body mb-8">
              {items.length} dossiers de financement accompagnés par Accelium, tous secteurs confondus.
            </p>
            <CasGrid items={items} withImage initial={12} step={12} />
          </>
        )}
      </section>
      <CtaBlock />
    </>
  );
}

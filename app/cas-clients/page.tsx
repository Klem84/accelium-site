import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { CasGrid, type CasCard } from "@/components/blocks/CasGrid";
import { getCasClients, getSecteurs, getRegions } from "@/lib/content";
import { visuelCas } from "@/config/cas-clients-visuels";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Cas clients : projets financés par secteur",
    description:
      "Scieries, chaufferies biomasse, friches industrielles, ports : les projets financés avec Accelium, montants d'aides obtenues et financeurs mobilisés.",
  },
  "/cas-clients"
);

export default function CasClientsHub() {
  const secteurs = getSecteurs();
  const regions = getRegions();
  const nomSecteur = (slug: string) => secteurs.find((s) => s.slug === slug)?.nom || slug;
  const nomRegion = (slug?: string) => (slug && regions.find((r) => r.slug === slug)?.nom) || "";

  // §5.6.2 : seules les fiches indexables sont montrées en cartes (avec lien) ;
  // les fiches non indexables restent visibles, mais uniquement dans le tableau
  // récapitulatif ci-dessous, sans lien vers leur fiche.
  const tousIndexables = getCasClients().filter((c) => c.indexable !== false);
  const nonIndexables = getCasClients().filter((c) => c.indexable === false);

  // Fiches « soignées » mises en avant en tête, puis le reste entrelacé par
  // secteur (round-robin) pour éviter qu'un secteur (ex. biomasse) ne forme un
  // bloc de cartes identiques.
  const tous = tousIndexables;
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

      {nonIndexables.length > 0 && (
        <section className="bg-cream border-t border-line">
          <div className="wrap py-16 lg:py-20">
            <h2 className="display h-sec font-600 text-ink mb-3">Autres projets accompagnés</h2>
            <p className="text-body mb-8 measure">
              D'autres dossiers, encore en cours ou dont la fiche détaillée n'est pas publiée, complètent ce
              panorama.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse rounded-2xl overflow-hidden border border-line text-[0.9rem]">
                <thead>
                  <tr className="bg-surface text-left">
                    <th className="px-4 py-3 font-600 text-ink">Secteur</th>
                    <th className="px-4 py-3 font-600 text-ink">Projet</th>
                    <th className="px-4 py-3 font-600 text-ink">Financeur</th>
                    <th className="px-4 py-3 font-600 text-ink">Montant</th>
                    <th className="px-4 py-3 font-600 text-ink">Région</th>
                  </tr>
                </thead>
                <tbody>
                  {nonIndexables.map((c, i) => (
                    <tr key={c.slug || i} className="border-t border-line even:bg-surface/60 align-top">
                      <td className="px-4 py-3 text-body">{nomSecteur(c.secteur)}</td>
                      <td className="px-4 py-3 text-body">{c.titre}</td>
                      <td className="px-4 py-3 text-body">{c.financeurNom || ""}</td>
                      <td className="px-4 py-3 text-body font-600 text-ink">{c.montant}</td>
                      <td className="px-4 py-3 text-body">{nomRegion(c.region)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}
      <CtaBlock />
    </>
  );
}

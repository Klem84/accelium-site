import type { Metadata } from "next";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RegionMap } from "@/components/collections/RegionMap";
import { getRegions } from "@/lib/content";
import { REGIONS } from "@/lib/regionsData";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Financements publics par région",
    description:
      "Les financeurs et dispositifs régionaux mobilisables par les entreprises dans chacune des 13 régions de France métropolitaine et en Corse.",
  },
  "/regions"
);

export default function RegionsHub() {
  const regions = getRegions();
  const items = REGIONS.map((r) => {
    const fiche = regions.find((x) => x.slug === r.slug);
    return {
      slug: r.slug,
      actif: Boolean(fiche),
      nbDispositifs: fiche?.dispositifsRegionaux?.length,
    };
  });

  return (
    <>
      <PageHero
        kicker="Régions"
        title="Financements publics par région"
        intro="Chaque région a ses propres dispositifs, en plus des aides nationales. Cliquez sur une région pour voir ses financeurs et ses aides."
        crumbs={[{ name: "Régions", url: "/regions" }]}
      />

      <section className="wrap py-16 lg:py-24">
        {regions.length === 0 && (
          <div className="rounded-2xl border border-line bg-cream p-8 text-center max-w-2xl mx-auto mb-12">
            <p className="text-body">
              Les fiches régionales sont en cours de vérification. La carte ci-dessous sera activée région par
              région au fil de leur publication.
            </p>
          </div>
        )}

        <RegionMap items={items} />

        {regions.length > 0 && (
          <ul className="mt-14 divide-y divide-line border-y border-line max-w-2xl mx-auto">
            {regions.map((r) => (
              <li key={r.slug} className="flex items-center justify-between py-4">
                <a href={`/regions/${r.slug}`} className="text-ink font-500 hover:text-orange700 focusable">
                  {r.nom}
                </a>
                <span className="text-[0.82rem] text-slate">
                  {(r.dispositifsRegionaux?.length || 0)} dispositif
                  {(r.dispositifsRegionaux?.length || 0) === 1 ? "" : "s"} régional
                  {(r.dispositifsRegionaux?.length || 0) === 1 ? "" : "aux"}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <CtaBlock />
    </>
  );
}

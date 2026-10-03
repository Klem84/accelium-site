import Link from "next/link";
import { REGIONS } from "@/lib/regionsData";

export type RegionMapItem = { slug: string; actif: boolean; nbDispositifs?: number };

const CELL = 78;
const GAP = 8;
const SIZE = CELL - GAP;

/**
 * Carte de France simplifiée (métropole + Corse, 13 régions), en cartogramme :
 * chaque région est une case positionnée approximativement comme sur une carte
 * réelle plutôt qu'un tracé fidèle des frontières (« un tracé simplifié mais
 * reconnaissable », §6.8). Chaque case cliquable mène à /regions/[slug] si la
 * région a une fiche publiée ; sinon elle reste visible mais non cliquable avec la
 * mention "Bientôt". Liste de secours accessible juste après pour les lecteurs
 * d'écran ou si le SVG ne charge pas.
 */
export function RegionMap({ items }: { items: RegionMapItem[] }) {
  const byslug = new Map(items.map((i) => [i.slug, i]));
  const maxCol = Math.max(...REGIONS.map((r) => r.col)) + 1;
  const maxRow = Math.max(...REGIONS.map((r) => r.row)) + 1;
  const width = maxCol * CELL;
  const height = maxRow * CELL;

  return (
    <div>
      {/*
        Le SVG est destiné à la souris uniquement : aria-hidden et liens non
        focalisables (tabIndex -1). Le parcours clavier et lecteur d'écran passe
        par la liste ci-dessous (13 liens), qui porte aussi les compteurs : un
        nombre en 10 px sur une case teintée n'atteint pas 4,5:1, donc les
        compteurs ne sont jamais rendus dans le SVG (§4.5 de la spec A8).
      */}
      <svg
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
        className="w-full max-w-[560px] mx-auto"
      >
        {REGIONS.map((r) => {
          const info = byslug.get(r.slug);
          const actif = Boolean(info?.actif);
          const x = r.col * CELL;
          const y = r.row * CELL;
          const cell = (
            <g key={r.slug}>
              <rect
                x={x}
                y={y}
                width={SIZE}
                height={SIZE}
                rx={12}
                className={
                  actif
                    ? "fill-surface stroke-line transition-colors group-hover:fill-orange/30 group-hover:stroke-orange700 group-focus-visible:fill-orange/30 group-focus-visible:stroke-orange700"
                    : "fill-cream stroke-line"
                }
                strokeWidth={1.5}
              />
              <text
                x={x + SIZE / 2}
                y={y + SIZE / 2}
                textAnchor="middle"
                dominantBaseline="middle"
                className={actif ? "fill-ink" : "fill-slate"}
                style={{ font: "600 13px 'Clash Display', system-ui, sans-serif" }}
              >
                {r.code}
              </text>
            </g>
          );

          if (!actif) {
            return (
              <g key={r.slug}>
                {cell}
              </g>
            );
          }

          return (
            <a key={r.slug} href={`/regions/${r.slug}`} tabIndex={-1} className="group" data-region={r.slug}>
              {cell}
            </a>
          );
        })}
      </svg>

      {/* Parcours clavier et lecteur d'écran : liste des 13 régions. */}
      <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[0.9rem]">
        {REGIONS.map((r) => {
          const info = byslug.get(r.slug);
          const actif = Boolean(info?.actif);
          return (
            <li key={r.slug}>
              {actif ? (
                <Link
                  href={`/regions/${r.slug}`}
                  data-region={r.slug}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2.5 hover:border-ink transition-colors focusable"
                >
                  <span className="text-ink font-600">{r.nom}</span>
                  {typeof info?.nbDispositifs === "number" ? (
                    <span className="text-slateD">{info.nbDispositifs} projets</span>
                  ) : (
                    <span aria-hidden="true" className="text-orange700">
                      →
                    </span>
                  )}
                </Link>
              ) : (
                <Link
                  href={`/contact?region=${encodeURIComponent(r.slug)}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2.5 hover:border-ink transition-colors focusable"
                >
                  <span className="text-ink font-600">{r.nom}</span>
                  <span className="text-slateD">Nous consulter</span>
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

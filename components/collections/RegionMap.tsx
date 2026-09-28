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
      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Carte de France par région, cliquable"
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
                    ? "fill-surface stroke-line transition-colors group-hover:fill-orange/15 group-focus-visible:fill-orange/15"
                    : "fill-cream stroke-line"
                }
                strokeWidth={1.5}
              />
              <text
                x={x + SIZE / 2}
                y={y + SIZE / 2 - 4}
                textAnchor="middle"
                className={actif ? "fill-ink" : "fill-slate"}
                style={{ font: "600 13px 'Clash Display', system-ui, sans-serif" }}
              >
                {r.code}
              </text>
              {actif && typeof info?.nbDispositifs === "number" && (
                <text
                  x={x + SIZE / 2}
                  y={y + SIZE / 2 + 14}
                  textAnchor="middle"
                  className="fill-orange700"
                  style={{ font: "600 10px system-ui, sans-serif" }}
                >
                  {info.nbDispositifs}
                </text>
              )}
            </g>
          );

          if (!actif) {
            return (
              <g key={r.slug} aria-hidden="true">
                {cell}
              </g>
            );
          }

          return (
            <a key={r.slug} href={`/regions/${r.slug}`} aria-label={r.nom} className="group focusable">
              {cell}
            </a>
          );
        })}
      </svg>

      {/* Liste de secours, toujours accessible (lecteurs d'écran, SVG non chargé). */}
      <ul className="mt-8 grid grid-cols-2 sm:grid-cols-3 gap-2 text-[0.88rem]">
        {REGIONS.map((r) => {
          const info = byslug.get(r.slug);
          const actif = Boolean(info?.actif);
          return (
            <li key={r.slug}>
              {actif ? (
                <Link
                  href={`/regions/${r.slug}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 hover:border-ink transition-colors focusable"
                >
                  <span className="text-ink font-500">{r.nom}</span>
                  <span className="text-orange">→</span>
                </Link>
              ) : (
                <span className="flex items-center justify-between gap-2 rounded-lg border border-line px-3 py-2 text-slate">
                  <span>{r.nom}</span>
                  <span className="text-[0.72rem]">Bientôt</span>
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

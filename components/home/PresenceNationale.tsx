import Link from "next/link";
import { RegionMap } from "@/components/collections/RegionMap";
import { REGIONS } from "@/lib/regionsData";
import { getRegions } from "@/lib/content";
import { chiffres } from "@/config/chiffres";

/**
 * Section « Présence nationale » de l'accueil (plan V2 §5.1, spec A8 §4.5).
 * Remplace l'ancien bandeau photo (Lyon). Trois chiffres calculés au build,
 * rendus côté serveur avec leur valeur finale (mécanisme data-count de
 * MotionProvider) : régions clientes (config/chiffres.ts), dispositifs régionaux
 * documentés et pages « aides par région » (content/regions).
 */
export function PresenceNationale() {
  const regions = getRegions();
  const items = REGIONS.map((r) => ({
    slug: r.slug,
    actif: regions.some((x) => x.slug === r.slug),
  }));

  const nbRegionsClientes = chiffres.regionsClientes?.length ?? 0;
  const nbDispositifsRegionaux = regions.reduce((s, r) => s + (r.dispositifsRegionaux?.length ?? 0), 0);
  const nbPagesRegions = regions.length;

  const stats = [
    { n: nbRegionsClientes, label: "régions où nous accompagnons des clients" },
    { n: nbDispositifsRegionaux, label: "dispositifs régionaux documentés et sourcés" },
    { n: nbPagesRegions, label: "fiches « aides par région » en ligne" },
  ].filter((s) => s.n > 0);

  return (
    <section id="presence-nationale" className="border-b border-line">
      <div className="wrap py-24 lg:py-32 grid lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        <div className="lg:col-span-5 order-2 lg:order-1 rounded-2xl bg-cream p-6 lg:p-8">
          <RegionMap items={items} />
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2">
          <p className="kicker text-orange700 mb-5 reveal">Une présence nationale</p>
          <h2 className="display h-sec font-600 text-ink max-w-[20ch] reveal">
            Partout en France, nous mobilisons les financeurs de votre territoire
          </h2>
          <p className="lede text-body mt-6 measure reveal">
            Chaque région a ses propres dispositifs, qui s'ajoutent aux aides nationales et européennes. Nous
            les suivons région par région, avec la même méthode, où que soit votre site.
          </p>

          {stats.length > 0 && (
            <div data-stagger className="mt-10 grid sm:grid-cols-3 gap-8 border-t border-line pt-8">
              {stats.map((s) => (
                <p key={s.label}>
                  <span className="block display text-[clamp(2.4rem,1.8rem_+_1.6vw,3.2rem)] font-600 text-ink leading-none">
                    <span data-count={s.n}>{s.n}</span>
                  </span>
                  <span className="block mt-2 text-[0.9rem] text-body">{s.label}</span>
                </p>
              ))}
            </div>
          )}

          <Link
            href="/regions"
            className="mt-10 inline-flex items-center gap-2 text-orange700 font-600 focusable group"
          >
            Voir les aides par région
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

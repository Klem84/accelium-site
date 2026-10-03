import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { RelatedLinks } from "@/components/blocks/RelatedLinks";
import { Accordion } from "@/components/ui/Accordion";
import { Mdx } from "@/components/Mdx";
import { Button } from "@/components/ui/Button";
import { getOffre, getOffres, getCasClients } from "@/lib/content";
import { CasGrid, type CasCard } from "@/components/blocks/CasGrid";
import { buildMetadata } from "@/lib/seo";
import { JsonLd, serviceSchema, faqSchema } from "@/lib/schema-org";
import { site } from "@/config/site";
import { IconCheck, IconLever } from "@/components/blocks/Icons";

export function generateStaticParams() {
  return getOffres().map((o) => ({ slug: o.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const o = getOffre(params.slug);
  if (!o) return {};
  return buildMetadata(o.seo, `/offres/${o.slug}`);
}

/* Retire les éventuels marqueurs de travail (à compléter, à valider) du contenu. */
function cleanBody(body: string): string {
  const kept = body.split("\n").filter((l) => !/À (COMPLÉTER|VALIDER)/.test(l));
  return kept
    .join("\n")
    .replace(/(\n\s*---\s*)+\s*$/g, "")
    .trim();
}
function cleanText(s: string): string {
  return s.replace(/\s*\[À (COMPLÉTER|VALIDER)[^\]]*\]/g, "").trim();
}
/* "Niveau 3 : Titre" -> { n: "3", titre: "Titre" } */
function parseNiveau(nom: string): { n?: string; titre: string } {
  const m = nom.match(/^Niveau\s+(\d+)\s*[:-]\s*(.+)$/i);
  if (m) return { n: m[1], titre: m[2].trim() };
  return { titre: nom };
}

export default function OffrePage({ params }: { params: { slug: string } }) {
  const o = getOffre(params.slug);
  if (!o) notFound();

  const cta = o.cta || site.cta;
  const body = cleanBody(o.body || "");
  const autres = getOffres().filter((x) => x.slug !== o.slug);

  // Le tableau (frontmatter) doit s'afficher avant la section "## Sources" du
  // corps MDX : on isole cette dernière pour l'insérer après le tableau.
  const [mainBody, sourcesSection] = (() => {
    const parts = body.split(/\n(?=## Sources)/);
    return [parts[0], parts[1] ? `## Sources${parts[1]}` : undefined];
  })();

  const cas = getCasClients()
    .filter((c) => c.indexable !== false && (c.montantLabel || "").includes("obtenu"))
    .filter(
      (c) =>
        (o.related?.dispositifs?.length && c.dispositif && o.related.dispositifs.includes(c.dispositif)) ||
        (o.related?.secteurs?.length && o.related.secteurs.includes(c.secteur))
    );
  const casItems: CasCard[] = cas.map((c) => ({
    slug: c.slug,
    montant: c.montant,
    titre: c.titre,
    contexte: c.contexte,
  }));

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

      {/* ===== CIBLE + CTA ===== */}
      <section className="bg-cream border-b border-line">
        <div className="wrap py-10 lg:py-12">
          <div className="grid lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8">
              {o.cible && (
                <>
                  <p className="kicker text-orange700 mb-2">Pour qui</p>
                  <p className="text-[1.05rem] text-slateD leading-relaxed">{o.cible}</p>
                </>
              )}
            </div>
            <div className="lg:col-span-4 flex lg:justify-end">
              <Button href={cta.href} variant="primary" arrow className="shadow-soft">
                {cta.label}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ===== BÉNÉFICES ===== */}
      {o.benefices?.length ? (
        <section className="wrap py-16 lg:py-20">
          <p className="kicker text-orange700 mb-8">Ce que vous y gagnez</p>
          <div className="grid md:grid-cols-3 gap-5">
            {o.benefices.map((b, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-7">
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-orange/10 text-orange700">
                  <IconCheck className="w-6 h-6" />
                </span>
                <p className="mt-4 display text-[1.15rem] font-600 text-ink leading-snug">{b}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* ===== DÉTAIL + RAIL ===== */}
      {body && (
        <section className="wrap py-8 lg:py-12">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-8">
              <Mdx source={mainBody} />

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

              {sourcesSection && <Mdx source={sourcesSection} className="mt-10" />}
            </div>

            <aside className="lg:col-span-4 lg:sticky lg:top-28 self-start space-y-4">
              {o.pourquoi?.length ? (
                <div className="rounded-2xl bg-ink text-white p-7">
                  <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-orange/15 text-orange2">
                    <IconLever className="w-6 h-6" />
                  </span>
                  <p className="kicker text-orange2 mt-4 mb-4">Pourquoi Accelium</p>
                  <ul className="space-y-3 text-[0.95rem] text-white/85">
                    {o.pourquoi.map((b, i) => (
                      <li key={i} className="flex gap-3">
                        <span className="text-orange2 shrink-0">→</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              <div className="rounded-2xl bg-cream border border-line p-7">
                <p className="display text-[1.2rem] font-600 text-ink">Un projet à financer ?</p>
                <p className="mt-2 text-[0.92rem] text-body">
                  Le premier diagnostic est gratuit et sans engagement.
                </p>
                <div className="mt-5">
                  <Button href={cta.href} variant="primary" className="!px-6 !py-3 text-[0.95rem]">
                    {cta.label}
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      {/* ===== NIVEAUX D'INTERVENTION ===== */}
      {o.niveaux?.length ? (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16 lg:py-24">
            <p className="kicker text-orange700 mb-3">Nos niveaux d'intervention</p>
            <h2 className="display h-sec font-600 text-ink max-w-[22ch] mb-10">
              Un accompagnement gradué, selon votre maturité
            </h2>
            <div className="space-y-4">
              {o.niveaux.map((n, i) => {
                const { num, titre } = (() => {
                  const p = parseNiveau(n.nom);
                  return { num: p.n || String(i + 1), titre: p.titre };
                })();
                return (
                  <div
                    key={i}
                    className="grid md:grid-cols-12 gap-4 md:gap-6 items-start rounded-2xl bg-surface border border-line p-6 lg:p-7"
                  >
                    <div className="md:col-span-3 flex items-center gap-4">
                      <span className="display text-[2.4rem] font-600 text-orange/35 leading-none">
                        {String(num).padStart(2, "0")}
                      </span>
                      <h3 className="display text-[1.15rem] font-600 text-ink leading-tight">{titre}</h3>
                    </div>
                    <div className="md:col-span-9 md:border-l md:border-line md:pl-6">
                      {n.pourQui && (
                        <p className="text-[0.82rem] font-500 text-slate mb-1">{n.pourQui}</p>
                      )}
                      <p className="text-[0.97rem] text-body leading-relaxed">{cleanText(n.description)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== FAQ ===== */}
      {o.faq?.length ? (
        <section className="wrap py-16 lg:py-24">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
            <div className="lg:col-span-4">
              <p className="kicker text-orange700 mb-3">FAQ</p>
              <h2 className="display h-sec font-600 text-ink">Questions fréquentes</h2>
            </div>
            <div className="lg:col-span-8">
              <Accordion items={o.faq} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ===== PROJETS FINANCÉS ===== */}
      {casItems.length > 0 && (
        <section className="bg-cream border-y border-line">
          <div className="wrap py-16 lg:py-24">
            <h2 className="display h-sec font-600 text-ink mb-8">Projets financés</h2>
            <CasGrid items={casItems} initial={6} step={6} />
          </div>
        </section>
      )}

      {/* ===== AUTRES OFFRES ===== */}
      <section className="bg-ink text-white">
        <div className="wrap py-16 lg:py-20">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-8">
            <h2 className="display h-sec font-600 max-w-[18ch]">Nos autres offres</h2>
            <Link href="/offres" className="btn-ghost-d focusable rounded-full px-6 py-3 text-[0.92rem]">
              Toutes nos offres
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {autres.map((x) => (
              <Link
                key={x.slug}
                href={`/offres/${x.slug}`}
                className="group flex items-center justify-between gap-4 rounded-2xl border border-white/15 px-6 py-5 hover:bg-white/[0.06] hover:border-white/35 focusable transition-colors"
              >
                <span className="display text-[1.1rem] font-500">{x.nomCourt}</span>
                <span className="text-orange2 text-xl transition-transform group-hover:translate-x-1">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <RelatedLinks related={o.related} />
      <CtaBlock />
    </>
  );
}

import Link from "next/link";
import type { Related } from "@/lib/content";
import { getOffres, getDispositifs, getSecteurs, getFinanceurs, getArticles } from "@/lib/content";

function resolve(related?: Related) {
  if (!related) return [];
  const out: { label: string; href: string; group: string }[] = [];
  const offres = getOffres();
  const dispositifs = getDispositifs();
  const secteurs = getSecteurs();
  const financeurs = getFinanceurs();
  const articles = getArticles();

  related.offres?.forEach((s) => {
    const o = offres.find((x) => x.slug === s);
    if (o) out.push({ label: o.nomCourt || s, href: `/offres/${s}`, group: "Offre" });
  });
  related.dispositifs?.forEach((s) => {
    const d = dispositifs.find((x) => x.slug === s);
    if (d) out.push({ label: d.nom || s, href: `/le-financement-public/dispositifs/${s}`, group: "Dispositif" });
  });
  related.secteurs?.forEach((s) => {
    const sec = secteurs.find((x) => x.slug === s);
    if (sec) out.push({ label: sec.nom || s, href: `/secteurs/${s}`, group: "Secteur" });
  });
  related.financeurs?.forEach((s) => {
    const f = financeurs.find((x) => x.slug === s);
    if (f) out.push({ label: f.nom || s, href: `/le-financement-public/financeurs/${s}`, group: "Financeur" });
  });
  related.articles?.forEach((s) => {
    const a = articles.find((x) => x.slug === s);
    if (a) out.push({ label: a.titre || s, href: `/blog/${s}`, group: "Article" });
  });
  return out;
}

export function RelatedLinks({ related, title = "Pour aller plus loin" }: { related?: Related; title?: string }) {
  const links = resolve(related);
  if (!links.length) return null;
  return (
    <section className="bg-cream border-t border-line">
      <div className="wrap py-16 lg:py-20">
        <h2 className="display h-sec font-600 text-ink mb-8">{title}</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {links.map((l) => (
            <Link
              key={l.href + l.label}
              href={l.href}
              className="group block rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable"
            >
              <span className="kicker text-orange700">{l.group}</span>
              <span className="mt-2 flex items-center justify-between gap-3">
                <span className="display text-[1.15rem] font-500 text-ink">{l.label}</span>
                <span aria-hidden="true" className="text-orange700 text-xl transition-transform group-hover:translate-x-1">
                  →
                </span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

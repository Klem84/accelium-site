import Link from "next/link";
import { getArticles, getDispositifs, getNewsletters } from "@/lib/content";
import { formatDate } from "@/lib/utils";

type Carte = {
  type: string;
  titre: string;
  resume?: string;
  href: string;
  dateLabel: string;
  dateIso: string;
};

/**
 * Section « Ressources » de l'accueil (plan V2 §5.1) : dernière newsletter,
 * dernier article, dernier dispositif vérifié (tri par derniereVerification),
 * chacun avec sa date. Une carte sans contenu n'est pas rendue ; la section
 * disparaît si les trois manquent.
 */
export function RessourcesSection() {
  const cartes: Carte[] = [];

  const newsletter = getNewsletters()[0];
  if (newsletter) {
    cartes.push({
      type: "Newsletter",
      titre: newsletter.titre,
      resume: newsletter.resume,
      href: `/ressources/newsletters/${newsletter.slug}`,
      dateLabel: `Publiée le ${formatDate(newsletter.date)}`,
      dateIso: newsletter.date,
    });
  }

  const article = getArticles()[0];
  if (article) {
    cartes.push({
      type: "Article",
      titre: article.titre,
      resume: article.excerpt,
      href: `/blog/${article.slug}`,
      dateLabel: `Publié le ${formatDate(article.publishedAt)}`,
      dateIso: article.publishedAt,
    });
  }

  const dispositif = getDispositifs()
    .filter((d) => d.indexable !== false && d.derniereVerification)
    .sort((a, b) => {
      const byVerif = (b.derniereVerification || "").localeCompare(a.derniereVerification || "");
      if (byVerif !== 0) return byVerif;
      const byMaj = (b.updatedAt || "").localeCompare(a.updatedAt || "");
      return byMaj !== 0 ? byMaj : a.nom.localeCompare(b.nom, "fr");
    })[0];
  if (dispositif && dispositif.derniereVerification) {
    cartes.push({
      type: "Dispositif",
      titre: dispositif.nom,
      resume: dispositif.definition,
      href: `/le-financement-public/dispositifs/${dispositif.slug}`,
      dateLabel: `Vérifié le ${formatDate(dispositif.derniereVerification)}`,
      dateIso: dispositif.derniereVerification,
    });
  }

  if (cartes.length === 0) return null;

  return (
    <section className="cv-auto bg-cream border-t border-line">
      <div className="wrap py-24 lg:py-32">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-14">
          <div className="reveal">
            <p className="kicker text-orange700 mb-4">Ressources</p>
            <h2 className="display h-sec font-600 text-ink max-w-[20ch]">
              Nos dernières publications
            </h2>
          </div>
          <Link href="/ressources" className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem] reveal">
            Toutes les ressources
          </Link>
        </div>

        <div data-stagger className="grid md:grid-cols-3 gap-4">
          {cartes.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group flex flex-col h-full rounded-2xl border border-line bg-surface p-7 hover:border-ink transition-colors focusable"
            >
              <span className="kicker text-orange700">{c.type}</span>
              <h3 className="mt-4 display text-[1.3rem] font-600 text-ink leading-snug group-hover:text-orange700 transition-colors">
                {c.titre}
              </h3>
              {c.resume && <p className="mt-3 text-[0.92rem] text-body line-clamp-3 flex-1">{c.resume}</p>}
              <p className="mt-5 pt-4 border-t border-line text-[0.8rem] text-slate">
                <time dateTime={c.dateIso}>{c.dateLabel}</time>
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

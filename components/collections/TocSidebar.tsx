export type TocEntry = { id: string; label: string };

/**
 * Sommaire ancré pour les pages longues (> 1200 mots : dispositif, région, article
 * de fond). Purement statique (liens d'ancre #), pas de scroll-spy JS pour rester
 * simple et sans dépendance. A construire depuis les H2 de la page (id à poser sur
 * chaque H2 correspondant).
 */
export function TocSidebar({ items, title = "Sur cette page" }: { items: TocEntry[]; title?: string }) {
  if (!items?.length) return null;
  return (
    <nav aria-label={title} className="lg:sticky lg:top-28 self-start rounded-2xl border border-line bg-cream p-6">
      <p className="kicker text-orange700 mb-4">{title}</p>
      <ul className="space-y-2.5 text-[0.88rem]">
        {items.map((it) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="text-body hover:text-orange700 focusable">
              {it.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

import Link from "next/link";

export type CaseCardData = {
  slug: string;
  montant: string;
  montantLabel?: string;
  titre: string;
  contexte: string;
  taux?: string;
  delai?: string;
  secteurNom?: string;
};

/**
 * Carte "cas client" enrichie (§6.8) : ajoute taux et délai à la carte simple
 * existante (CasGrid), utile sur les pages dispositif et région où ces deux
 * informations parlent davantage que le seul montant.
 */
export function CaseCard({ item }: { item: CaseCardData }) {
  return (
    <Link
      href={`/cas-clients/${item.slug}`}
      className="group flex flex-col rounded-2xl border border-line bg-surface p-6 hover:border-ink transition-colors focusable h-full"
    >
      {item.secteurNom && (
        <span className="inline-flex self-start text-[0.72rem] font-600 tracking-wide uppercase text-orange700 bg-orange/10 rounded-full px-3 py-1">
          {item.secteurNom}
        </span>
      )}
      <p className="display text-[1.9rem] font-600 text-ink leading-none mt-4">{item.montant}</p>
      <p className="mt-1 text-[0.8rem] text-slate">{item.montantLabel || "d'aide obtenue"}</p>
      <p className="mt-3 text-[0.86rem] font-600 text-slateD">{item.titre}</p>
      <p className="mt-2 text-[0.92rem] text-body flex-1">{item.contexte}</p>
      {(item.taux || item.delai) && (
        <div className="mt-4 pt-4 border-t border-line flex gap-4 text-[0.8rem] text-slateD">
          {item.taux && (
            <span>
              <span className="font-600 text-ink">{item.taux}</span> de taux
            </span>
          )}
          {item.delai && <span>{item.delai}</span>}
        </div>
      )}
    </Link>
  );
}

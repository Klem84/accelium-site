/**
 * Testimonial (§4.11 de docs/components-v2.md) : un verbatim client en exergue
 * (accueil « Ils nous font confiance », pages offre et cas). Composant serveur,
 * non interactif.
 *
 * Props :
 * - citation : le verbatim (jamais les verbatims d'Edeis, de MEBOR ni d'Arboriste
 *   du Sud, cf. règle §2.6 du brief commun).
 * - auteur : la fonction de la personne (jamais son nom complet ni ses
 *   coordonnées si la fiche client n'est pas confirmée).
 * - entreprise : nom de l'entreprise ou secteur, selon ce que le cas client
 *   autorise à afficher.
 * - confirme : le composant ne rend rien si `confirme` n'est pas strictement
 *   `true` (même règle que PartnerCard).
 * - secteur : optionnel, précision affichée après l'entreprise.
 * - date : optionnelle, ISO (AAAA-MM-JJ), affichée (mois et année) dans la légende.
 * - detail : optionnel, précision de la légende (ex. « note de recommandation 10/10 »).
 *
 * Ne rend rien si `confirme !== true`, si `citation` est vide, ou si `auteur`
 * est vide. Aucune note ni étoile inventée : la note globale du cabinet vient de
 * `config/chiffres.ts` et se compose à part (voir `chiffres.satisfaction`).
 */
export type TestimonialData = {
  citation: string;
  auteur: string;
  entreprise?: string;
  secteur?: string;
  date?: string;
  detail?: string;
  confirme: boolean;
};

export function Testimonial({ item }: { item: TestimonialData }) {
  if (!item.confirme || !item.citation?.trim() || !item.auteur?.trim()) return null;

  const mois =
    item.date && !Number.isNaN(new Date(`${item.date}T00:00:00Z`).getTime())
      ? new Date(`${item.date}T00:00:00Z`).toLocaleDateString("fr-FR", { timeZone: "UTC", month: "long", year: "numeric" })
      : undefined;
  const contexte = [item.auteur, item.entreprise, item.secteur, mois, item.detail].filter(Boolean).join(", ");

  return (
    <figure className="max-w-3xl">
      <blockquote className="display text-[clamp(1.35rem,1.1rem_+_1vw,1.9rem)] font-500 text-ink leading-snug">
        &laquo;&nbsp;{item.citation}&nbsp;&raquo;
      </blockquote>
      <figcaption className="mt-5 text-[0.9rem] text-slateD flex items-center gap-3">
        <span aria-hidden="true" className="inline-block h-px w-6 bg-orange" />
        {contexte}
      </figcaption>
    </figure>
  );
}

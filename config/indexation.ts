/**
 * Pages exclues de l'index et du sitemap tant qu'un lot de contenu n'est pas livré.
 * Clé : chemin sans slash initial. Repasser à `false` dès la livraison (A1).
 *
 * - cabinet/equipe, cabinet/partenaires : noindex levé le 28/09/2026 (Lot 5 livré par I5) :
 *   équipe complète (biographies, photos, schéma Person) ; partenaires avec plus de 400 mots
 *   utiles (cercle, rôle des partenaires, fonctionnement d'un partenariat) même sans entrée
 *   confirmée (les grilles nommées restent vides tant que `confirme` est false).
 * - secteurs/sante, secteurs/numerique : contenu vérifié le 27/09/2026, comparable en profondeur
 *   aux autres pages secteurs (industrie, foret-bois...). Laissées indexables ; à repasser à `true`
 *   si elles restent vides après le Lot 3.
 */
export const noindexTemporaire: Record<string, boolean> = {
  "cabinet/equipe": false,
  "cabinet/partenaires": false,
  "secteurs/sante": false,
  "secteurs/numerique": false,
};

export function estNoindexTemporaire(path: string): boolean {
  return noindexTemporaire[path] === true;
}

/**
 * Dates de dernière modification éditoriale des pages sans fiche de contenu datée (sitemap).
 * Constantes : ne PAS utiliser la date du build (elle change à chaque déploiement et rend
 * le lastmod inutilisable). À mettre à jour à la main quand le contenu d'une page change
 * réellement (relevé : dernier commit du fichier source au 03/10/2026).
 * Clé : chemin avec slash initial ("" = accueil).
 */
export const lastmodPagesStatiques: Record<string, string> = {
  "": "2026-10-03",
  "/offres": "2026-10-03",
  "/secteurs": "2026-09-27",
  "/le-financement-public": "2026-10-03",
  "/le-financement-public/types-d-aides": "2026-10-03",
  "/le-financement-public/financeurs": "2026-10-03",
  "/le-financement-public/dispositifs": "2026-10-03",
  "/regions": "2026-09-28",
  "/cas-clients": "2026-10-03",
  "/blog": "2026-10-03",
  "/blog/rss.xml": "2026-10-03",
  "/contact": "2026-10-03",
  "/ressources": "2026-10-03",
  "/ressources/livres-blancs": "2026-09-28",
  "/ressources/agrement-cir-cii": "2026-10-03",
  "/ressources/newsletters": "2026-09-28",
  "/mentions-legales": "2026-09-27",
  "/politique-de-confidentialite": "2026-09-27",
  "/cookies": "2026-09-27",
  "/cgu": "2026-09-27",
  "cabinet/a-propos": "2026-10-03",
  "cabinet/deontologie": "2026-09-27",
  "cabinet/equipe": "2026-09-28",
  "cabinet/evenements": "2026-09-28",
  "cabinet/nos-atouts": "2026-09-27",
  "cabinet/nous-rejoindre": "2026-09-28",
  "cabinet/partenaires": "2026-09-28",
};

/** Date de repli (dernière mise à jour du site), jamais la date du build. */
export const lastmodDefaut = "2026-10-03";

export function lastmodStatique(path: string): Date {
  return new Date(lastmodPagesStatiques[path] || lastmodDefaut);
}

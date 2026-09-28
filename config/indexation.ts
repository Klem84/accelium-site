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

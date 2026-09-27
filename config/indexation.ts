/**
 * Pages exclues de l'index et du sitemap tant qu'un lot de contenu n'est pas livré.
 * Clé : chemin sans slash initial. Repasser à `false` dès la livraison (A1).
 *
 * - cabinet/equipe, cabinet/partenaires : noindex tant que le Lot 4/5 (biographies, partenaires
 *   confirmés) n'est pas livré (fiche L1.10).
 * - secteurs/sante, secteurs/numerique : contenu vérifié le 27/09/2026, comparable en profondeur
 *   aux autres pages secteurs (industrie, foret-bois...). Laissées indexables ; à repasser à `true`
 *   si elles restent vides après le Lot 3.
 */
export const noindexTemporaire: Record<string, boolean> = {
  "cabinet/equipe": true,
  "cabinet/partenaires": true,
  "secteurs/sante": false,
  "secteurs/numerique": false,
};

export function estNoindexTemporaire(path: string): boolean {
  return noindexTemporaire[path] === true;
}

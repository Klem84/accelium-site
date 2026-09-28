// Pool de visuels par secteur pour les vignettes de cas clients.
// Les clients étant anonymisés, on illustre par des photos sectorielles.
// Plusieurs visuels par secteur quand on en a, pour éviter la répétition de la
// même image sur des cartes voisines.
// Images hébergées localement (cf. docs/credits-images.md pour l'attribution
// Unsplash) : plus de dépendance à images.unsplash.com (CSP, fiche J.1.13).

export const casVisuels: Record<string, string[]> = {
  agriculture: ["/images/secteurs/secteur-agriculture.jpg"],
  agroalimentaire: ["/images/secteurs/secteur-agroalimentaire.jpg"],
  beton: ["/images/secteurs/secteur-beton.jpg"],
  biomasse: ["/images/secteurs/secteur-biomasse.jpg", "/images/secteurs/secteur-biomasse-scierie.jpg"],
  defense: ["/images/secteurs/secteur-defense.jpg"],
  distillerie: ["/images/secteurs/secteur-distillerie.jpg", "/images/secteurs/secteur-distillerie-alambic.jpg"],
  enrobes: ["/images/secteurs/secteur-enrobes.jpg"],
  "foret-bois": ["/images/secteurs/secteur-foret-bois.jpg", "/images/secteurs/secteur-biomasse-scierie.jpg"],
  industrie: ["/images/secteurs/secteur-industrie.jpg", "/images/secteurs/secteur-industrie-usine.jpg"],
  numerique: ["/images/secteurs/secteur-numerique.jpg"],
  "port-maritime": ["/images/secteurs/secteur-port-maritime.jpg", "/images/secteurs/secteur-port-maritime-cargo.jpg"],
  sante: ["/images/secteurs/secteur-sante.jpg"],
};

// Visuel pour un cas : le i-ème visuel du secteur (rotation), sinon image fournie.
export function visuelCas(secteur: string, indexDansSecteur: number, fallback?: string): string | undefined {
  const pool = casVisuels[secteur];
  if (pool && pool.length) return pool[indexDansSecteur % pool.length];
  return fallback;
}

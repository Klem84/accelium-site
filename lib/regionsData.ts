// Référentiel des 13 régions françaises (métropole + Corse) utilisé par le hub
// /regions et par RegionMap pour afficher la liste complète même quand une région
// n'a pas encore de fiche content/regions/<slug>.mdx. Positions de grille (col, row)
// pour le cartogramme simplifié de RegionMap : approximation de la position
// géographique, pas un tracé fidèle des frontières.
export type RegionRef = { slug: string; nom: string; code: string; col: number; row: number };

export const REGIONS: RegionRef[] = [
  { slug: "hauts-de-france", nom: "Hauts-de-France", code: "HDF", col: 2, row: 0 },
  { slug: "normandie", nom: "Normandie", code: "NOR", col: 1, row: 1 },
  { slug: "ile-de-france", nom: "Ile-de-France", code: "IDF", col: 2, row: 1 },
  { slug: "grand-est", nom: "Grand Est", code: "GES", col: 3, row: 1 },
  { slug: "bretagne", nom: "Bretagne", code: "BRE", col: 0, row: 2 },
  { slug: "pays-de-la-loire", nom: "Pays de la Loire", code: "PDL", col: 1, row: 2 },
  { slug: "centre-val-de-loire", nom: "Centre-Val de Loire", code: "CVL", col: 2, row: 2 },
  { slug: "bourgogne-franche-comte", nom: "Bourgogne-Franche-Comté", code: "BFC", col: 3, row: 2 },
  { slug: "nouvelle-aquitaine", nom: "Nouvelle-Aquitaine", code: "NAQ", col: 1, row: 3 },
  { slug: "auvergne-rhone-alpes", nom: "Auvergne-Rhône-Alpes", code: "ARA", col: 3, row: 3 },
  { slug: "occitanie", nom: "Occitanie", code: "OCC", col: 2, row: 4 },
  { slug: "provence-alpes-cote-d-azur", nom: "Provence-Alpes-Côte d'Azur", code: "PAC", col: 4, row: 3 },
  { slug: "corse", nom: "Corse", code: "COR", col: 4, row: 4 },
];

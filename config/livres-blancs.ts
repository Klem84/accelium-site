// Registre des livres blancs téléchargeables (gate email).
// Les PDF sont hébergés sur Vercel Blob (URL de base unique : config/livres-blancs-base.mjs).
// Le téléchargement se fait après remplissage du formulaire : le lien est
// envoyé par email (cf. app/api/livre-blanc/route.ts + lib/resend.ts).

import { urlLivreBlanc } from "./livres-blancs-base.mjs";

export type LivreBlanc = {
  slug: string;
  titre: string;
  sousTitre: string;
  description: string;
  fichier: string; // URL absolue du PDF (Vercel Blob, ou public/ tant que le store n'existe pas)
  pages?: string; // indication facultative (ex. « 24 pages »)
  categorie: string;
};

export const livresBlancs: LivreBlanc[] = [
  {
    slug: "cir-cii",
    titre: "Crédit d'impôt recherche & innovation",
    sousTitre: "Le guide complet du CIR et du CII",
    description:
      "Tout comprendre du CIR et du CII : éligibilité, dépenses valorisables, agrément, sécurisation face au contrôle fiscal. Le référentiel pour ne plus laisser d'argent sur la table.",
    fichier: urlLivreBlanc("livre-blanc-cir-cii.pdf"),
    categorie: "Crédits d'impôt",
  },
  {
    slug: "foret-bois",
    titre: "Filière forêt-bois",
    sousTitre: "Financements publics de la filière forêt-bois",
    description:
      "Panorama des dispositifs de financement mobilisables sur toute la chaîne de valeur forêt-bois : amont forestier, première et seconde transformation, énergie et construction.",
    fichier: urlLivreBlanc("livre-blanc-foret-bois.pdf"),
    categorie: "Analyse sectorielle",
  },
  {
    slug: "agences-de-leau",
    titre: "Programme des agences de l'eau 2025-2030",
    sousTitre: "Décryptage du 12ᵉ programme des agences de l'eau",
    description:
      "Les priorités et les aides du programme 2025-2030 des agences de l'eau : quels projets sont financés, à quelles conditions, et comment en bénéficier.",
    fichier: urlLivreBlanc("programme-agences-de-leau-2025-2030.pdf"),
    categorie: "Décryptage",
  },
];

export const getLivreBlanc = (slug: string) =>
  livresBlancs.find((l) => l.slug === slug);

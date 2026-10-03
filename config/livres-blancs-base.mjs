// URL de base unique des livres blancs (hébergés sur Vercel Blob, hors de public/).
// Remplacer STORE_ID par l'identifiant du store Blob (visible dans l'URL d'un fichier
// du store : https://<STORE_ID>.public.blob.vercel-storage.com/...). Voir docs/go-live.md, « Livres blancs ».
// Fichier .mjs pour être lu à la fois par next.config.mjs (redirections) et par config/livres-blancs.ts.
export const LIVRES_BLANCS_BASE_URL =
  "https://STORE_ID.public.blob.vercel-storage.com/livres-blancs";

// Vrai une fois STORE_ID remplacé (les redirections ne sont actives que dans ce cas).
export const livresBlancsBaseConfiguree = !LIVRES_BLANCS_BASE_URL.includes("STORE_ID");

// Tant que le store Blob n'est pas créé, les PDF restent servis depuis public/livres-blancs/
// (URL absolue du site, utilisable aussi dans les emails). Une fois STORE_ID remplacé et les
// PDF envoyés sur Blob, supprimer public/livres-blancs/ (seuil d'audit : public/ < 10 Mo).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://www.accelium-conseil.fr").replace(/\/$/, "");

export function urlLivreBlanc(fichier) {
  return livresBlancsBaseConfiguree
    ? `${LIVRES_BLANCS_BASE_URL}/${fichier}`
    : `${SITE_URL}/livres-blancs/${fichier}`;
}

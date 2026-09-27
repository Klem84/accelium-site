// Pool de visuels (Unsplash) par secteur pour les vignettes de cas clients.
// Les clients étant anonymisés, on illustre par des photos sectorielles.
// Plusieurs visuels par secteur quand on en a, pour éviter la répétition de la
// même image sur des cartes voisines. URLs déjà vérifiées (utilisées ailleurs
// sur le site) : ne pas en inventer, le slug complet (avec hash) est requis.

const U = (slug: string) => `https://images.unsplash.com/${slug}?auto=format&fit=crop&w=800&q=78`;

export const casVisuels: Record<string, string[]> = {
  agriculture: [U("photo-1560493676-04071c5f467b")],
  agroalimentaire: [U("photo-1513257805917-a0da1146eb15")],
  beton: [U("photo-1578776349090-de61da00ff1a")],
  biomasse: [U("photo-1673208769691-e74104d853fd"), U("photo-1518709268805-4e9042af9f23")],
  defense: [U("photo-1624027492684-327af1fb7559")],
  distillerie: [U("photo-1620200423727-8127f75d7f53"), U("photo-1569529465841-dfecdab7503b")],
  enrobes: [U("photo-1717386255773-1e3037c81788")],
  "foret-bois": [U("photo-1616761286619-2acae0580383"), U("photo-1518709268805-4e9042af9f23")],
  industrie: [U("photo-1511454493857-0a29f2c023c7"), U("photo-1496247749665-49cf5b1022e9")],
  numerique: [U("photo-1518770660439-4636190af475")],
  "port-maritime": [U("photo-1606185540834-d6e7483ee1a4"), U("photo-1605281317010-fe5ffe798166")],
  sante: [U("photo-1576091160550-2173dba999ef")],
};

// Visuel pour un cas : le i-ème visuel du secteur (rotation), sinon image fournie.
export function visuelCas(secteur: string, indexDansSecteur: number, fallback?: string): string | undefined {
  const pool = casVisuels[secteur];
  if (pool && pool.length) return pool[indexDansSecteur % pool.length];
  return fallback;
}

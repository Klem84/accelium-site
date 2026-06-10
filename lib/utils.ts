export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export const clusterLabels: Record<string, string> = {
  actualite: "Actualité",
  dispositifs: "Dispositifs",
  secteurs: "Secteurs",
  methode: "Méthode",
  "cas-clients": "Cas clients",
};

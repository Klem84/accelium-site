import { getAuteur } from "@/lib/content";

// Table de repli slug -> nom pour les auteurs qui ne sont pas encore une fiche dans
// content/auteurs (contrat §6.1 : auteur: clement-barbier). A compléter au fil des
// fiches ajoutées à content/auteurs.
const AUTEURS_REPLI: Record<string, string> = {
  "clement-barbier": "Clément Barbier",
  "equipe-accelium": "L'équipe Accelium",
};

function nomAuteur(slug?: string): string | undefined {
  if (!slug) return undefined;
  const fiche = getAuteur(slug);
  if (fiche?.nom) return fiche.nom;
  if (AUTEURS_REPLI[slug]) return AUTEURS_REPLI[slug];
  return slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" ");
}

function formatDate(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

/**
 * Ligne « Vérifié le … par … » (§6.1, §6.8). N'affiche rien si la date de
 * vérification n'est pas connue : on ne veut jamais afficher une date inventée.
 */
export function VerifiedBadge({ derniereVerification, auteur }: { derniereVerification?: string; auteur?: string }) {
  const date = formatDate(derniereVerification);
  if (!date || !derniereVerification) return null;
  const nom = nomAuteur(auteur);

  return (
    <p className="inline-flex items-center gap-2 text-[0.82rem] font-500 text-slateD">
      <span
        aria-hidden="true"
        className="inline-flex w-4 h-4 items-center justify-center rounded-full bg-orange/15 text-orange700 text-[0.62rem]"
      >
        ✓
      </span>
      Vérifié le <time dateTime={derniereVerification}>{date}</time>
      {nom ? ` par ${nom}` : ""}
    </p>
  );
}

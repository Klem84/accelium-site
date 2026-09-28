/* Formatage des dates d'événements (AAAA-MM-JJ) en français, en UTC pour éviter
   tout décalage d'un jour selon le fuseau du serveur de build. */

function toDate(iso: string): Date {
  return new Date(`${iso}T00:00:00Z`);
}

const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) =>
  d.toLocaleDateString("fr-FR", { timeZone: "UTC", ...opts });

export function formatDateEvenement(debut: string, fin?: string): string {
  const d = toDate(debut);
  if (!fin || fin === debut) return fmt(d, { day: "numeric", month: "long", year: "numeric" });
  const f = toDate(fin);
  const memeMois = d.getUTCMonth() === f.getUTCMonth() && d.getUTCFullYear() === f.getUTCFullYear();
  if (memeMois) return `du ${fmt(d, { day: "numeric" })} au ${fmt(f, { day: "numeric", month: "long", year: "numeric" })}`;
  return `du ${fmt(d, { day: "numeric", month: "long" })} au ${fmt(f, { day: "numeric", month: "long", year: "numeric" })}`;
}

/** Date du jour au format AAAA-MM-JJ (UTC), pour séparer événements passés et à venir. */
export function aujourdhuiIso(): string {
  return new Date().toISOString().slice(0, 10);
}

import Link from "next/link";

export type DispositifTableRow = {
  label: string;
  value?: string | string[];
  href?: string;
};

/**
 * Tableau d'identité d'un dispositif (§6.1 et §6.8). Rendu en <table> à partir de
 * md, en <dl> empilée sur mobile pour rester lisible sans défilement horizontal.
 * N'affiche que les lignes dont la valeur existe (état "vide" par ligne).
 */
export function DispositifTable({
  nomCourt,
  financeur,
  financeurHref,
  beneficiaires,
  depensesEligibles,
  tauxPlafond,
  forme,
  calendrier,
  cumul,
  lienOfficiel,
}: {
  nomCourt?: string;
  financeur?: string;
  financeurHref?: string;
  beneficiaires?: string[];
  depensesEligibles?: string[];
  tauxPlafond?: string;
  forme?: string;
  calendrier?: string;
  cumul?: string;
  lienOfficiel?: string;
}) {
  const domaineOfficiel = lienOfficiel ? domainOf(lienOfficiel) : undefined;
  const rows: DispositifTableRow[] = [
    { label: "Financeur", value: financeur, href: financeurHref },
    { label: "Bénéficiaires", value: beneficiaires },
    { label: "Dépenses éligibles", value: depensesEligibles },
    { label: "Taux et plafond", value: tauxPlafond },
    { label: "Forme de l'aide", value: forme },
    { label: "Calendrier", value: calendrier },
    { label: "Cumul", value: cumul },
    {
      label: "Lien officiel",
      value: domaineOfficiel ? `Site officiel : ${domaineOfficiel}` : undefined,
      href: lienOfficiel,
    },
  ].filter((r) => Boolean(r.value));

  if (!rows.length) {
    if (process.env.NODE_ENV !== "production") {
      return (
        <p className="border border-dashed border-slate text-slate text-[0.85rem] p-4 rounded-xl">
          DispositifTable : aucune ligne fournie (développement uniquement).
        </p>
      );
    }
    return null;
  }

  return (
    <>
      {/* Mobile : liste de définitions, bascule au tableau à partir de md (768 px) */}
      <dl className="md:hidden divide-y divide-line border border-line rounded-2xl overflow-hidden">
        {rows.map((r) => (
          <div key={r.label} className="p-4">
            <dt className="text-[0.72rem] uppercase tracking-wide font-600 text-orange700">{r.label}</dt>
            <dd className="mt-1 text-[0.94rem] text-body">
              <RowValue row={r} highlight={r.label === "Taux et plafond"} />
            </dd>
          </div>
        ))}
      </dl>

      {/* md (>=768px) et plus : tableau */}
      <table className="hidden md:table w-full border-collapse rounded-2xl overflow-hidden border border-line text-[0.92rem]">
        <caption className="sr-only">
          Fiche d&apos;identité{nomCourt ? ` : ${nomCourt}` : ""}
        </caption>
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0 even:bg-cream/60">
              <th scope="row" className="text-left align-top w-[34%] px-5 py-4 font-600 text-ink text-[0.92rem]">
                {r.label}
              </th>
              <td className="px-5 py-4 text-body">
                <RowValue row={r} highlight={r.label === "Taux et plafond"} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

function RowValue({ row, highlight = false }: { row: DispositifTableRow; highlight?: boolean }) {
  const content = Array.isArray(row.value) ? (
    <ul className="space-y-1">
      {row.value.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
  ) : highlight ? (
    <span className="display text-[1.15rem] font-600 text-ink">{row.value}</span>
  ) : (
    row.value
  );

  if (row.href) {
    const isInternal = row.href.startsWith("/");
    return isInternal ? (
      <Link href={row.href} className="text-orange700 font-600 focusable">
        {content}
      </Link>
    ) : (
      <a
        href={row.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-orange700 font-600 underline underline-offset-2 focusable break-all"
      >
        {content} <span aria-hidden="true">↗</span>
        <span className="sr-only"> (nouvel onglet)</span>
      </a>
    );
  }
  return <>{content}</>;
}

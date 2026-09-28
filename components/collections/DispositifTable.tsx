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
  const rows: DispositifTableRow[] = [
    { label: "Financeur", value: financeur, href: financeurHref },
    { label: "Bénéficiaires", value: beneficiaires },
    { label: "Dépenses éligibles", value: depensesEligibles },
    { label: "Taux et plafond", value: tauxPlafond },
    { label: "Forme de l'aide", value: forme },
    { label: "Calendrier", value: calendrier },
    { label: "Cumul", value: cumul },
    { label: "Lien officiel", value: lienOfficiel ? "Site du financeur" : undefined, href: lienOfficiel },
  ].filter((r) => Boolean(r.value));

  if (!rows.length) {
    return (
      <p className="text-[0.9rem] text-slate italic">
        Les informations d'identité de ce dispositif sont en cours de vérification.
      </p>
    );
  }

  return (
    <>
      {/* Mobile : liste de définitions */}
      <dl className="sm:hidden divide-y divide-line border border-line rounded-2xl overflow-hidden">
        {rows.map((r) => (
          <div key={r.label} className="p-4">
            <dt className="text-[0.72rem] uppercase tracking-wide font-600 text-orange700">{r.label}</dt>
            <dd className="mt-1 text-[0.94rem] text-body">
              <RowValue row={r} />
            </dd>
          </div>
        ))}
      </dl>

      {/* Desktop : tableau */}
      <table className="hidden sm:table w-full border-collapse rounded-2xl overflow-hidden border border-line text-[0.92rem]">
        <tbody>
          {rows.map((r) => (
            <tr key={r.label} className="border-b border-line last:border-0 even:bg-cream/60">
              <th scope="row" className="text-left align-top w-[34%] px-5 py-4 font-600 text-ink">
                {r.label}
              </th>
              <td className="px-5 py-4 text-body">
                <RowValue row={r} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function RowValue({ row }: { row: DispositifTableRow }) {
  const content = Array.isArray(row.value) ? (
    <ul className="space-y-1">
      {row.value.map((v) => (
        <li key={v}>{v}</li>
      ))}
    </ul>
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
      <a href={row.href} target="_blank" rel="noopener noreferrer" className="text-orange700 font-600 focusable break-all">
        {content} ↗
      </a>
    );
  }
  return <>{content}</>;
}

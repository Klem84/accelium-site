import Link from "next/link";

/**
 * Section « Financeurs » de l'accueil (plan V2 §5.1, docs/logos-financeurs.md).
 * Aucun logo : les licences des financeurs ne le permettent pas (seul l'emblème
 * européen serait possible, non activé tant que Clément ne l'a pas validé).
 * Rendu typographique en ink/70 (5,84:1 sur blanc), chaque nom lié à sa page
 * financeur, liste statique (pas de marquee : des liens en mouvement ne sont ni
 * lisibles ni atteignables au clavier), mention « Aucun partenariat ni agrément ».
 */
const financeurs = [
  { nom: "ADEME", slug: "ademe" },
  { nom: "Bpifrance", slug: "bpifrance" },
  { nom: "Conseils régionaux", slug: "regions" },
  { nom: "FranceAgriMer", slug: "franceagrimer" },
  { nom: "Agences de l'eau", slug: "agences-de-l-eau" },
  { nom: "Union européenne", slug: "ue" },
  { nom: "Agence de l'innovation de défense", slug: "aid" },
  { nom: "État et France 2030", slug: "etat" },
];

export function FinanceursBand() {
  return (
    <section aria-labelledby="financeurs-titre" className="border-y border-line">
      <div className="wrap py-16 lg:py-20 text-center">
        <h2 id="financeurs-titre" className="kicker text-orange700 mb-8">
          Les financeurs que nous mobilisons
        </h2>
        <ul
          aria-label="Financeurs mobilisés"
          className="flex flex-wrap justify-center items-baseline gap-x-3 gap-y-3 max-w-5xl mx-auto"
        >
          {financeurs.map((f, i) => (
            <li key={f.slug} className="inline-flex items-baseline gap-3">
              {i > 0 && (
                <span aria-hidden="true" className="text-orange text-[1.4rem] leading-none">
                  ·
                </span>
              )}
              <Link
                href={`/le-financement-public/financeurs/${f.slug}`}
                className="display font-600 text-[clamp(1.1rem,0.95rem_+_0.8vw,1.75rem)] text-ink/70 hover:text-ink hover:underline decoration-orange underline-offset-4 transition-colors focusable"
              >
                {f.nom}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-[0.8rem] text-slate">
          Organismes auprès desquels nous accompagnons nos clients. Aucun partenariat ni agrément.
        </p>
      </div>
    </section>
  );
}

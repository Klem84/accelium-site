import Link from "next/link";
import { JsonLd, breadcrumbSchema } from "@/lib/schema-org";

export type Crumb = { name: string; url: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const full: Crumb[] = [{ name: "Accueil", url: "/" }, ...items];
  return (
    <nav aria-label="Fil d'Ariane" className="text-[0.85rem] text-slateD">
      <JsonLd data={breadcrumbSchema(full)} />
      <ol className="flex flex-wrap items-center gap-2">
        {full.map((c, i) => (
          <li key={c.url} className="flex items-center gap-2">
            {i < full.length - 1 ? (
              <Link href={c.url} className="hover:text-orange700 focusable">
                {c.name}
              </Link>
            ) : (
              <span className="text-ink font-500" aria-current="page">
                {c.name}
              </span>
            )}
            {i < full.length - 1 && <span className="text-line">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

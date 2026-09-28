export type Source = { titre: string; url: string };

function domain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/**
 * Liste de sources officielles (§6.1, §6.3, §6.7…) : liens externes en
 * rel="noopener", domaine affiché pour la confiance. État vide sobre si la liste
 * n'est pas encore renseignée.
 */
export function SourcesBlock({ sources, title = "Sources" }: { sources?: Source[]; title?: string }) {
  if (!sources?.length) {
    return (
      <div>
        <p className="kicker text-orange700 mb-3">{title}</p>
        <p className="text-[0.85rem] text-slate italic">Sources en cours de vérification.</p>
      </div>
    );
  }

  return (
    <div>
      <p className="kicker text-orange700 mb-3">{title}</p>
      <ul className="space-y-2">
        {sources.map((s) => (
          <li key={s.url} className="text-[0.88rem]">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body hover:text-orange700 focusable"
            >
              {s.titre} <span className="text-slate">({domain(s.url)})</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    if (process.env.NODE_ENV !== "production") {
      return (
        <p className="border border-dashed border-slate text-slate text-[0.85rem] p-4 rounded-xl">
          SourcesBlock : aucune source fournie (développement uniquement).
        </p>
      );
    }
    return null;
  }

  return (
    <div className="rounded-2xl bg-cream p-6 lg:p-7">
      <p className="kicker text-orange700 mb-3">{title}</p>
      <ol className="space-y-2 text-[0.88rem]">
        {sources.map((s) => (
          <li key={s.url} className="break-words">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body underline decoration-line underline-offset-2 hover:text-orange700 hover:decoration-orange700 focusable"
            >
              {s.titre}
              <span className="sr-only"> (nouvel onglet)</span>
            </a>{" "}
            <span className="text-slate">({domain(s.url)})</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

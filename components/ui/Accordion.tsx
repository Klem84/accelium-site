export type FaqItem = { question: string; reponse: string };

/* Composant serveur : details/summary natifs, aucun JS client. */
export function Accordion({ items }: { items: FaqItem[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <details key={i} className="group" open={i === 0}>
          <summary className="flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left focusable [&::-webkit-details-marker]:hidden">
            <h3 className="display text-[1.15rem] font-500 text-ink">{it.question}</h3>
            <span
              className="shrink-0 text-orange700 text-2xl transition-transform group-open:rotate-45"
              aria-hidden="true"
            >
              +
            </span>
          </summary>
          <p className="pb-6 text-body leading-relaxed measure">{it.reponse}</p>
        </details>
      ))}
    </div>
  );
}

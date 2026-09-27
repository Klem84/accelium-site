import type { FicheDecryptage } from "@/config/fiches-decryptage";

// Carte d'une fiche de décryptage, calquée sur la BlogCard (image, label,
// titre, courte explication) pour cohabiter sans rupture dans la grille du blog.
// Le clic télécharge directement le PDF.
export function FicheCard({ fiche }: { fiche: FicheDecryptage }) {
  return (
    <a
      href={fiche.fichier}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col rounded-2xl overflow-hidden border border-line bg-surface hover:border-ink transition-colors focusable h-full"
    >
      <div className="photo aspect-[16/9]">
        <img src={fiche.image} alt="" loading="lazy" decoding="async" className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex flex-col flex-1">
        <span className="kicker text-orange700">Décryptage</span>
        <h3 className="display text-[1.25rem] font-600 text-ink group-hover:text-orange700 mt-2 leading-tight">
          {fiche.titre}
        </h3>
        <p className="mt-2 text-[0.92rem] text-body flex-1">{fiche.description}</p>
        <p className="mt-4 text-[0.8rem] text-slate">
          {fiche.financeur} · Télécharger le PDF
        </p>
      </div>
    </a>
  );
}

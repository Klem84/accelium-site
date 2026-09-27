import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata(
  {
    title: "Page introuvable",
    description: "Cette page n'existe pas ou a été déplacée. Retrouvez nos offres, nos secteurs et le financement public.",
    noindex: true,
  },
  "/404"
);

const liens = [
  { label: "Nos offres", href: "/offres" },
  { label: "Nos secteurs", href: "/secteurs" },
  { label: "Le financement public", href: "/le-financement-public" },
];

export default function NotFound() {
  return (
    <section className="wrap py-28 lg:py-40 text-center">
      <p className="kicker text-orange700 mb-6">Erreur 404</p>
      <h1 className="display h-sec font-600 text-ink max-w-[26ch] mx-auto">
        Cette page n&rsquo;existe pas ou a été déplacée
      </h1>
      <p className="lede text-body max-w-[42ch] mx-auto mt-6">
        Le site a été entièrement refondu en 2026 : certaines anciennes adresses ne sont plus valides.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        {liens.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem]"
          >
            {l.label}
          </a>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
        <Button href="/contact" variant="primary" arrow>
          Demander un diagnostic gratuit
        </Button>
        <a href={`tel:${site.contact.telHref}`} className="btn-ghost focusable rounded-full px-7 py-4 text-[1rem]">
          {site.contact.tel}
        </a>
      </div>
    </section>
  );
}

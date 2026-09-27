import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/blocks/PageHero";
import { CtaBlock } from "@/components/blocks/CtaBlock";
import { getPage, getPages } from "@/lib/content";
import { buildMetadata } from "@/lib/seo";
import { typesAides, typesOrder, type Section } from "@/lib/typesAides";
import {
  IconGift,
  IconRefund,
  IconPercent,
  IconShield,
  IconTag,
  IconCheck,
  IconLever,
} from "@/components/blocks/Icons";

const PREFIX = "types-d-aides-";

const icons: Record<string, (p: { className?: string }) => JSX.Element> = {
  gift: IconGift,
  refund: IconRefund,
  percent: IconPercent,
  shield: IconShield,
  tag: IconTag,
};

export function generateStaticParams() {
  return getPages()
    .filter((p) => p.slug.startsWith(PREFIX))
    .map((p) => ({ slug: p.slug.replace(PREFIX, "") }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = getPage(PREFIX + params.slug);
  if (!p) return {};
  return buildMetadata(p.seo, `/le-financement-public/types-d-aides/${params.slug}`);
}

/* ── Rendu d'un bloc de contenu selon son type ── */
function SectionBlock({ section }: { section: Section }) {
  if (section.kind === "cards") {
    return (
      <div>
        <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink">{section.titre}</h2>
        <div
          className={
            "mt-7 grid gap-5 " + (section.items.length >= 3 ? "md:grid-cols-3" : "md:grid-cols-2")
          }
        >
          {section.items.map((it) => (
            <div key={it.titre} className="rounded-2xl border border-line bg-surface p-7">
              <h3 className="display text-[1.2rem] font-600 text-ink">{it.titre}</h3>
              <p className="mt-3 text-[0.95rem] text-body leading-relaxed">{it.desc}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (section.kind === "checklist") {
    return (
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
        <h2 className="lg:col-span-4 display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink">
          {section.titre}
        </h2>
        <ul className="lg:col-span-8 space-y-4">
          {section.items.map((it, i) => (
            <li key={i} className="flex items-start gap-4 border-b border-line pb-4 last:border-0">
              <span className="mt-0.5 inline-flex shrink-0 w-7 h-7 items-center justify-center rounded-full bg-orange/10 text-orange700">
                <IconCheck className="w-4 h-4" />
              </span>
              <span className="text-[0.98rem] text-body leading-relaxed">{it}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (section.kind === "process") {
    return (
      <div>
        <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink">{section.titre}</h2>
        <ol className="mt-7 grid md:grid-cols-3 gap-5">
          {section.items.map((it, i) => (
            <li key={i} className="relative rounded-2xl bg-cream border border-line p-7">
              <span className="display text-[2.4rem] font-600 text-orange/30 leading-none">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[0.95rem] text-body leading-relaxed">{it}</p>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  if (section.kind === "dispositifs") {
    return (
      <div>
        <h2 className="display text-[1.6rem] lg:text-[1.9rem] font-600 text-ink">{section.titre}</h2>
        <div className="mt-7 space-y-4">
          {section.items.map((it) => (
            <div
              key={it.code}
              className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-7 rounded-2xl border border-line bg-surface p-6 lg:p-7"
            >
              <span className="display text-[1.4rem] font-600 text-white bg-ink rounded-xl px-5 py-3 shrink-0 self-start">
                {it.code}
              </span>
              <div>
                <h3 className="display text-[1.15rem] font-600 text-ink">{it.nom}</h3>
                <p className="mt-1.5 text-[0.95rem] text-body leading-relaxed">{it.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // callout
  return (
    <div className="rounded-3xl bg-cream border border-line p-8 lg:p-10">
      <p className="kicker text-orange700 mb-3">{section.titre}</p>
      <p className="text-[1.05rem] text-slateD leading-relaxed">{section.text}</p>
    </div>
  );
}

export default function TypeAidePage({ params }: { params: { slug: string } }) {
  const p = getPage(PREFIX + params.slug);
  const data = typesAides[params.slug];
  if (!p || !data) notFound();

  const Icon = icons[data.iconKey] || IconGift;
  const autres = typesOrder.filter((s) => s !== data.slug).map((s) => typesAides[s]);

  return (
    <>
      <PageHero
        kicker="Type d'aide"
        title={p.h1}
        intro={p.intro}
        crumbs={[
          { name: "Le financement public", url: "/le-financement-public" },
          { name: "Types d'aides", url: "/le-financement-public/types-d-aides" },
          { name: p.titre, url: `/le-financement-public/types-d-aides/${params.slug}` },
        ]}
      />

      {/* ===== EN BREF : chiffre clé + définition ===== */}
      <section className="wrap py-16 lg:py-24">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          <div className="lg:col-span-5">
            <div className="relative rounded-3xl bg-ink text-white p-8 lg:p-10 overflow-hidden">
              <span className="absolute -top-10 -right-6 opacity-[0.07]">
                <Icon className="w-44 h-44" />
              </span>
              <Icon className="w-10 h-10 text-orange2" />
              <div className="mt-6 display text-[clamp(2rem,1.4rem+2.4vw,3.2rem)] font-600 leading-none text-orange2">
                {data.figure.value}
              </div>
              <p className="mt-3 text-white/75 leading-relaxed text-[0.96rem]">{data.figure.label}</p>
              <ul className="mt-7 flex flex-wrap gap-2">
                {data.enBref.map((b) => (
                  <li
                    key={b}
                    className="inline-flex rounded-full bg-white/10 px-3 py-1.5 text-[0.8rem] font-500 text-white/90"
                  >
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:col-span-7">
            <p className="kicker text-orange700 mb-4">En bref</p>
            <p className="lede text-body leading-relaxed">{data.definition}</p>
          </div>
        </div>
      </section>

      {/* ===== SECTIONS DE CONTENU ===== */}
      <section className="wrap pb-8 lg:pb-12">
        <div className="space-y-16 lg:space-y-24">
          {data.sections.map((s, i) => (
            <SectionBlock key={i} section={s} />
          ))}
        </div>
      </section>

      {/* ===== NOTRE RÔLE ===== */}
      <section className="bg-ink text-white">
        <div className="wrap py-20 lg:py-28">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-4">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange/15 text-orange2">
                <IconLever className="w-6 h-6" />
              </span>
              <p className="kicker text-orange2 mt-5 mb-4">Notre rôle</p>
              <h2 className="display text-[1.8rem] lg:text-[2.2rem] font-600 leading-tight">
                {data.nom}, sécurisées jusqu'au dernier euro.
              </h2>
            </div>
            <div className="lg:col-span-8 lg:pt-2">
              <p className="text-[1.08rem] text-white/80 leading-relaxed">{data.role}</p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={data.roleCta?.href || "/contact"}
                  className="btn-primary focusable rounded-full px-7 py-4 text-[1rem]"
                >
                  {data.roleCta?.label || "Obtenir mon diagnostic gratuit"}
                </Link>
                <Link
                  href="/le-financement-public"
                  className="btn-ghost-d focusable rounded-full px-7 py-4 text-[1rem]"
                >
                  Comprendre le financement public
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LES AUTRES TYPES ===== */}
      <section className="wrap py-20 lg:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
          <h2 className="display h-sec font-600 text-ink max-w-[20ch]">Les autres formes d'aide</h2>
          <Link
            href="/le-financement-public/types-d-aides"
            className="btn-ghost focusable rounded-full px-6 py-3 text-[0.92rem]"
          >
            Voir les 5 types
          </Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {autres.map((t) => {
            const TIcon = icons[t.iconKey] || IconGift;
            return (
              <Link
                key={t.slug}
                href={`/le-financement-public/types-d-aides/${t.slug}`}
                className="group rounded-2xl border border-line bg-surface p-6 hover:border-ink hover:shadow-soft transition-all focusable"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-cream text-orange700 group-hover:bg-orange group-hover:text-white transition-colors">
                  <TIcon className="w-6 h-6" />
                </span>
                <h3 className="display text-[1.1rem] font-600 text-ink mt-4 group-hover:text-orange700 transition-colors">
                  {t.nom}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1 text-orange700 text-sm font-600">
                  Découvrir <span className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <CtaBlock />
    </>
  );
}

import Link from "next/link";
import Image from "next/image";
import { footerNav, legalNav } from "@/config/nav";
import { site } from "@/config/site";
import { IconPhone } from "@/components/blocks/Icons";

export default function Footer() {
  const cols = [footerNav.comprendre, footerNav.secteurs, footerNav.offres, footerNav.ressources, footerNav.cabinet];
  return (
    <footer className="cv-auto bg-ink text-white border-t border-white/10">
      <div className="wrap py-16">
        <div className="grid lg:grid-cols-12 gap-10">
          <div className="lg:col-span-3">
            <Image
              src="/assets/logo-horizontal-blanc.png"
              alt="Accelium Conseil"
              width={180}
              height={40}
              className="h-9 w-auto"
            />
            <p className="mt-5 text-[0.92rem] text-white/65 measure">
              Accélère l'obtention de vos financements publics. Conseil en financements publics de
              l'innovation et de la croissance.
            </p>
            <p className="mt-5 text-[0.9rem] text-white/70">
              Interventions dans toute la France
              <br />
              Siège : {site.contact.adresse}
            </p>
            <ul className="mt-4 space-y-2 text-[0.9rem]">
              <li>
                <a
                  href={`tel:${site.contact.telHref}`}
                  className="inline-flex items-center gap-2 text-white/70 hover:text-orange2 focusable"
                >
                  <IconPhone className="w-4 h-4 shrink-0" />
                  {site.contact.tel}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${site.contact.email}`}
                  className="focusable hover:underline"
                  style={{ color: "#C9D1E0" }}
                >
                  {site.contact.email}
                </a>
              </li>
            </ul>
            <p className="mt-4 text-[0.84rem] text-white/70">{site.contact.horaires}</p>
          </div>

          <div className="lg:col-span-9 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
            {cols.map((col) => (
              <nav key={col.title} aria-label={col.title}>
                <h3 className="text-[0.78rem] font-600 uppercase tracking-wider text-white/70">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[0.92rem] text-white/70">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-orange2 focusable">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/12 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.84rem] text-white/70">
          <p>© {new Date().getFullYear()} Accelium Conseil. Tous droits réservés.</p>
          <div className="flex flex-wrap items-center gap-5">
            {legalNav.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-orange2 focusable">
                {l.label}
              </Link>
            ))}
            <a href={site.contact.linkedin} className="hover:text-orange2 focusable" target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

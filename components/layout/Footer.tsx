import Link from "next/link";
import Image from "next/image";
import { footerNav, legalNav } from "@/config/nav";
import { site } from "@/config/site";

export default function Footer() {
  const cols = [footerNav.offres, footerNav.ressources, footerNav.cabinet];
  return (
    <footer className="bg-ink text-white border-t border-white/10">
      <div className="wrap py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-4">
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
            <p className="mt-5 text-[0.9rem] text-white/55">
              {site.contact.adresse}
              <br />
              {site.contact.tel} · {site.contact.email}
            </p>
          </div>

          {cols.map((col, i) => (
            <nav key={col.title} className={"lg:col-span-2" + (i === 0 ? " lg:col-start-7" : "")} aria-label={col.title}>
              <h3 className="text-[0.78rem] font-600 uppercase tracking-wider text-white/45">{col.title}</h3>
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

        <div className="mt-12 pt-6 border-t border-white/12 flex flex-col md:flex-row items-center justify-between gap-4 text-[0.84rem] text-white/50">
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

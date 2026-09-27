"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/nav";
import { site } from "@/config/site";

export default function Header() {
  const pathname = usePathname();
  const transparentOverHero = pathname === "/";
  const [solid, setSolid] = useState(!transparentOverHero);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!transparentOverHero) {
      setSolid(true);
      return;
    }
    const onScroll = () => setSolid(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [transparentOverHero]);

  // ferme menus à la navigation
  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [pathname]);

  // verrouille le scroll quand le menu mobile est ouvert
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const onText = solid ? "text-ink" : "text-white";

  const hover = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  };
  const leave = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpenMenu(null), 120);
  };

  return (
    <header
      className={
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 " +
        (solid ? "bg-white/90 backdrop-blur-md shadow-sm border-b border-line" : "")
      }
    >
      <div className="mx-auto w-full max-w-[1280px] xl:max-w-[1600px] 2xl:max-w-[1840px] px-5 lg:px-8">
        <div className="flex items-center justify-between h-[68px] md:h-[80px] lg:h-[96px]">
          <Link href="/" className="flex items-center focusable" aria-label="Accelium Conseil — accueil">
            <Image
              src={solid ? "/assets/logo-horizontal-bleu.png" : "/assets/logo-horizontal-blanc.png"}
              alt="Accelium Conseil"
              width={200}
              height={48}
              priority
              className="h-8 md:h-10 lg:h-12 w-auto"
            />
          </Link>

          {/* Nav desktop */}
          <nav className="hidden lg:flex items-center gap-8 text-[1.02rem] font-medium" aria-label="Navigation principale">
            {mainNav.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && hover(item.label)}
                onMouseLeave={leave}
              >
                <Link
                  href={item.href}
                  className={"nav-link focusable " + onText}
                  aria-haspopup={item.children ? "true" : undefined}
                  aria-expanded={item.children ? openMenu === item.label : undefined}
                  onFocus={() => item.children && hover(item.label)}
                >
                  {item.label}
                </Link>
                {item.children && openMenu === item.label && (
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-full pt-4"
                    onMouseEnter={() => hover(item.label)}
                    onMouseLeave={leave}
                  >
                    <div className="min-w-[320px] bg-white rounded-2xl shadow-soft border border-line p-3">
                      <ul className="flex flex-col">
                        {item.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              className="block rounded-xl px-4 py-3 hover:bg-cream focusable"
                            >
                              <span className="block text-[0.98rem] font-600 text-ink">{c.label}</span>
                              {c.description && (
                                <span className="block text-[0.85rem] text-body mt-0.5">{c.description}</span>
                              )}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-5">
            <Link href="/contact" className="btn-primary focusable rounded-full px-6 py-3 text-[0.98rem]">
              Diagnostic gratuit
            </Link>
          </div>

          {/* Burger mobile */}
          <button
            className="lg:hidden inline-flex flex-col gap-[5px] p-2 focusable"
            aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className={"block h-[2px] w-6 " + (solid || mobileOpen ? "bg-ink" : "bg-white")} />
            <span className={"block h-[2px] w-6 " + (solid || mobileOpen ? "bg-ink" : "bg-white")} />
            <span className={"block h-[2px] w-6 " + (solid || mobileOpen ? "bg-ink" : "bg-white")} />
          </button>
        </div>
      </div>

      {/* Menu mobile */}
      {mobileOpen && (
        <div id="mobile-menu" className="lg:hidden bg-white border-t border-line max-h-[calc(100vh-68px)] overflow-y-auto">
          <nav className="wrap py-4 flex flex-col gap-1 text-ink" aria-label="Navigation mobile">
            {mainNav.map((item) => (
              <div key={item.label} className="border-b border-line/60 py-1">
                <Link href={item.href} className="block py-2.5 font-600 focusable">
                  {item.label}
                </Link>
                {item.children && (
                  <ul className="pb-2 pl-3 flex flex-col">
                    {item.children.map((c) => (
                      <li key={c.href}>
                        <Link href={c.href} className="block py-2 text-[0.95rem] text-body focusable">
                          {c.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            <Link
              href="/contact"
              className="btn-primary focusable rounded-full px-5 py-3 mt-3 text-center"
            >
              {site.cta.label}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/* Animations d'interface (reveals, compteurs, parallaxe, défilement lissé).
   Elles ne sont activées que sur grand écran avec pointeur précis (bureau) et sans
   prefers-reduced-motion : sur mobile et tablette tactile, le contenu s'affiche tel que
   rendu côté serveur, sans aucun état masqué ni JS d'animation (gain LCP/TBT, Lighthouse).
   L'initialisation est différée à une période d'inactivité du navigateur. Les règles CSS
   correspondantes sont sous la même media query dans globals.css. */
const FX_QUERY = "(min-width: 1024px) and (hover: hover) and (prefers-reduced-motion: no-preference)";

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (!window.matchMedia(FX_QUERY).matches) return;

    const root = document.documentElement;
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    const init = () => {
      if (cancelled) return;
      root.classList.add("js");

      // ── Lenis smooth scroll ──
      let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
      let rafId = 0;
      import("lenis")
        .then(({ default: Lenis }) => {
          if (cancelled) return;
          lenis = new Lenis({
            // Vitesse de défilement naturelle (vitesse 1) : lissage léger par lerp,
            // sans durée imposée qui ralentirait la molette.
            lerp: 0.2,
            wheelMultiplier: 1,
            smoothWheel: true,
          });
          const raf = (t: number) => {
            lenis?.raf(t);
            rafId = requestAnimationFrame(raf);
          };
          rafId = requestAnimationFrame(raf);
        })
        .catch(() => {});

      // ── Reveals + stagger (un seul IntersectionObserver) ──
      const revealEls = Array.from(
        document.querySelectorAll<HTMLElement>(".reveal,.clip,[data-stagger]")
      );
      let io: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window) {
        io = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                e.target.classList.add("in");
                io?.unobserve(e.target);
              }
            });
          },
          { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
        );
        revealEls.forEach((el) => io?.observe(el));
        document.querySelectorAll<HTMLElement>("[data-stagger]").forEach((g) => {
          Array.from(g.children).forEach((c, i) => {
            (c as HTMLElement).style.transitionDelay = i * 70 + "ms";
          });
        });
        document
          .querySelectorAll("main > section:first-child .clip, main > section:first-child .reveal")
          .forEach((el) => el.classList.add("in"));
      } else {
        revealEls.forEach((el) => el.classList.add("in"));
      }

      // ── Parallaxe ──
      const px = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
      let ticking = false;
      const updateParallax = () => {
        px.forEach((el) => {
          const r = el.getBoundingClientRect();
          const speed = parseFloat(el.dataset.parallax || "0.15");
          const off = r.top + r.height / 2 - window.innerHeight / 2;
          el.style.transform = "translateY(" + -off * speed + "px)";
        });
        ticking = false;
      };
      const onScrollPx = () => {
        if (!ticking) {
          requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };
      if (px.length) {
        window.addEventListener("scroll", onScrollPx, { passive: true });
        updateParallax();
      }

      // ── Compteurs ──
      // La valeur finale (avec son suffixe éventuel, ex. « 130+ ») est déjà dans le
      // HTML rendu côté serveur (J.1.6) : on anime depuis 0 jusqu'à cette valeur, en
      // conservant tout ce qui suit le nombre (« + », « M€ »…).
      const countUp = (el: HTMLElement) => {
        const target = Number(el.dataset.count || "0");
        const suffix = (el.textContent || "").replace(/^-?\d+/, "");
        const dur = 1600;
        const t0 = performance.now();
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          el.textContent = Math.round((1 - Math.pow(1 - p, 3)) * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };
      let cio: IntersectionObserver | null = null;
      if ("IntersectionObserver" in window) {
        cio = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) {
                countUp(e.target as HTMLElement);
                cio?.unobserve(e.target);
              }
            });
          },
          { threshold: 0.6 }
        );
        document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio?.observe(el));
      }

      cleanup = () => {
        io?.disconnect();
        cio?.disconnect();
        window.removeEventListener("scroll", onScrollPx);
        if (rafId) cancelAnimationFrame(rafId);
        lenis?.destroy();
      };
    };

    const hasIdle = "requestIdleCallback" in window;
    const handle = hasIdle
      ? window.requestIdleCallback(init, { timeout: 1200 })
      : window.setTimeout(init, 200);

    return () => {
      cancelled = true;
      if (hasIdle) window.cancelIdleCallback(handle);
      else window.clearTimeout(handle);
      cleanup?.();
    };
  }, [pathname]);

  return null;
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function MotionProvider() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("js");

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ── Lenis smooth scroll ──
    let lenis: { raf: (t: number) => void; destroy: () => void } | null = null;
    let rafId = 0;
    if (!reduce) {
      import("lenis")
        .then(({ default: Lenis }) => {
          lenis = new Lenis({
            duration: 0.55,
            wheelMultiplier: 2,
            smoothWheel: true,
            touchMultiplier: 2.2,
          });
          const raf = (t: number) => {
            lenis?.raf(t);
            rafId = requestAnimationFrame(raf);
          };
          rafId = requestAnimationFrame(raf);
        })
        .catch(() => {});
    }

    // ── Reveals + stagger ──
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal,.clip,[data-stagger]")
    );
    let io: IntersectionObserver | null = null;
    if (!reduce && "IntersectionObserver" in window) {
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
      // hero : déclenche immédiatement les anims de la 1ère section
      requestAnimationFrame(() => {
        document
          .querySelectorAll(
            "main > section:first-child .clip, main > section:first-child .reveal"
          )
          .forEach((el) => el.classList.add("in"));
      });
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
    if (!reduce && px.length) {
      window.addEventListener("scroll", onScrollPx, { passive: true });
      updateParallax();
    }

    // ── Compteurs ──
    const countUp = (el: HTMLElement) => {
      const target = Number(el.dataset.count || "0");
      if (reduce) {
        el.textContent = String(target);
        return;
      }
      const dur = 1600;
      const t0 = performance.now();
      const tick = (now: number) => {
        const p = Math.min((now - t0) / dur, 1);
        el.textContent = String(Math.round((1 - Math.pow(1 - p, 3)) * target));
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
    } else {
      document
        .querySelectorAll<HTMLElement>("[data-count]")
        .forEach((el) => (el.textContent = el.dataset.count || ""));
    }

    return () => {
      io?.disconnect();
      cio?.disconnect();
      window.removeEventListener("scroll", onScrollPx);
      if (rafId) cancelAnimationFrame(rafId);
      lenis?.destroy();
    };
  }, [pathname]);

  return null;
}

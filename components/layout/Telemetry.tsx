"use client";

import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

/* Mesure d'audience et Web Vitals : montés seulement une fois la page chargée et le
   navigateur au repos, pour ne pas concurrencer le rendu initial (LCP, TBT). */
export default function Telemetry() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const go = () =>
      "requestIdleCallback" in window
        ? window.requestIdleCallback(() => setReady(true), { timeout: 4000 })
        : setTimeout(() => setReady(true), 2000);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  if (!ready) return null;
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}

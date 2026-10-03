"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

/* Mesure d'audience et Web Vitals : le code n'est même pas téléchargé avant que la page
   soit chargée et le navigateur au repos (import dynamique), pour ne pas alourdir le
   JS initial ni concurrencer le rendu (LCP, TBT). */
const Analytics = dynamic(() => import("@vercel/analytics/react").then((m) => m.Analytics), { ssr: false });
const SpeedInsights = dynamic(() => import("@vercel/speed-insights/next").then((m) => m.SpeedInsights), {
  ssr: false,
});

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

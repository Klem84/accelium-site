/**
 * Limiteur de débit des routes API (fenêtre fixe : 5 requêtes / 60 s / IP / route).
 *
 * - Si KV_REST_API_URL et KV_REST_API_TOKEN sont présentes (base Upstash Redis créée via
 *   Vercel > Storage, offre gratuite), le compteur est partagé entre toutes les instances
 *   serverless, via l'API REST Upstash (fetch, aucune dépendance).
 * - Sinon, ou si Upstash est injoignable, repli sur un compteur en mémoire (par instance :
 *   simple première barrière, voir docs/go-live.md pour l'activer pour de bon).
 */

const WINDOW_S = 60;
const MAX = 5;

const hits = new Map<string, { count: number; ts: number }>();

function limiteMemoire(key: string): boolean {
  const now = Date.now();
  const rec = hits.get(key);
  if (!rec || now - rec.ts > WINDOW_S * 1000) {
    hits.set(key, { count: 1, ts: now });
    // Évite que la Map grossisse indéfiniment sur une instance longue.
    if (hits.size > 5000) {
      hits.forEach((v, k) => {
        if (now - v.ts > WINDOW_S * 1000) hits.delete(k);
      });
    }
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export function ratelimitDistribue(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

async function limiteUpstash(key: string): Promise<boolean | null> {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const res = await fetch(`${url.replace(/\/$/, "")}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, WINDOW_S, "NX"],
      ]),
      cache: "no-store",
      signal: AbortSignal.timeout(1500),
    });
    if (!res.ok) return null;
    const out = (await res.json()) as { result?: unknown }[];
    const count = Number(out?.[0]?.result);
    if (!Number.isFinite(count)) return null;
    return count > MAX;
  } catch {
    return null;
  }
}

/** Renvoie true si la requête dépasse la limite (à refuser en 429). */
export async function isRateLimited(route: string, ip: string): Promise<boolean> {
  const key = `rl:${route}:${ip}`;
  const distant = await limiteUpstash(key);
  if (distant !== null) return distant;
  return limiteMemoire(key);
}

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

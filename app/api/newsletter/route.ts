import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";
import { isNewsletterConfigured, sendNewsletterConfirmationEmail } from "@/lib/newsletter";

export const runtime = "nodejs";

// Rate-limiting basique en mémoire : 5 requêtes / 60 s / IP (même limite best-effort que
// /api/diagnostic et /api/livre-blanc, cf. commentaire détaillé dans app/api/diagnostic/route.ts).
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW = 60_000;
const MAX = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Trop de demandes. Merci de réessayer dans une minute." },
      { status: 429 }
    );
  }

  // Fiche L8.6 : si NEWSLETTER_SECRET ou RESEND_AUDIENCE_ID manquent, le flux double opt-in
  // ne peut pas fonctionner (pas de lien signé possible, pas d'audience où ajouter le contact).
  // On le signale proprement au lieu de faire semblant d'avoir inscrit quelqu'un.
  if (!isNewsletterConfigured()) {
    console.warn("[newsletter] NEWSLETTER_SECRET ou RESEND_AUDIENCE_ID manquant : inscription indisponible.");
    return NextResponse.json(
      {
        ok: false,
        error: "L'inscription à la newsletter n'est pas encore activée. Merci de réessayer plus tard.",
      },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ ok: false, error: "Formulaire incomplet.", fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  // Honeypot : si rempli, on simule un succès silencieux (bot).
  if (data.website) {
    return NextResponse.json({ ok: true });
  }

  // Anti-bot Turnstile
  const human = await verifyTurnstile(data.turnstileToken, ip);
  if (!human) {
    return NextResponse.json(
      { ok: false, error: "Vérification anti-spam échouée. Merci de réessayer." },
      { status: 403 }
    );
  }

  // Origine du déploiement qui sert le formulaire (preview → lien preview, prod → lien prod).
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const baseUrl = host ? `${proto}://${host}` : undefined;

  try {
    await sendNewsletterConfirmationEmail(data.email, baseUrl);
  } catch (e) {
    console.error("[newsletter] envoi de l'email de confirmation échoué:", e);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous appeler." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

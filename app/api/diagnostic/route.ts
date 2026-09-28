import { NextRequest, NextResponse } from "next/server";
import { diagnosticSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";
import { sendLeadEmails, sendMondayFailureAlert } from "@/lib/resend";
import { createLead } from "@/lib/monday";

export const runtime = "nodejs";

// Rate-limiting basique en mémoire : 5 requêtes / 60 s / IP (fiche H4 / L2.7).
// Limite connue : sur Vercel serverless, chaque instance a sa propre Map, donc ce
// limiteur n'est qu'une première barrière (best-effort), pas une garantie globale.
// Règle Vercel WAF équivalente à activer en complément (aucun service payant requis,
// incluse dans le plan Vercel) : Project Settings > Firewall > Rate Limiting >
// règle "Rate Limit" sur le chemin /api/diagnostic, clé = IP, seuil 5 requêtes / 60 s,
// action = "Deny" (ou "Challenge" si des faux positifs apparaissent).
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

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Requête invalide." }, { status: 400 });
  }

  const parsed = diagnosticSchema.safeParse(body);
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

  const isoDate = new Date().toISOString();

  // Ordre imposé (fiche H4 / L2.7) : Monday (CRM) d'abord, puis Resend (notifications).
  // Monday — non bloquant, mais alerté par email interne s'il échoue pour ne jamais perdre
  // silencieusement un lead côté CRM.
  try {
    const result = await createLead(data, isoDate, data.origine || undefined);
    if (!result.ok) {
      await sendMondayFailureAlert("Diagnostic gratuit", { ...data, isoDate });
    }
  } catch (e) {
    console.error("[diagnostic] création Monday échouée:", e);
    await sendMondayFailureAlert("Diagnostic gratuit (exception)", { ...data, isoDate });
  }

  // Email (notification interne + confirmation au prospect) — bloquant
  try {
    await sendLeadEmails(data);
  } catch (e) {
    console.error("[diagnostic] envoi email échoué:", e);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous appeler." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

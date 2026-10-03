import { NextRequest, NextResponse } from "next/server";
import { livreBlancSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/ratelimit";
import { sendLivreBlancEmails, sendMondayFailureAlert } from "@/lib/resend";
import { createLeadLivreBlanc } from "@/lib/monday";
import { getLivreBlanc } from "@/config/livres-blancs";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (await isRateLimited("livre-blanc", ip)) {
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

  const parsed = livreBlancSchema.safeParse(body);
  if (!parsed.success) {
    const fieldErrors = parsed.error.flatten().fieldErrors;
    return NextResponse.json({ ok: false, error: "Formulaire incomplet.", fieldErrors }, { status: 422 });
  }
  const data = parsed.data;

  const livre = getLivreBlanc(data.livreBlanc);
  if (!livre) {
    return NextResponse.json({ ok: false, error: "Document introuvable." }, { status: 404 });
  }

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

  // Origine du déploiement qui sert le formulaire (preview → lien preview, prod → lien prod).
  const proto = req.headers.get("x-forwarded-proto") || "https";
  const host = req.headers.get("x-forwarded-host") || req.headers.get("host");
  const baseUrl = host ? `${proto}://${host}` : undefined;

  // Ordre imposé (fiche H4 / L2.7) : Monday (CRM) d'abord, puis Resend (envoi du document).
  try {
    const result = await createLeadLivreBlanc(data, livre.titre, isoDate);
    if (!result.ok) {
      await sendMondayFailureAlert(`Livre blanc — ${livre.titre}`, { ...data, isoDate });
    }
  } catch (e) {
    console.error("[livre-blanc] création Monday échouée:", e);
    await sendMondayFailureAlert(`Livre blanc — ${livre.titre} (exception)`, { ...data, isoDate });
  }

  // Email (avec le lien de téléchargement) — bloquant
  try {
    await sendLivreBlancEmails(data, livre, baseUrl);
  } catch (e) {
    console.error("[livre-blanc] envoi email échoué:", e);
    return NextResponse.json(
      { ok: false, error: "Une erreur est survenue lors de l'envoi. Merci de réessayer ou de nous appeler." },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}

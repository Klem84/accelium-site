import { NextRequest, NextResponse } from "next/server";
import { diagnosticSchema } from "@/lib/validation";
import { verifyTurnstile } from "@/lib/turnstile";
import { isRateLimited } from "@/lib/ratelimit";
import { sendLeadEmails, sendMondayFailureAlert } from "@/lib/resend";
import { createLead } from "@/lib/monday";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (await isRateLimited("diagnostic", ip)) {
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

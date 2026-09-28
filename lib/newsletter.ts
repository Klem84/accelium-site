import crypto from "node:crypto";
import { Resend } from "resend";
import { site } from "@/config/site";

// Fiche L8.6 : inscription newsletter en double opt-in.
// - NEWSLETTER_SECRET signe les liens de confirmation et de désinscription (HMAC, sans état
//   serveur à conserver : le jeton porte lui-même l'email, l'intention et l'expiration).
// - RESEND_AUDIENCE_ID est l'audience Resend dans laquelle les contacts confirmés sont ajoutés.
// Si l'une des deux variables manque, le formulaire affiche une erreur propre (voir
// isNewsletterConfigured) et n'appelle jamais l'API Resend : aucune audience ni ressource
// n'est créée automatiquement (cf. docs/newsletter.md pour la procédure manuelle de Clément).
const SECRET = process.env.NEWSLETTER_SECRET;
const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID;
const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || `Accelium Conseil <contact@accelium-conseil.fr>`;

const resend = apiKey ? new Resend(apiKey) : null;

const SEVEN_DAYS_SECONDS = 7 * 24 * 60 * 60;

export type NewsletterTokenPurpose = "confirmation" | "desinscription";

type NewsletterTokenPayload = {
  email: string;
  purpose: NewsletterTokenPurpose;
  exp: number; // horodatage Unix (secondes) d'expiration
};

/** true si les deux variables nécessaires au flux newsletter sont définies. */
export function isNewsletterConfigured(): boolean {
  return Boolean(SECRET && AUDIENCE_ID);
}

function base64url(input: string): string {
  return Buffer.from(input, "utf8").toString("base64url");
}

function fromBase64url(input: string): string {
  return Buffer.from(input, "base64url").toString("utf8");
}

function sign(payload: string): string {
  // SECRET est garanti défini par les appelants (isNewsletterConfigured vérifié avant).
  return crypto.createHmac("sha256", SECRET as string).update(payload).digest("base64url");
}

/**
 * Crée un jeton signé HMAC (email + intention + expiration à 7 jours) pour les liens de
 * confirmation et de désinscription envoyés par email. Ne lève pas si SECRET est absent :
 * l'appelant doit vérifier isNewsletterConfigured() avant d'appeler cette fonction.
 */
export function createNewsletterToken(email: string, purpose: NewsletterTokenPurpose): string {
  const payload: NewsletterTokenPayload = {
    email: email.trim().toLowerCase(),
    purpose,
    exp: Math.floor(Date.now() / 1000) + SEVEN_DAYS_SECONDS,
  };
  const encoded = base64url(JSON.stringify(payload));
  const signature = sign(encoded);
  return `${encoded}.${signature}`;
}

export type NewsletterTokenResult =
  | { ok: true; email: string; purpose: NewsletterTokenPurpose }
  | { ok: false; reason: "invalide" | "expire" | "non-configure" };

/** Vérifie la signature et l'expiration d'un jeton créé par createNewsletterToken. */
export function verifyNewsletterToken(
  token: string | null | undefined,
  expectedPurpose: NewsletterTokenPurpose
): NewsletterTokenResult {
  if (!SECRET) return { ok: false, reason: "non-configure" };
  if (!token || !token.includes(".")) return { ok: false, reason: "invalide" };

  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return { ok: false, reason: "invalide" };

  const expected = sign(encoded);
  const sigBuf = Buffer.from(signature);
  const expectedBuf = Buffer.from(expected);
  if (sigBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(sigBuf, expectedBuf)) {
    return { ok: false, reason: "invalide" };
  }

  let payload: NewsletterTokenPayload;
  try {
    payload = JSON.parse(fromBase64url(encoded));
  } catch {
    return { ok: false, reason: "invalide" };
  }

  if (payload.purpose !== expectedPurpose) return { ok: false, reason: "invalide" };
  if (typeof payload.exp !== "number" || Date.now() / 1000 > payload.exp) {
    return { ok: false, reason: "expire" };
  }

  return { ok: true, email: payload.email, purpose: payload.purpose };
}

function esc(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Envoie l'email de confirmation (double opt-in) avec le lien signé. Ne fait rien si Resend n'est pas configuré. */
export async function sendNewsletterConfirmationEmail(
  email: string,
  baseUrl?: string
): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY manquant : email de confirmation newsletter simulé (mock).");
    return { ok: true, skipped: true };
  }

  const token = createNewsletterToken(email, "confirmation");
  const lien = `${(baseUrl || site.url).replace(/\/$/, "")}/newsletter/confirmation?token=${encodeURIComponent(
    token
  )}`;

  const html = `
  <div style="font-family:system-ui,sans-serif;color:#1B2336">
    <h2 style="color:#F26122">Confirmez votre inscription à la newsletter</h2>
    <p>Merci de votre intérêt pour la newsletter d'Accelium Conseil. Pour confirmer votre inscription,
    cliquez sur le lien ci-dessous :</p>
    <p style="margin:24px 0">
      <a href="${lien}" style="display:inline-block;background:#F26122;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600">Confirmer mon inscription</a>
    </p>
    <p style="font-size:13px;color:#8C98AE">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>${esc(
      lien
    )}</p>
    <p style="font-size:13px;color:#8C98AE">Ce lien expire dans 7 jours. Si vous n'êtes pas à l'origine de cette
    demande, ignorez simplement cet email : vous ne serez pas inscrit.</p>
    <hr style="border:none;border-top:1px solid #E5E2D8;margin:18px 0"/>
    <p style="font-size:12px;color:#8C98AE">${site.contact.adresse} · ${site.contact.tel} · ${site.contact.email}</p>
  </div>`;

  await resend.emails.send({
    from,
    to: email,
    subject: "Confirmez votre inscription à la newsletter Accelium Conseil",
    html,
  });

  return { ok: true };
}

/** Ajoute (ou met à jour) le contact confirmé dans l'audience Resend. */
export async function addContactToAudience(email: string): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!resend || !AUDIENCE_ID) {
    console.warn("[resend] RESEND_AUDIENCE_ID ou RESEND_API_KEY manquant : ajout à l'audience simulé (mock).");
    return { ok: true, skipped: true };
  }
  const { error } = await resend.contacts.create({ audienceId: AUDIENCE_ID, email, unsubscribed: false });
  if (error) {
    console.error("[resend] ajout du contact à l'audience échoué:", error);
    return { ok: false };
  }
  return { ok: true };
}

/** Passe le contact en désinscrit dans l'audience Resend. */
export async function unsubscribeContact(email: string): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!resend || !AUDIENCE_ID) {
    console.warn("[resend] RESEND_AUDIENCE_ID ou RESEND_API_KEY manquant : désinscription simulée (mock).");
    return { ok: true, skipped: true };
  }
  const { error } = await resend.contacts.update({ audienceId: AUDIENCE_ID, email, unsubscribed: true });
  if (error) {
    console.error("[resend] désinscription du contact échouée:", error);
    return { ok: false };
  }
  return { ok: true };
}

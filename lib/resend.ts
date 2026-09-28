import { Resend } from "resend";
import type { DiagnosticInput, LivreBlancInput } from "./validation";
import type { LivreBlanc } from "@/config/livres-blancs";
import { site } from "@/config/site";

const apiKey = process.env.RESEND_API_KEY;
const from = process.env.RESEND_FROM || `Accelium Conseil <contact@accelium-conseil.fr>`;
const to = process.env.LEADS_TO_EMAIL || site.contact.email;

const resend = apiKey ? new Resend(apiKey) : null;

function esc(s = "") {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function sendLeadEmails(data: DiagnosticInput): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY manquant — envoi simulé (mock).");
    return { ok: true, skipped: true };
  }

  const interneHtml = `
  <div style="font-family:system-ui,sans-serif;color:#1B2336">
    <h2 style="color:#F26122">Nouvelle demande de diagnostic</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Nom</td><td><strong>${esc(data.nom)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Société</td><td>${esc(data.societe)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Email</td><td>${esc(data.email)}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Téléphone</td><td>${esc(data.telephone || "—")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Secteur</td><td>${esc(data.secteur || "—")}</td></tr>
    </table>
    <p style="margin-top:12px;color:#5C6B8A">Projet :</p>
    <p style="white-space:pre-wrap">${esc(data.projet || "—")}</p>
  </div>`;

  const prospectHtml = `
  <div style="font-family:system-ui,sans-serif;color:#1B2336">
    <h2 style="color:#F26122">Merci ${esc(data.nom)} !</h2>
    <p>Nous avons bien reçu votre demande de diagnostic. Un expert Accelium reviendra vers vous très rapidement pour identifier votre potentiel d'aides.</p>
    <p style="color:#5C6B8A">À très bientôt,<br/>L'équipe Accelium Conseil</p>
    <hr style="border:none;border-top:1px solid #E5E2D8;margin:18px 0"/>
    <p style="font-size:12px;color:#8C98AE">${site.contact.adresse} · ${site.contact.tel} · ${site.contact.email}</p>
  </div>`;

  await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Diagnostic — ${data.societe} (${data.nom})`,
    html: interneHtml,
  });

  await resend.emails.send({
    from,
    to: data.email,
    subject: "Votre demande de diagnostic — Accelium Conseil",
    html: prospectHtml,
  });

  return { ok: true };
}

// Fiche H4 / L2.7 : si la création du lead dans Monday échoue, on alerte immédiatement une
// adresse interne pour que le lead ne soit pas silencieusement perdu côté CRM (l'email au
// prospect a, lui, déjà été envoyé ou va l'être : le lead n'est jamais perdu côté contact).
export async function sendMondayFailureAlert(contexte: string, data: Record<string, unknown>): Promise<void> {
  if (!resend) {
    console.warn("[resend] RESEND_API_KEY manquant — alerte Monday non envoyée (mock).", contexte, data);
    return;
  }
  try {
    await resend.emails.send({
      from,
      to,
      subject: `⚠ Échec Monday — ${contexte}`,
      html: `
      <div style="font-family:system-ui,sans-serif;color:#1B2336">
        <h2 style="color:#F26122">La création du lead dans Monday a échoué</h2>
        <p>Contexte : <strong>${esc(contexte)}</strong></p>
        <p style="color:#5C6B8A">Le lead ci-dessous n'a peut-être pas été enregistré dans le CRM. À vérifier et,
        si besoin, à saisir manuellement dans le board « Leads Site internet ».</p>
        <pre style="background:#F5F4EF;padding:12px;border-radius:8px;white-space:pre-wrap">${esc(
          JSON.stringify(data, null, 2)
        )}</pre>
      </div>`,
    });
  } catch (e) {
    console.error("[resend] envoi de l'alerte Monday échoué:", e);
  }
}

export async function sendLivreBlancEmails(
  data: LivreBlancInput,
  livre: LivreBlanc,
  baseUrl?: string
): Promise<{ ok: boolean; skipped?: boolean }> {
  const lien = `${(baseUrl || site.url).replace(/\/$/, "")}${livre.fichier}`;

  if (!resend) {
    console.warn("[resend] RESEND_API_KEY manquant — envoi simulé (mock).");
    return { ok: true, skipped: true };
  }

  const interneHtml = `
  <div style="font-family:system-ui,sans-serif;color:#1B2336">
    <h2 style="color:#F26122">Nouveau téléchargement de livre blanc</h2>
    <table style="border-collapse:collapse">
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Document</td><td><strong>${esc(livre.titre)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Nom</td><td><strong>${esc(data.nom)}</strong></td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Société</td><td>${esc(data.societe || "—")}</td></tr>
      <tr><td style="padding:4px 12px 4px 0;color:#5C6B8A">Email</td><td>${esc(data.email)}</td></tr>
    </table>
  </div>`;

  const prospectHtml = `
  <div style="font-family:system-ui,sans-serif;color:#1B2336">
    <h2 style="color:#F26122">Votre livre blanc est prêt, ${esc(data.nom)} !</h2>
    <p>Merci de votre intérêt. Voici votre exemplaire de <strong>«&nbsp;${esc(livre.sousTitre)}&nbsp;»</strong>.</p>
    <p style="margin:24px 0">
      <a href="${lien}" style="display:inline-block;background:#F26122;color:#fff;text-decoration:none;padding:14px 28px;border-radius:999px;font-weight:600">Télécharger le livre blanc</a>
    </p>
    <p style="font-size:13px;color:#8C98AE">Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br/>${esc(lien)}</p>
    <p>Une question, un projet à financer ? Répondez simplement à cet email, un expert Accelium vous recontactera.</p>
    <p style="color:#5C6B8A">À très bientôt,<br/>L'équipe Accelium Conseil</p>
    <hr style="border:none;border-top:1px solid #E5E2D8;margin:18px 0"/>
    <p style="font-size:12px;color:#8C98AE">${site.contact.adresse} · ${site.contact.tel} · ${site.contact.email}</p>
  </div>`;

  await resend.emails.send({
    from,
    to,
    replyTo: data.email,
    subject: `Livre blanc — ${livre.titre} (${data.nom})`,
    html: interneHtml,
  });

  await resend.emails.send({
    from,
    to: data.email,
    subject: `Votre livre blanc — ${livre.titre} | Accelium Conseil`,
    html: prospectHtml,
  });

  return { ok: true };
}

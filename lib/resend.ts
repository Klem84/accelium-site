import { Resend } from "resend";
import type { DiagnosticInput } from "./validation";
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

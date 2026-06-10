import type { DiagnosticInput } from "./validation";

const TOKEN = process.env.MONDAY_API_TOKEN;
const BOARD_ID = process.env.MONDAY_LEADS_BOARD_ID || "5098269157";

// Mapping des colonnes du board « Leads Site internet » (cf. .env.local)
const COL = {
  societe: "text_mm46tkbf",
  email: "email_mm46f6a2",
  telephone: "phone_mm468x5r",
  secteur: "text_mm465rew",
  projet: "long_text_mm469334",
  statut: "color_mm468ygm",
  source: "text_mm46nvbx",
  consentement: "boolean_mm46w",
  date: "date_mm46n3jh",
};

export async function createLead(
  data: DiagnosticInput,
  isoDate: string
): Promise<{ ok: boolean; skipped?: boolean; id?: string }> {
  if (!TOKEN) {
    console.warn("[monday] MONDAY_API_TOKEN manquant — création simulée (mock).");
    return { ok: true, skipped: true };
  }

  const columnValues: Record<string, unknown> = {
    [COL.societe]: data.societe,
    [COL.email]: { email: data.email, text: data.email },
    [COL.statut]: { label: "Nouveau" },
    [COL.source]: "Site — Diagnostic gratuit",
    [COL.consentement]: { checked: "true" },
    [COL.date]: { date: isoDate.slice(0, 10) },
  };
  if (data.telephone) columnValues[COL.telephone] = { phone: data.telephone, countryShortName: "FR" };
  if (data.secteur) columnValues[COL.secteur] = data.secteur;
  if (data.projet) columnValues[COL.projet] = { text: data.projet };

  const query = `mutation ($board: ID!, $name: String!, $cols: JSON!) {
    create_item(board_id: $board, item_name: $name, column_values: $cols, create_labels_if_missing: true) { id }
  }`;

  try {
    const res = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN,
        "API-Version": "2024-10",
      },
      body: JSON.stringify({
        query,
        variables: {
          board: BOARD_ID,
          name: `${data.nom} — ${data.societe}`,
          cols: JSON.stringify(columnValues),
        },
      }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error("[monday] erreur API:", JSON.stringify(json.errors));
      return { ok: false };
    }
    return { ok: true, id: json.data?.create_item?.id };
  } catch (e) {
    console.error("[monday] exception:", e);
    return { ok: false };
  }
}

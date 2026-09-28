import type { DiagnosticInput, LivreBlancInput } from "./validation";

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
  isoDate: string,
  origine?: string
): Promise<{ ok: boolean; skipped?: boolean; deduplicated?: boolean; id?: string }> {
  if (!TOKEN) {
    console.warn("[monday] MONDAY_API_TOKEN manquant — création simulée (mock).");
    return { ok: true, skipped: true };
  }

  const existing = await findItemIdByEmail(data.email);
  if (existing) {
    return { ok: true, deduplicated: true, id: existing };
  }

  const source = origine ? `Site — Diagnostic gratuit (${origine})` : "Site — Diagnostic gratuit";
  const columnValues: Record<string, unknown> = {
    [COL.societe]: data.societe,
    [COL.email]: { email: data.email, text: data.email },
    [COL.statut]: { label: "Nouveau" },
    [COL.source]: source,
    [COL.consentement]: { checked: "true" },
    [COL.date]: { date: isoDate.slice(0, 10) },
  };
  if (data.telephone) columnValues[COL.telephone] = { phone: data.telephone, countryShortName: "FR" };
  if (data.secteur) columnValues[COL.secteur] = data.secteur;
  if (data.projet) columnValues[COL.projet] = { text: data.projet };

  return createItem(`${data.nom} — ${data.societe}`, columnValues);
}

export async function createLeadLivreBlanc(
  data: LivreBlancInput,
  titreLivre: string,
  isoDate: string
): Promise<{ ok: boolean; skipped?: boolean; deduplicated?: boolean; id?: string }> {
  if (!TOKEN) {
    console.warn("[monday] MONDAY_API_TOKEN manquant — création simulée (mock).");
    return { ok: true, skipped: true };
  }

  const existing = await findItemIdByEmail(data.email);
  if (existing) {
    return { ok: true, deduplicated: true, id: existing };
  }

  const columnValues: Record<string, unknown> = {
    [COL.email]: { email: data.email, text: data.email },
    [COL.statut]: { label: "Nouveau" },
    [COL.source]: `Site — Livre blanc : ${titreLivre}`,
    [COL.consentement]: { checked: "true" },
    [COL.date]: { date: isoDate.slice(0, 10) },
  };
  if (data.societe) columnValues[COL.societe] = data.societe;

  return createItem(`${data.nom}${data.societe ? ` — ${data.societe}` : ""}`, columnValues);
}

// Déduplication (fiche H8 / L2.7) : recherche la présence d'un lead existant par email avant
// toute création, sans jamais lister ni exporter les leads du board (on ne récupère que
// l'identifiant du premier item trouvé, pour décider de créer ou non).
async function findItemIdByEmail(email: string): Promise<string | undefined> {
  const query = `query ($board: ID!, $col: String!, $val: [String!]!) {
    items_page_by_column_values(board_id: $board, columns: [{column_id: $col, column_values: $val}], limit: 1) {
      items { id }
    }
  }`;

  try {
    const res = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN as string,
        "API-Version": "2024-10",
      },
      body: JSON.stringify({
        query,
        variables: { board: BOARD_ID, col: COL.email, val: [email] },
      }),
    });
    const json = await res.json();
    if (json.errors) {
      console.error("[monday] erreur recherche par email:", JSON.stringify(json.errors));
      return undefined;
    }
    const items = json.data?.items_page_by_column_values?.items as { id: string }[] | undefined;
    return items && items.length > 0 ? items[0].id : undefined;
  } catch (e) {
    console.error("[monday] exception recherche par email:", e);
    return undefined;
  }
}

async function createItem(
  name: string,
  columnValues: Record<string, unknown>
): Promise<{ ok: boolean; id?: string }> {
  const query = `mutation ($board: ID!, $name: String!, $cols: JSON!) {
    create_item(board_id: $board, item_name: $name, column_values: $cols, create_labels_if_missing: true) { id }
  }`;

  try {
    const res = await fetch("https://api.monday.com/v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: TOKEN as string,
        "API-Version": "2024-10",
      },
      body: JSON.stringify({
        query,
        variables: {
          board: BOARD_ID,
          name,
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

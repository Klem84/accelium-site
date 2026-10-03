const SECRET = process.env.TURNSTILE_SECRET_KEY;
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// Fiche H4 / L2.7 : si une seule des deux clés Turnstile est définie, la protection anti-spam
// est dans un état incohérent (clé publique sans secret côté serveur, ou l'inverse) sans que
// personne ne s'en aperçoive. On échoue bruyamment au build plutôt que de servir un formulaire
// mal protégé en production.
if ((SECRET && !SITE_KEY) || (!SECRET && SITE_KEY)) {
  throw new Error(
    "[turnstile] Configuration incohérente : TURNSTILE_SECRET_KEY et NEXT_PUBLIC_TURNSTILE_SITE_KEY doivent être définies ensemble, ou absentes ensemble (mode dégradé volontaire)."
  );
}

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  // Si aucune clé configurée → on n'impose pas Turnstile (mode dégradé contrôlé).
  if (!SECRET) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY manquant : vérification désactivée (mock).");
    return true;
  }
  if (!token) return false;
  try {
    const body = new URLSearchParams();
    body.append("secret", SECRET);
    body.append("response", token);
    if (ip) body.append("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
    });
    const json = (await res.json()) as { success: boolean };
    return json.success === true;
  } catch (e) {
    console.error("[turnstile] exception:", e);
    return false;
  }
}

const SECRET = process.env.TURNSTILE_SECRET_KEY;

export async function verifyTurnstile(token: string | undefined, ip?: string): Promise<boolean> {
  // Si aucune clé configurée → on n'impose pas Turnstile (mode dégradé contrôlé).
  if (!SECRET) {
    console.warn("[turnstile] TURNSTILE_SECRET_KEY manquant — vérification désactivée (mock).");
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

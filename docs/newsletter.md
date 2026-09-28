# Newsletter : inscription en double opt-in (fiche L8.6)

## Principe

1. Un visiteur remplit le formulaire (`components/forms/NewsletterSignup.tsx`, présent sur
   `/ressources` et `/ressources/newsletters`) : email + case de consentement obligatoire,
   protégé par Turnstile et un honeypot.
2. `POST /api/newsletter` (`app/api/newsletter/route.ts`) valide la demande et envoie un email
   de confirmation contenant un lien signé (`lib/newsletter.ts`, `createNewsletterToken`).
3. Le visiteur clique sur le lien : `GET /newsletter/confirmation?token=...` vérifie la
   signature et l'expiration du jeton (7 jours), puis ajoute le contact à l'audience Resend.
4. Chaque newsletter envoyée doit inclure un lien de désinscription pointant vers
   `/newsletter/desinscription?token=...` (jeton créé avec `createNewsletterToken(email,
   "desinscription")`) : la page passe le contact en `unsubscribed: true` dans l'audience.

Le jeton est un HMAC-SHA256 signé côté serveur (email + intention + expiration), sans état à
conserver : aucune base de données n'est nécessaire pour ce flux.

## Variables d'environnement à créer (Clément)

Ces deux variables sont absentes de `.env.local` aujourd'hui. Sans elles, le formulaire
affiche « L'inscription à la newsletter n'est pas encore activée » (erreur propre, le build ne
casse pas) et aucun appel réseau vers Resend n'est fait.

1. **`RESEND_AUDIENCE_ID`** : créer une audience dans le tableau de bord Resend
   (resend.com > Audiences > Create audience, par exemple « Newsletter Accelium »), puis copier
   son identifiant (`aud_...`) dans `.env.local` et dans les variables d'environnement Vercel
   (Production + Preview).
2. **`NEWSLETTER_SECRET`** : une chaîne aléatoire longue (32 caractères minimum), par exemple
   générée avec `openssl rand -hex 32` en PowerShell (`node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
   fonctionne aussi). À définir dans `.env.local` et dans les variables d'environnement Vercel.
   Ne jamais committer cette valeur : elle signe les liens de confirmation et de désinscription,
   quiconque la connaît peut fabriquer un lien pour n'importe quel email.

Ces deux variables existent déjà et sont réutilisées ici : `RESEND_API_KEY` (clé API Resend) et
`RESEND_FROM` (adresse d'expédition), toutes deux définies dans `lib/resend.ts`.

## Test de bout en bout à faire (une fois les variables créées)

1. Déployer avec les deux variables définies en Preview.
2. Sur `/ressources/newsletters`, remplir le formulaire avec une adresse email que Clément peut
   consulter.
3. Vérifier la réception de l'email « Confirmez votre inscription à la newsletter Accelium
   Conseil » et cliquer sur le lien.
4. Vérifier que la page `/newsletter/confirmation` affiche « Votre inscription est confirmée ».
5. Dans le tableau de bord Resend (Audiences > l'audience créée), vérifier que le contact est
   présent avec `unsubscribed: false`.
6. Recréer manuellement un lien de désinscription pour ce même email (ou attendre l'ajout du
   lien dans le gabarit d'envoi de newsletter) et vérifier que `/newsletter/desinscription`
   passe bien le contact en `unsubscribed: true` dans Resend.
7. Vérifier qu'un lien de confirmation ou de désinscription modifié (un caractère changé dans le
   jeton) affiche bien « Lien invalide » et ne modifie rien dans l'audience.

## Limite connue

Le rate limiting de `/api/newsletter` est en mémoire par instance serverless (même limite
best-effort que `/api/diagnostic` et `/api/livre-blanc`, cf. commentaire dans
`app/api/diagnostic/route.ts`). Une règle Vercel WAF équivalente peut être ajoutée sur le
chemin `/api/newsletter` si besoin (Project Settings > Firewall > Rate Limiting).

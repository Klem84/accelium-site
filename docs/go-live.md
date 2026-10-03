# Go live : checklist exécutable par Clément (L8.1)

Ce document liste, dans l'ordre, les actions à faire avant, pendant et après la mise en
production du site accelium-conseil.fr. Chaque étape indique qui l'exécute (Clément, sauf
mention contraire) et comment vérifier qu'elle a réussi. Rien ici ne doit être fait par un
agent sans validation explicite de Clément, en particulier `vercel --prod` et la bascule DNS.

## 0. État au 28/09/2026 (à relire avant de commencer)

- Le dépôt local n'a pas de remote `origin` : aucun push n'a eu lieu (voir BACKLOG-V2.md, B-02).
- Le token Vercel de `.env.local` est refusé : aucune preview n'a pu être déployée pendant le
  run (BACKLOG-V2.md, B-01). Les checkpoints ont été vérifiés sur `next build && next start`
  en local.
- La variable `NEXT_PUBLIC_SITE_URL` de production sur Vercel était malformée (valeur sans
  `https://`, probablement juste `www.accelium-conseil.fr`). Le code (`config/site.ts`)
  tolère déjà ce cas et retombe sur `https://www.accelium-conseil.fr`, mais la variable
  doit être corrigée sur Vercel avant le go live pour éviter toute mauvaise surprise sur les
  URL canoniques, le sitemap et les métadonnées OpenGraph.
- Domaine accelium-conseil.fr : actuellement chez IONOS, WordPress en ligne.
- Projet Vercel : `accelium-site`, scope `clementbarbier-8004s-projects`.
- Dépôt cible : `Klem84/accelium-site` sur GitHub.

## 1. Renouveler les accès

### 1.1 GitHub

1. Aller sur github.com, dans les paramètres du compte propriétaire du dépôt
   `Klem84/accelium-site` : Settings > Developer settings > Personal access tokens >
   Fine-grained tokens.
2. Créer un nouveau token, portée limitée au dépôt `Klem84/accelium-site`, permissions
   `Contents: Read and write` et `Workflows: Read and write` (nécessaire pour pousser les
   fichiers `.github/workflows/**`).
3. Deux options pour l'utiliser :
   - Coller le token dans `RACINE\.env.local`, variable `GITHUB_TOKEN` (le champ
     `GITHUB_REPO` doit valoir `Klem84/accelium-site`).
   - Ou lancer `gh auth login` dans un terminal PowerShell et suivre les instructions.
4. Vérifier : `gh auth status` doit afficher un compte connecté avec les bonnes portées.

### 1.2 Vercel

1. Aller sur vercel.com, compte associé au scope `clementbarbier-8004s-projects`.
2. Account Settings > Tokens > Create Token, portée "Full Account" ou au minimum le scope
   `clementbarbier-8004s-projects`.
3. Deux options :
   - Coller le token dans `RACINE\.env.local`, variable `VERCEL_TOKEN`.
   - Ou lancer `vercel login` dans PowerShell, dans le dossier `accelium-site`, et suivre
     les instructions (lien envoyé par email).
4. Vérifier : `vercel whoami` doit afficher le bon compte ; `vercel project ls` doit lister
   `accelium-site`.

## 2. Ajouter le remote GitHub et pousser

Dans PowerShell, dans `RACINE\accelium-site` :

```powershell
git remote add origin https://github.com/Klem84/accelium-site.git
git push -u origin main
git push -u origin v2/fondations
```

Si le remote existe déjà avec une autre URL, utiliser `git remote set-url origin ...` au lieu
de `git remote add`. Vérifier ensuite sur github.com que les deux branches apparaissent et
que l'onglet Actions montre les workflows de `.github/workflows/` en cours ou terminés.

## 3. Variables d'environnement Vercel (production)

Liste exacte des variables lues par le code (`grep -rn "process.env" app lib config
middleware.ts next.config.mjs`), à renseigner dans Vercel : Project Settings > Environment
Variables > Production. Comparer avec `RACINE\.env.local` (jamais copier ce fichier dans un
commit ni dans une réponse) et avec `.env.example`.

| Variable | Rôle | Valeur attendue | Vérification |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL canonique du site (sitemap, métadonnées, JSON-LD, llms.txt) | `https://www.accelium-conseil.fr` (avec le schéma `https://`, sans slash final) | **À corriger : c'est la variable malformée signalée en préambule.** Après correction, un `vercel --prod` redéploie avec la bonne valeur. |
| `RESEND_API_KEY` | Envoi des emails de leads et de la newsletter (Resend) | Clé API Resend du domaine `accelium-conseil.fr` (vérifié) | Test d'envoi de bout en bout (section 6) |
| `RESEND_FROM` | Adresse d'expédition des emails | `Accelium Conseil <contact@accelium-conseil.fr>` | Idem |
| `LEADS_TO_EMAIL` | Destinataire des leads du formulaire de diagnostic | `contact@accelium-conseil.fr` | Idem |
| `RESEND_AUDIENCE_ID` | Audience Resend où sont ajoutés les inscrits à la newsletter (double opt-in, L8.6) | Identifiant d'audience Resend créée pour la newsletter | Sans cette variable, `/api/newsletter` répond 503 (voir `lib/newsletter.ts`, `isNewsletterConfigured`) |
| `NEWSLETTER_SECRET` | Signature des liens de confirmation et de désinscription de la newsletter | Secret aléatoire long (32 caractères ou plus), à générer une seule fois et à ne jamais changer ensuite (sinon les liens déjà envoyés cessent de fonctionner) | Idem |
| `MONDAY_API_TOKEN` | Création des leads dans Monday (avant l'envoi des emails) | Token API Monday avec droit d'écriture sur le board leads | Test d'envoi de bout en bout |
| `MONDAY_LEADS_BOARD_ID` | Board Monday cible pour les leads du site | `5098269157` (board « Leads Site internet » ; ne jamais confondre avec le board « leads » 5098269157 qui, lui, ne doit jamais être lu par un agent, cf. BRIEF-COMMUN.md règle 6) | Un lead de test apparaît sur ce board après soumission du formulaire |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Clé publique Cloudflare Turnstile (anti-spam, formulaires diagnostic et newsletter) | Clé de site Turnstile du domaine `accelium-conseil.fr` | Le widget Turnstile s'affiche sur `/contact` et sur le bloc newsletter |
| `TURNSTILE_SECRET_KEY` | Clé secrète Turnstile, vérifiée côté serveur | Clé secrète correspondante | Une soumission sans jeton Turnstile valide est rejetée par l'API |

Rappels :
- Ces deux variables (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY`) sont
  obligatoires au build (fiche L2, arbitrage §3 du plan d'action) : un build sans elles ne
  doit pas être poussé en production.
- `RESEND_AUDIENCE_ID` et `NEWSLETTER_SECRET` sont nouvelles (lot L8.6, formulaire newsletter
  avec double opt-in) : vérifier qu'elles sont bien présentes en plus des variables déjà
  connues de juin 2026, sans quoi l'inscription à la newsletter reste indisponible (503) même
  si le reste du site fonctionne.
- Après tout ajout ou correction de variable, redéployer (`vercel --prod` une fois la
  décision prise, ou un nouveau déploiement preview avant) : Vercel ne relit pas les variables
  d'environnement d'un déploiement déjà construit.

### 3.1 Limite de débit des formulaires (anti-spam), à activer avant la production

Le code limite chaque route (`/api/diagnostic`, `/api/livre-blanc`, `/api/newsletter`) à 5 requêtes
par minute et par IP (`lib/ratelimit.ts`). Sans configuration, le compteur est en mémoire, donc
propre à chaque instance serverless : c'est une simple première barrière. Choisir UNE des deux
options ci-dessous (gratuites, aucune ligne de code à modifier).

**Option A, base Upstash Redis gratuite depuis Vercel (recommandée)**

1. Ouvrir vercel.com, projet du site, onglet Storage.
2. Cliquer sur Create Database (ou Connect Store), choisir Upstash puis Redis (Marketplace).
3. Choisir l'offre gratuite (Free), une région européenne (ex. Paris ou Francfort), nommer la base
   `accelium-ratelimit`, valider la création.
4. Accepter de connecter la base au projet pour les environnements Production et Preview. Vercel
   ajoute automatiquement `KV_REST_API_URL` et `KV_REST_API_TOKEN` dans Environment Variables.
5. Redéployer (un nouveau déploiement preview suffit) : Vercel ne relit pas les variables d'un
   déploiement déjà construit.
6. Vérifier : envoyer 6 fois de suite une requête invalide à `/api/newsletter` (PowerShell,
   `Invoke-WebRequest -Method POST`) : la 6e réponse doit être 429, y compris en alternant
   plusieurs instances. Dans la console Upstash (Data Browser), des clés `rl:...` apparaissent.

Si Upstash est injoignable, le code retombe automatiquement sur le compteur en mémoire (le
formulaire ne tombe jamais en panne à cause du limiteur).

**Option B, règle Vercel Firewall (sans base de données)**

1. Ouvrir vercel.com, projet du site, onglet Firewall.
2. Cliquer sur Configure puis Add New Rule (ou Custom Rules > New Rule).
3. Nommer la règle `Rate limit API 5/min/IP`.
4. Condition : Request Path, Starts with, `/api/`.
5. Action : Rate Limit ; fenêtre fixe de 60 secondes ; 5 requêtes ; clé = IP address ; réponse
   `429 Too Many Requests` (ou Deny).
6. Enregistrer, puis Review Changes et Publish (la règle ne s'applique qu'après publication).
7. Vérifier comme à l'étape 6 de l'option A.

Les deux options peuvent coexister. Ne pas créer la base ni la règle avant d'avoir décidé de la
date de mise en production (le plan Hobby limite le nombre de règles ; l'offre gratuite Upstash
suffit largement pour ce trafic).

## 4. Déploiement preview puis production

1. Depuis `accelium-site`, avec le token Vercel valide : `vercel` (sans `--prod`) crée un
   déploiement preview. Lire l'URL retournée, la consigner dans `RUNLOG-V2.md` (A1 le fait à
   partir de ce rapport).
2. Faire tourner sur cette preview : `npm run check`, `npx playwright test`, un passage
   Lighthouse (`npm run lhci` ou PageSpeed Insights en ligne sur l'URL preview), un envoi réel
   du formulaire de contact et un envoi réel du formulaire newsletter.
3. **`vercel --prod` ne doit être lancé que sur décision explicite de Clément**, après lecture
   du rapport de l'auditeur A10 (note globale au moins proche de 9/10) et validation des
   points encore ouverts de `BACKLOG-V2.md`.

## 5. Google Search Console et Bing Webmaster

### 5.1 Google Search Console

1. search.google.com/search-console, ajouter une propriété de type **Domaine** (pas
   "Préfixe d'URL") pour `accelium-conseil.fr` : cela couvre automatiquement `http`, `https`,
   avec et sans `www`.
2. Vérification par **enregistrement DNS TXT** : Google fournit une valeur du type
   `google-site-verification=...` à ajouter comme enregistrement TXT sur la zone DNS
   d'IONOS (nom `@`, valeur fournie par Google). La propagation peut prendre jusqu'à 24 h ;
   cliquer sur "Vérifier" dans Search Console une fois le TXT actif (vérifiable avec
   `nslookup -type=TXT accelium-conseil.fr` en PowerShell).
3. Une fois vérifié, aller dans Sitemaps (menu de gauche) et soumettre
   `https://www.accelium-conseil.fr/sitemap.xml`.
4. Si l'ancienne propriété WordPress existe déjà dans Search Console, la conserver (elle
   garde l'historique) ; la nouvelle propriété de domaine suivra le nouveau site.

### 5.2 Bing Webmaster Tools

1. bing.com/webmasters : utiliser l'option **Importer depuis Google Search Console**
   (nécessite de se connecter avec le même compte Google et d'autoriser l'accès en lecture).
   Cela importe automatiquement la propriété et le sitemap.
2. À défaut, ajouter le site manuellement (vérification par balise meta ou fichier XML, au
   choix) puis soumettre le même sitemap `https://www.accelium-conseil.fr/sitemap.xml`.

## 6. Plan de bascule DNS (IONOS vers Vercel)

**À ne déclencher qu'après validation explicite de Clément et un `vercel --prod` réussi.**

### 6.1 Préparatifs, 24 h avant la bascule

1. Se connecter à l'espace IONOS, zone DNS de `accelium-conseil.fr`.
2. Réduire le TTL (Time To Live) de tous les enregistrements existants (A, CNAME, éventuel
   AAAA) du domaine racine et du sous-domaine `www` à une valeur basse (300 secondes, soit
   5 minutes) et attendre au moins la durée de l'ancien TTL pour que le changement se propage
   avant la bascule elle-même. Ne pas toucher aux enregistrements **MX** ni **TXT** liés à la
   messagerie (SPF, DKIM, DMARC) : la messagerie professionnelle ne doit jamais être coupée.
3. Dans Vercel, Project Settings > Domains, ajouter `accelium-conseil.fr` et
   `www.accelium-conseil.fr` au projet `accelium-site`. Vercel indique alors les
   enregistrements exacts à créer (généralement un enregistrement A sur `76.76.21.21` pour le
   domaine racine et un CNAME sur `cname.vercel-dns.com` pour `www`) : utiliser les valeurs
   affichées par Vercel au moment de la bascule, elles peuvent différer de cet exemple.
4. Décider quel domaine est canonique : `www.accelium-conseil.fr` (cohérent avec
   `NEXT_PUBLIC_SITE_URL`). Configurer dans Vercel la redirection automatique du domaine sans
   `www` vers `www` (case "Redirect to" dans les paramètres du domaine racine).

### 6.2 Jour de la bascule

1. Sur IONOS, remplacer les enregistrements A et CNAME du domaine et de `www` par les valeurs
   fournies par Vercel (étape 6.1.3). Conserver les enregistrements MX intacts.
2. Attendre la propagation (avec un TTL réduit à 300 s, généralement effective en quelques
   minutes à 1 heure ; vérifier avec `nslookup accelium-conseil.fr` et
   `nslookup www.accelium-conseil.fr` en PowerShell jusqu'à ce que les IP renvoyées
   correspondent à Vercel).
3. Vérifier dans Vercel (Project Settings > Domains) que les deux domaines passent au statut
   "Valid Configuration" avec un certificat SSL émis automatiquement (Let's Encrypt via
   Vercel). Vérifier ensuite dans un navigateur que `http://accelium-conseil.fr`,
   `http://www.accelium-conseil.fr` et `https://accelium-conseil.fr` redirigent tous vers
   `https://www.accelium-conseil.fr` (redirection http vers https automatique côté Vercel,
   redirection sans www vers www configurée à l'étape 6.1.4).
4. Vérifier la messagerie professionnelle (envoi et réception d'un email de test) avant de
   considérer la bascule terminée.
5. Une fois la propagation stable (24 à 48 h), remettre le TTL des enregistrements à une
   valeur normale (3600 s ou la valeur par défaut d'IONOS).

## 7. Tests des redirections après la bascule

À exécuter depuis un navigateur ou avec `Invoke-WebRequest` en PowerShell (le curl de
git-bash n'a pas internet sur ce poste, cf. BRIEF-COMMUN.md règle 9), sur le domaine de
production une fois la bascule effective. Attendre chaque redirection jusqu'à son code final.

### 7.1 Bascule de domaine (http, sans www)

| URL testée | Résultat attendu |
|---|---|
| `http://accelium-conseil.fr/` | 301 ou 308 vers `https://www.accelium-conseil.fr/` |
| `http://www.accelium-conseil.fr/` | 301 ou 308 vers `https://www.accelium-conseil.fr/` |
| `https://accelium-conseil.fr/` | 301 ou 308 vers `https://www.accelium-conseil.fr/` |

### 7.2 Anciennes URL WordPress (source : `RACINE\redirects-301-mapping.md`, appliquées dans
`config/redirects.mjs`)

| Ancienne URL | Nouvelle URL attendue | Code attendu |
|---|---|---|
| `/actualites` | `/blog` | 301 |
| `/diagnostic-gratuit` | `/contact` | 301 |
| `/nos-atouts` | `/cabinet/nos-atouts` | 301 |
| `/nos-partenaires` | `/cabinet/partenaires` | 301 |
| `/notre-demarche` | `/offres/financements-publics` | 301 |
| `/cabinet/methodologie` | `/offres/financements-publics` | 301 |
| `/category/uncategorized` | `/blog` | 301 |
| `/hello-world` | `/blog` | 301 |
| `/ressources/fiches-decryptage` | `/blog#fiches` | 301 |
| `/?oceanwp_library=topbar` | à ignorer (page interne du thème WordPress, non reprise) | sans objet |
| `/elementor-hf/pied-de-page` | à ignorer (page interne du thème WordPress, non reprise) | sans objet |

### 7.3 Anciens slugs de dispositifs (recréés pendant le run V2)

| Ancienne URL | Nouvelle URL attendue | Code attendu |
|---|---|---|
| `/le-financement-public/dispositifs/cii` | `/le-financement-public/dispositifs/credit-impot-innovation-cii` | 301 |
| `/le-financement-public/dispositifs/c3iv` | `/le-financement-public/types-d-aides/credits-impot` | 301 |
| `/le-financement-public/dispositifs/decarb-ind` | `/le-financement-public/dispositifs/decarbonation-industrie-decarb` | 301 |
| `/le-financement-public/dispositifs/fonds-chaleur-bciat` | `/le-financement-public/dispositifs/fonds-chaleur` | 301 |
| `/le-financement-public/dispositifs/france-2030` | `/le-financement-public/dispositifs/france-2030-premiere-usine-i-demo` | 301 |
| `/le-financement-public/dispositifs/cee` | `/le-financement-public/dispositifs/certificats-economies-energie-cee` | 301 |
| `/le-financement-public/dispositifs/credit-impot-recherche-cir` (slug inchangé) | même URL, pas de redirection | 200 |
| `/le-financement-public/dispositifs/un-slug-quelconque` (tout autre ancien slug de dispositif non listé ci-dessus) | `/le-financement-public/types-d-aides` (redirection générique par défaut) | 301 |

### 7.4 Normalisation de casse (middleware.ts)

| URL testée | Résultat attendu |
|---|---|
| `/OFFRES` (ou toute URL avec des majuscules hors `/api` et `/_next`) | 308 vers `/offres` |
| `/index.html` | 308 vers `/` |

### 7.5 Vérification automatisée

Les cas ci-dessus 7.2, 7.3 et 7.4 sont déjà couverts par les tests Playwright
`tests/redirects.spec.ts` et `tests/casse-url.spec.ts`, mais ces tests tournent sur le serveur
de build local (`npm run start`), pas sur le domaine de production. Après la bascule, soit :
- relire manuellement le tableau ci-dessus sur `https://www.accelium-conseil.fr`, soit
- adapter temporairement `playwright.config.ts` (`baseURL`) pour pointer vers le domaine de
  production et relancer `npx playwright test redirects.spec.ts casse-url.spec.ts` (à faire
  sur une copie de configuration, ne pas modifier `playwright.config.ts` du dépôt pour cela).

Compléter cette liste avec le rapport "Pages" de Google Search Console 60 jours après le go
live, au cas où Google aurait indexé d'autres anciennes URL (paramètres, pièces jointes) non
présentes dans `redirects-301-mapping.md`.

## 8. Retour arrière (rollback)

Si un problème critique apparaît après la bascule DNS ou après `vercel --prod` :

1. **Problème applicatif seul (DNS déjà basculé vers Vercel)** : dans Vercel, Deployments,
   sélectionner le déploiement de production précédent et cliquer sur "Promote to Production"
   (ou "Instant Rollback" si l'option est proposée). Aucune action DNS nécessaire, le retour
   est quasi instantané.
2. **Problème lié à la bascule DNS elle-même** (le nouveau site ne répond pas du tout, la
   messagerie est coupée) : sur IONOS, restaurer les enregistrements DNS d'origine (A, CNAME,
   MX) sauvegardés avant la bascule (faire une capture ou un export de la zone DNS avant de la
   modifier, à l'étape 6.1). Avec un TTL réduit à 300 s, le retour à l'ancien WordPress est
   effectif en quelques minutes.
3. Dans tous les cas, consigner l'incident et la décision de retour arrière dans
   `RUNLOG-V2.md` (A1) avant de retenter la bascule.

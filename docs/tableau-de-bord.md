# Tableau de bord mensuel (L8.5)

Modèle à copier chaque mois (nouvelle section datée, la plus récente en tête) à partir du
go live. Toutes les mesures sont manuelles ou semi automatiques : aucun outil payant n'est
nécessaire (Search Console, Bing Webmaster, ChatGPT et Google sont gratuits ; Perplexity
demande un compte gratuit). Le script `npm run check:freshness` (existant, `scripts/check-freshness.ts`)
signale les fiches de contenu dont `derniereVerification` a plus de 6 mois : le lancer avant
de remplir ce tableau, dans `accelium-site`.

## Modèle de section mensuelle

```
## Mois AAAA-MM

Date de la mesure :
Fait par :

### 1. Positions Search Console (20 requêtes cibles)

| Requête | Position moyenne | Impressions | Clics | Page qui ressort | Évolution vs mois précédent |
|---|---|---|---|---|---|
| ... | ... | ... | ... | ... | ... |

### 2. Citations dans les moteurs de réponse IA (15 requêtes)

| Requête | ChatGPT | Perplexity | Google (navigation privée) | Commentaire |
|---|---|---|---|---|
| ... | Cité / Non cité | Cité / Non cité | Cité / Non cité | ... |

### 3. Conversions

| Événement | Nombre ce mois | Nombre mois précédent | Source |
|---|---|---|---|
| diagnostic_envoye | ... | ... | Vercel Analytics |
| livre_blanc_telecharge | ... | ... | Vercel Analytics |
| newsletter_inscription_demandee | ... | ... | Vercel Analytics |

### 4. Core Web Vitals (PageSpeed Insights, accueil et 2 pages types)

| Page | LCP mobile | CLS mobile | TBT mobile | Score performance mobile |
|---|---|---|---|---|
| / | ... | ... | ... | ... |
| /offres/financements-publics | ... | ... | ... | ... |
| /le-financement-public/dispositifs/credit-impot-recherche-cir | ... | ... | ... | ... |

### 5. Pages indexées

| Source | Nombre de pages indexées | Nombre soumis (sitemap) | Écart à expliquer |
|---|---|---|---|
| Google Search Console (rapport Couverture) | ... | ... | ... |
| Bing Webmaster Tools | ... | ... | ... |

### 6. Domaines référents

| Domaine référent | Type de lien | Date constatée | Nouveau ce mois ? |
|---|---|---|---|
| ... | ... | ... | Oui / Non |

Source : Google Search Console (rapport Liens), à défaut de l'onglet des demandes envoyées
dans `docs/plan-autorite.md` (A7) pour recouper les liens obtenus.

### 7. Fraîcheur du contenu

Sortie de `npm run check:freshness` collée ici (liste des fiches de plus de 6 mois ou sans
`derniereVerification`), avec la décision prise pour chacune (revérifiée ce mois, reportée,
page retirée).

### 8. Décisions et actions du mois

- ...
```

## 1. Les 20 requêtes cibles

Liste reprise de `AUDIT-SITE-2026-09-26.md` (section "20 requêtes non couvertes face aux
concurrents"). La requête n° 20 a été reformulée après l'arbitrage de Clément du 27/09/2026
(pas de page ni de mention d'honoraires, cf. `PLAN-ACTION-V2-equipe-agents.md` §1) : on
continue de suivre la requête telle que les internautes la tapent, mais aucune page dédiée
"Honoraires et engagement" n'existe ni ne sera créée ; la page qui doit ressortir est
`/cabinet/nos-atouts` (section rémunération réécrite sans chiffre).

| # | Requête cible | Page qui doit ressortir |
|---|---|---|
| 1 | cabinet conseil crédit impôt recherche | `/offres/credit-impot-recherche-innovation` |
| 2 | cabinet CIR Tours | Page siège Tours (à confirmer, voir T-14/BACKLOG selon avancement des pages région) |
| 3 | conseil financement public + [région] (13 déclinaisons, une ligne par région suivie) | `/regions/[slug]` |
| 4 | agrément CIR CII comment obtenir | `/le-financement-public/dispositifs/agrement-cir-cii` |
| 5 | simulateur éligibilité agrément CIR | `/ressources/agrement-cir-cii` |
| 6 | Fonds Chaleur biomasse entreprise subvention | `/le-financement-public/dispositifs/fonds-chaleur` |
| 7 | BCIAT 2026 appel à projets | `/le-financement-public/dispositifs/fonds-chaleur` (section BCIAT) |
| 8 | DECARB FLASH 2026 conditions | `/le-financement-public/dispositifs/decarbonation-industrie-decarb` |
| 9 | subvention décarbonation industrie ADEME PME | `/le-financement-public/dispositifs/decarbonation-industrie-decarb` |
| 10 | CAP PME-PMI Région Centre-Val de Loire | `/regions/centre-val-de-loire` |
| 11 | aide investissement scierie FEADER | `/le-financement-public/dispositifs/feader-investissements-agroalimentaire-scieries` |
| 12 | subvention méthanisation agricole 2026 | `/le-financement-public/dispositifs/methanisation-aides` |
| 13 | aide agence de l'eau industrie économies d'eau | `/le-financement-public/dispositifs/aides-agences-de-l-eau` |
| 14 | Fonds Vert friche industrielle subvention | `/le-financement-public/dispositifs/fonds-vert-friches-territoires-industrie` |
| 15 | C3IV crédit d'impôt industrie verte | `/le-financement-public/types-d-aides/credits-impot` |
| 16 | décarbonation centrale d'enrobage subvention | `/secteurs/enrobes` |
| 17 | aide modernisation distillerie subvention | `/secteurs/distillerie` |
| 18 | financement décarbonation portuaire ADEME | secteur port (à vérifier si publié, sinon cas client port maritime) |
| 19 | contrôle fiscal CIR que faire | `/blog/controle-fiscal-cir` |
| 20 | honoraires cabinet CIR pourcentage success fee | `/cabinet/nos-atouts` (reformulée, voir remarque ci-dessus) |

Pour les 13 déclinaisons régionales de la requête n° 3, suivre au minimum les régions où
Accelium a des clients (`config/chiffres.ts`, champ `regionsClientes`) et les 8 pages région
déjà publiées au 28/09/2026 (`content/regions/*.mdx`) ; ajouter les nouvelles régions au fur
et à mesure de leur publication.

## 2. Les 15 requêtes de citation IA

Liste et méthode reprises de `AUDIT-SITE-2026-09-26.md`, section G.5 et G.6. Protocole
identique chaque mois pour rester comparable :
- **ChatGPT** : chatgpt.com, sans compte, recherche web active. Utiliser l'URL
  `chatgpt.com/?q=` suivie de la requête encodée pour lancer directement la recherche.
- **Perplexity** : compte gratuit (la version sans compte demande une inscription avant de
  répondre), recherche web active.
- **Google** : navigateur en navigation privée, connecté à un compte français, sur
  google.fr ; noter si un aperçu IA (AI Overview) apparaît et s'il cite accelium-conseil.fr.

Pour chaque requête, noter dans le tableau mensuel : cité ou non, quelles sources sont citées
à la place le cas échéant, et si une fiche établissement (Google) apparaît.

| # | Requête (formulation à reprendre à l'identique chaque mois) |
|---|---|
| 1 | Quel cabinet pour un dossier CIR à Tours ? |
| 2 | Quel cabinet de conseil en financement public pour une PME industrielle en Centre-Val de Loire ? |
| 3 | Comment financer une méthanisation ? Quels cabinets ? |
| 4 | Aides ADEME décarbonation PME 2026 et qui peut monter le dossier ? |
| 5 | Subventions France 2030 industrie et quel cabinet ? |
| 6 | Comment obtenir l'agrément CIR pour mon bureau d'études ? |
| 7 | Quel cabinet pour des aides de l'agence de l'eau, usine agroalimentaire ? |
| 8 | Subvention FEADER scierie, qui peut m'aider ? |
| 9 | Chaudière biomasse en entreprise, Fonds Chaleur, quels cabinets ? |
| 10 | Meilleurs cabinets de conseil en subventions pour PME ? |
| 11 | Cabinet CIR rémunéré au succès : fonctionnement, honoraires, risques ? |
| 12 | Risques de contrôle fiscal sur le CIR et comment sécuriser ? |
| 13 | Aides pour une PME agroalimentaire, nouvelle ligne de production, quel cabinet ? |
| 14 | Consultant subventions à Tours ou en Centre-Val de Loire, qui contacter ? |
| 15 | Que sais-tu d'Accelium Conseil à Tours ? |

Objectif de la grille de sortie (`PLAN-ACTION-V2-equipe-agents.md` §8, axe G) : au moins 3
citations d'accelium-conseil.fr sur ces 15 requêtes, ou, si le site n'est pas encore indexé,
la preuve que chaque page cible répond littéralement à la question posée.

## 3. Conversions suivies

Trois événements, déjà câblés côté site (Vercel Analytics, voir `lib/resend.ts`,
`components/forms/NewsletterSignup.tsx`) :
- `diagnostic_envoye` (formulaire de contact `/contact`)
- `livre_blanc_telecharge` (téléchargements de livres blancs)
- `newsletter_inscription_demandee` (inscription à la newsletter, avant confirmation double
  opt-in)

Lecture : Vercel, projet `accelium-site`, onglet Analytics.

## 4. Core Web Vitals

Mesurer avec PageSpeed Insights (pagespeed.web.dev), sur l'accueil et sur 2 pages
représentatives (une page offre, une page dispositif). Consigner LCP, CLS, TBT et le score
de performance mobile. Seuils de la grille de sortie : LCP inférieur ou égal à 2,5 s, CLS
inférieur ou égal à 0,05, TBT inférieur ou égal à 100 ms, score mobile supérieur ou égal à
95.

## 5. Pages indexées

Google Search Console, rapport "Couverture" (ou "Pages" selon la version de l'interface) :
nombre de pages valides et indexées. Bing Webmaster Tools, rapport équivalent. Comparer au
nombre de pages soumises dans le sitemap (`https://www.accelium-conseil.fr/sitemap.xml`).

## 6. Domaines référents

Google Search Console, rapport "Liens" (Links) > "Domaines référents externes". Recouper
avec les demandes envoyées dans `docs/plan-autorite.md` : une demande de lien satisfaite
doit apparaître ici dans les semaines qui suivent.

## 7. Fraîcheur

`npm run check:freshness` (dans `accelium-site`) liste les fiches `dispositifs`, `regions`,
`financeurs` et `secteurs` dont `derniereVerification` a plus de 6 mois ou est absente.
Avertissement uniquement (le script ne fait jamais échouer le build) : chaque fiche signalée
doit être revérifiée sur sa source officielle, ou explicitement reportée avec une raison
notée dans la section "Décisions et actions du mois".

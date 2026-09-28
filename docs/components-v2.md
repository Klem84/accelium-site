# Composants et gabarits V2 : spécification (A8, run V2, 27/09/2026)

**Référence visuelle** : `maquettes/direction-e-moderne-pleine-largeur.html` et `DESIGN.md`. **Aucun changement de police, de palette ni de grille.** Tous les composants ci-dessous réutilisent les tokens de `tailwind.config.ts` et les classes utilitaires de `app/globals.css`.
**Destinataires** : A3 et A3b (développement), A2 (image OG), A4 (images), A9 (tests axe et Lighthouse).

Sommaire : 1. Tokens ; 2. Décision bouton primaire et contrastes ; 3. Règles transverses des états ; 4. Composants (12) ; 5. Gabarits de pages (7) ; 6. Image OG par défaut.


## 1. Tokens (source : `tailwind.config.ts`)

`tailwind.config.ts` fait foi pour la Direction E. Les valeurs de la section « Fondation commune » de `DESIGN.md` (ink #28323F, cream #F6F6F2, etc.) datent de la phase d'exploration et ne sont plus celles du code.

| Token Tailwind | Hex | Rôle |
|---|---|---|
| `ink` | #1B2336 | Titres, texte fort, fonds sombres (CTA, pied de page) |
| `body` | #3E4A63 | Texte courant (couleur du `body`) |
| `slateD` | #39455F | Texte secondaire fort, métadonnées |
| `slate` | #5C6B8A | Légendes, texte tertiaire (jamais sur `sand`) |
| `surface` | #FFFFFF | Fond principal, cartes |
| `cream` | #F5F4EF | Sections alternées, encadrés, bandeaux d'en-tête |
| `sand` | #ECEAE1 | Encadrés secondaires (usage parcimonieux) |
| `line` | #E5E2D8 | Filets et bordures décoratives (pas de bordure de champ) |
| `orange` | #F26122 | Accent décoratif : puces, pictos, soulignements, filets. **Jamais en texte ni en fond de texte blanc** |
| `orange2` | #FF7536 | Accent sur fond `ink` uniquement (kicker du hero, mots en exergue) |
| `orange700` | #C2480F | Orange en texte sur fond clair, fond du bouton primaire, anneau de focus |

Typographie (classes existantes) : `.display` (Clash Display, interlettrage -0,02em, interligne 0,98), `.h-hero`, `.h-mega`, `.h-sec` (H2 de section, `clamp(2rem, 1.1rem + 3vw, 3.5rem)`), `.lede` (chapô), `.kicker` (0,8 rem, 600, capitales, interlettrage 0,2em), `.measure` (58ch), `.prose-accelium` (corps MDX), `.wrap` (1 280 px, gouttières 1,25 rem puis 2 rem dès 1 024 px). Graisses disponibles en fichiers : Clash Display 500 et 600, General Sans 400 et 600 (voir §6, note sur les polices).

Formes : cartes `rounded-2xl` (16 px) `border border-line bg-surface` ; champs `rounded-xl` (12 px) ; boutons et pastilles `rounded-full` ; ombre `shadow-soft` réservée aux cartes avec image. Espacements verticaux de section : `py-20 lg:py-28` (sections standard), `py-24 lg:py-36` (accueil). Mouvement : classes `reveal` et `data-stagger` existantes, courbe `cubic-bezier(0.16, 1, 0.3, 1)`, 250 ms pour les états d'interaction ; tout s'annule sous `prefers-reduced-motion` (déjà câblé dans `globals.css`).


## 2. Décision bouton primaire et table des contrastes

### 2.1 Décision : fond #C2480F (`orange700`), texte blanc. Confirmée.

| Option | Ratio texte | Sur fond clair (bouton vs fond) | Sur fond `ink` (bouton vs fond) | Verdict |
|---|---|---|---|---|
| Actuel : blanc sur #F26122 | **3,23:1** (échec AA pour du texte de 16 px) | 3,23:1 | 4,86:1 | À abandonner |
| Retenu : blanc sur #C2480F | **4,97:1** (AA) | 4,97:1 sur blanc, 4,51:1 sur crème | 3,15:1 (≥ 3:1 exigé pour un composant) | **Retenu** |
| Alternative : #1B2336 sur #FF7536 | 5,86:1 (AA) | 2,68:1 sur blanc | 5,86:1 | Écartée |

Arguments :
1. L'alternative a un meilleur ratio de texte, mais elle inverse la signature de la Direction E (bouton orange à texte blanc, présent sur toutes les maquettes) et un texte bleu nuit sur orange vif évoque la signalétique d'alerte plus que le conseil haut de gamme.
2. #FF7536 est trop clair pour se détacher d'un fond blanc (2,68:1 entre le bouton et la page) : le bouton perd sa lisibilité comme composant sur les pages claires, qui sont majoritaires.
3. #C2480F est déjà le token « orange en texte » de la charte : une seule teinte d'orange interactif, cohérente entre liens, bouton et focus.

Spécification `.btn-primary` (modification de `globals.css`, hors périmètre A8, à appliquer par A3) :
- Repos : fond #C2480F, texte #FFFFFF, `font-weight: 600`, ombre `0 12px 34px -12px rgba(194, 72, 15, 0.55)`.
- Survol : **même fond** (aucune nouvelle teinte n'est ajoutée à la palette), `translateY(-2px)`, ombre `0 16px 40px -12px rgba(194, 72, 15, 0.65)`, flèche décalée de 3 px vers la droite.
- Actif : `translateY(0)`, ombre réduite de moitié.
- Focus : anneau de focus global (ci-dessous).
- Désactivé : `opacity: 0.55`, `cursor: not-allowed`, pas d'élévation ; le texte reste lisible (état non interactif, exempté du ratio, mais on garde au moins 3:1).
- Chargement : libellé remplacé par « Envoi en cours… », pictogramme rotatif 16 px en `currentColor`, `aria-busy="true"`, bouton désactivé.

Anneau de focus global (modification de `.focusable:focus-visible`, hors périmètre, à appliquer par A3) : **passer de #F26122 à #C2480F**. #F26122 ne donne que 2,93:1 sur `cream` (seuil de 3:1 non atteint) ; #C2480F donne 4,97:1 sur blanc, 4,51:1 sur crème, 4,12:1 sur sable et 3,15:1 sur `ink`. `outline: 2px solid`, `outline-offset: 3px`.

### 2.2 Table des contrastes (calcul WCAG 2.1, luminance relative)

Texte courant : seuil 4,5:1. Grand texte (≥ 24 px, ou ≥ 18,7 px en 600) et composants : 3:1.

| Premier plan | Fond | Ratio | Usage autorisé |
|---|---|---|---|
| `ink` | `surface` / `cream` / `sand` | 15,67 / 14,23 / 13,00 | Tout |
| `body` | `surface` / `cream` / `sand` | 8,88 / 8,06 / 7,37 | Tout |
| `slateD` | `surface` / `cream` / `sand` | 9,59 / 8,71 / 7,95 | Tout |
| `slate` | `surface` / `cream` | 5,35 / 4,86 | Légendes, métadonnées |
| `slate` | `sand` | **4,44** | Interdit en texte |
| `orange700` | `surface` / `cream` | 4,97 / 4,51 | Liens, kickers, valeurs |
| `orange700` | `sand` | **4,12** | Interdit en texte courant ; mettre `ink` |
| `orange700` | `orange/10` sur blanc | **4,43** | Interdit (pastilles actuelles) ; utiliser `orange/5` (4,70) |
| `orange700` | `orange/5` sur blanc | 4,70 | Pastilles de secteur |
| `orange` #F26122 | `surface` / `cream` | 3,23 / 2,93 | Décor uniquement (puces, pictos ≥ 3:1 sur blanc seulement) |
| blanc | `ink` | 15,67 | Tout |
| blanc 80 % / 70 % / 60 % / 50 % | `ink` | 10,46 / 8,33 / 6,50 / 4,96 | Texte secondaire sur fond sombre : minimum `white/60` |
| `orange2` | `ink` | 5,86 | Kicker, mots en exergue sur fond sombre |
| `orange` | `ink` | 4,86 | Accepté sur fond sombre |
| `slate` / `orange700` | `ink` | **2,93 / 3,15** | Interdits en texte sur `ink` |
| `ink/60` | `surface` / `cream` | **4,24 / 4,10** | Interdit en texte courant ; utiliser `ink/70` (5,84 / 5,58) |
| blanc | #C2480F | 4,97 | Bouton primaire |
| `line` | `surface` | 1,30 | Filet décoratif uniquement, **jamais bordure de champ** |
| `slate` (bordure) | `surface` / `cream` | 5,35 / 4,86 | Bordure des champs de formulaire |
| blanc | voile `ink` 65 % sur pixel blanc | 4,96 | Minimum sous le texte d'un hero photo |


## 3. Règles transverses des états

- **Repos, survol, focus** : survol en 250 ms, jamais seul porteur d'information ; focus toujours visible (`.focusable`), jamais `outline: none` sans remplacement.
- **Chargement** : uniquement pour ce qui attend le réseau (NewsletterSignup, Quiz si résultat serveur). Les composants rendus côté serveur (tableaux, FAQ, sources) n'ont pas d'état de chargement : ils sont dans le HTML initial.
- **Vide** : un composant sans données **ne rend rien** (`return null`), sans texte de substitution visible. Aucune mention « en cours de rédaction », « en cours de vérification » ou « à compléter » ne doit apparaître en production (audit, lot 1 : « zéro mention à compléter »). Le contrôle se fait au build : `scripts/check-content.ts` (A9) échoue si un champ obligatoire du frontmatter manque. En développement seulement (`process.env.NODE_ENV !== "production"`), un encadré `border-dashed border-slate text-slate` peut signaler le manque.
- **Erreur** : pas de rouge dans la palette, donc erreur = texte `orange700` (4,97:1) + pictogramme « ! » dans un cercle + message explicite, `role="alert"` ; champ en erreur : bordure 2 px `orange700`, `aria-invalid="true"`, message relié par `aria-describedby`.
- **Mobile** : points de rupture Tailwind par défaut (`sm` 640, `md` 768, `lg` 1 024). Cible tactile minimale 44 × 44 px. Aucun défilement horizontal de page.


## 4. Composants

Emplacement : `components/collections/`. Chaque composant est un composant serveur sauf mention « client ».

### 4.1 DispositifTable (tableau d'identité d'un dispositif)

- **Rôle** : résumer un dispositif en 8 lignes au plus : Financeur, Bénéficiaires, Dépenses éligibles, Taux et plafond, Forme de l'aide, Calendrier, Cumul, Lien officiel.
- **Structure (≥ 768 px, `md`)** : `<table>` avec `<caption class="sr-only">Fiche d'identité : {nomCourt}</caption>`, lignes `<th scope="row">` (largeur 34 %, `font-600 text-ink`, `text-[0.92rem]`) et `<td>` (`text-body`). Conteneur `rounded-2xl border border-line overflow-hidden`, lignes paires `bg-cream/60` (texte `body` 8,39:1), filets `border-b border-line`. Listes (bénéficiaires, dépenses) en `<ul>` avec puces orange 6 px (style `prose-accelium`).
- **Structure (< 768 px)** : `<dl>` empilée, chaque paire dans `p-4` séparée par `divide-y divide-line` ; `<dt>` en `text-[0.72rem] uppercase tracking-wide font-600 text-orange700` (4,97:1), `<dd>` en `text-[0.94rem] text-body mt-1`.
- **Ligne « Taux et plafond »** : mise en avant, valeur en `display text-[1.15rem] font-600 text-ink`.
- **Lien officiel** : texte « Site officiel : {domaine} », `text-orange700 font-600 underline underline-offset-2`, `target="_blank" rel="noopener noreferrer"`, pictogramme ↗ `aria-hidden` et `<span class="sr-only">(nouvel onglet)</span>`.
- **États** : repos comme ci-dessus ; survol de ligne : aucun (tableau non interactif) ; survol du lien : `decoration-2` ; focus : `.focusable` sur les liens ; chargement : sans objet ; vide : une ligne sans valeur est omise ; si aucune ligne, le composant ne rend rien ; erreur : sans objet (données statiques validées au build).
- **Placement** : juste après la définition, avant le premier H2 ; largeur de la colonne principale (8 colonnes sur 12).

### 4.2 FaqBlock (client)

- **Rôle** : accordéon de questions, avec JSON-LD `FAQPage`.
- **Structure** : H2 `display h-sec font-600 text-ink mb-6` (optionnel) ; liste `divide-y divide-line border-y border-line` ; chaque question dans un `<h3>` contenant un `<button type="button" aria-expanded aria-controls>` pleine largeur, `py-5`, texte `display text-[1.1rem] font-500 text-ink`, signe « + » `text-orange text-2xl` (décoratif, `aria-hidden`) qui pivote de 45° à l'ouverture ; panneau `role="region" aria-labelledby` avec réponse `text-body leading-relaxed measure pb-6` et lien optionnel « En savoir plus » `text-orange700 font-600`.
- **États** : repos : première question ouverte, les autres fermées ; survol : question en `text-orange700` ; focus : `.focusable` sur le bouton (anneau autour de toute la ligne) ; ouvert : « + » à 45°, panneau visible ; chargement : sans objet (réponses dans le HTML initial, masquées par l'attribut `hidden`, donc indexables via le JSON-LD) ; vide : ne rend rien, ni titre ni JSON-LD ; erreur : sans objet.
- **Clavier** : Tab entre questions, Entrée ou Espace pour ouvrir ; pas de flèches imposées.
- **Mobile** : identique, question à `text-[1.02rem]`, zone tactile ≥ 44 px (le `py-5` l'assure).
- **Règle JSON-LD** : **un seul `FAQPage` par page**. Si une page affiche plusieurs FaqBlock (FAQ transversale par thème), tous passent `withSchema={false}` et la page injecte un schéma unique fusionné.

### 4.3 SourcesBlock

- **Rôle** : lister les sources officielles d'une page, avec le domaine visible.
- **Structure** : conteneur `rounded-2xl bg-cream p-6 lg:p-7` ; kicker `kicker text-orange700 mb-3` « Sources » (4,51:1 sur crème) ; `<ol>` numérotée `space-y-2 text-[0.88rem]` ; chaque entrée : lien `text-body underline decoration-line underline-offset-2` sur le titre, puis domaine `text-slate` (4,86:1 sur crème) entre parenthèses ; ligne finale optionnelle « Sources consultées le {date} » `text-[0.8rem] text-slate`, alimentée par `derniereVerification`.
- **Liens** : `target="_blank" rel="noopener noreferrer"` et `<span class="sr-only">(nouvel onglet)</span>`.
- **États** : survol : `text-orange700 decoration-orange700` ; focus : `.focusable` ; vide : ne rend rien (le frontmatter `sources` est obligatoire, contrôlé au build) ; erreur : URL invalide = domaine affiché brut (déjà géré) ; chargement : sans objet.
- **Mobile** : `p-5`, URL longues coupées par `break-words`.

### 4.4 VerifiedBadge

- **Rôle** : ligne « Vérifié le 5 octobre 2026 par Clément Barbier » sous le H1.
- **Structure** : `<p class="inline-flex items-center gap-2 text-[0.82rem] font-500 text-slateD">` (9,59:1 sur blanc, 8,71:1 sur crème) ; pastille 16 px `rounded-full bg-orange/15` avec coche `text-orange700` (pictogramme, 4,19:1 ≥ 3:1) ; la date dans un `<time dateTime="2026-10-05">` ; le nom en lien vers la fiche auteur si elle existe (`text-ink underline decoration-line`).
- **Format de date** : `toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })` (le `timeZone` évite un décalage d'un jour selon le fuseau du serveur).
- **États** : survol du nom : `text-orange700` ; focus : `.focusable` ; vide : si la date manque, ne rend rien (jamais de date inventée) ; erreur : date illisible, ne rend rien.

### 4.5 RegionMap

- **Rôle** : montrer la couverture nationale et mener vers `/regions/[slug]`.
- **Forme** : carte de France métropolitaine et Corse en **tracés simplifiés reconnaissables** (13 `<path>`, simplification ≈ 1 % des sommets, source IGN Admin Express ou Natural Earth, domaine public ou Licence Ouverte). Un cartogramme en cases est accepté pour la V2 s'il reste lisible, mais la forme de l'Hexagone est préférable pour le message « partout en France ».
- **Couleurs** : région avec page : `fill-surface stroke-line` (trait 1,5 px) ; région où Accelium a des projets : remplissage `orange/15` ; survol ou focus : `fill-orange/30` et trait `orange700` 2 px ; région sans page : `fill-cream`. Étiquettes : code à trois lettres `fill-ink` en Clash Display 600, 13 px ; aucun nombre en 10 px sur fond teinté (4,19:1 insuffisant) : les compteurs passent dans la liste.
- **Accessibilité** : le SVG est destiné à la souris ; il porte `aria-hidden="true"` et ses liens `tabIndex={-1}`. **Le parcours clavier et lecteur d'écran passe par la liste qui suit** (13 liens), ce qui évite 26 arrêts de tabulation et le piège du `role="img"` (un `role="img"` masque ses liens enfants aux technologies d'assistance).
- **Liste** : `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-[0.9rem]` ; chaque élément `rounded-lg border border-line px-3 py-2.5` avec nom `text-ink font-600` et, à droite, « {n} projets » en `text-slateD` ou une flèche `text-orange` décorative.
- **Région sans page** : ne pas afficher « Bientôt » (cela contredit le message national). Lien vers `/contact?region={slug}` avec le libellé « Nous consulter », `text-slateD`.
- **États** : survol : case de liste `border-ink`, région correspondante surlignée sur la carte (même `data-region`) ; focus : `.focusable` sur la liste, et la région correspondante prend le trait `orange700` ; vide : si aucune donnée, liste des 13 régions vers le contact (jamais de carte vide) ; chargement : sans objet (SVG en ligne) ; erreur : si le SVG ne s'affiche pas, la liste suffit.
- **Mobile** : carte à 100 % de largeur, max 420 px, centrée ; liste en une colonne sous la carte.
- **Accueil** : dans la section « Présence nationale », carte à gauche (5 colonnes), H2 et 3 chiffres à droite (7 colonnes) ; fond `cream`.

### 4.6 PartnerCard

- **Rôle** : carte d'un partenaire ou d'un membre du cercle, **rendue seulement si `confirme === true`** (règle du brief, aucune trace dans le HTML sinon).
- **Structure** : carte `rounded-2xl border border-line bg-surface p-6` ; en tête, logo dans une vignette `w-14 h-14 rounded-lg border border-line bg-white p-1.5 object-contain` avec **`alt=""`** (le nom est écrit juste à côté), sinon initiales `bg-cream text-slateD text-[0.75rem] font-600` ; nom `display text-[1.05rem] font-600 text-ink` ; type et ville `text-[0.8rem] text-slate` (« Expert-comptable · Orléans ») ; phrase `mt-3 text-[0.9rem] text-body` (≤ 160 caractères).
- **Lien** : si `site`, toute la carte est un lien externe (`target="_blank" rel="noopener noreferrer"`, `aria-label="{nom}, site web (nouvel onglet)"`), pictogramme ↗ `text-slate` en haut à droite.
- **États** : survol : `border-ink`, logo sans filtre (au repos, les logos peuvent passer en `grayscale` 100 % puis 0 au survol, pour l'homogénéité) ; focus : `.focusable` sur la carte ; vide : non confirmé = rien ; logo en erreur de chargement : bascule sur les initiales (`onError`, composant client minimal) ; chargement : logo en `loading="lazy"`.
- **Grille** : `grid sm:grid-cols-2 lg:grid-cols-3 gap-4`, groupée par catégorie avec un H3 `kicker text-orange700`.

### 4.7 NewsletterSignup (client)

- **Rôle** : inscription à la newsletter (audience Resend), consentement explicite, double opt-in.
- **Variantes** : `sombre` (encadré `rounded-2xl bg-ink text-white p-7 lg:p-10`, fin d'article et accueil) et `clair` (`rounded-2xl bg-cream p-7`, pied de page ressources).
- **Structure** : kicker (`orange2` sur sombre, 5,86:1 ; `orange700` sur clair) « Newsletter mensuelle » ; titre `display text-[1.6rem] font-600` « Recevoir la prochaine newsletter » ; phrase (`white/70` 8,33:1 ou `text-body`) « Une fois par mois : les appels à projets ouverts, les dispositifs qui changent, un projet financé. » ; formulaire en ligne dès `sm` : `<label>` visible « Adresse email professionnelle », champ `type="email" autocomplete="email" inputmode="email" required`, bouton primaire « M'inscrire » ; case de consentement obligatoire (`h-5 w-5 accent-orange`) « J'accepte de recevoir la newsletter d'Accelium Conseil. Désinscription en un clic. » avec lien vers la politique de confidentialité ; Turnstile invisible ; champ piège (honeypot) masqué comme dans `DiagnosticForm`.
- **Champ** : `rounded-xl bg-surface px-4 py-3 text-ink`, **bordure `border-slate`** (5,35:1 ; la bordure `line` actuelle des formulaires, 1,30:1, n'est pas perceptible), placeholder `text-slate` « prenom.nom@entreprise.fr ». Sur fond sombre, champ blanc identique (le champ blanc sur `ink` fait 15,67:1).
- **États** : repos ; survol du champ : `border-ink` ; focus du champ : `border-orange700` 2 px + anneau `ring-2 ring-orange/20` ; chargement : bouton désactivé « Inscription… » + pictogramme rotatif, `aria-busy`, champ en lecture seule ; succès : le formulaire est remplacé par un message `role="status"` : « Vérifiez votre boîte : un email de confirmation vient de partir. Cliquez sur le lien pour valider votre inscription. » ; déjà inscrit : même message (ne pas révéler l'existence d'une adresse) ; erreur de saisie : « Saisissez une adresse email valide. » sous le champ, `orange700` sur clair ou `orange2` sur sombre, `aria-invalid`, focus renvoyé sur le champ ; consentement manquant : « Cochez la case pour confirmer votre inscription. » ; erreur serveur : bandeau `role="alert"` « L'inscription n'a pas abouti. Réessayez dans un instant ou écrivez-nous depuis la page contact. » ; vide : sans objet.
- **Mobile** : champ et bouton empilés, bouton pleine largeur.
- **Mesure** : événement `newsletter_inscription` à l'envoi réussi (A4).

### 4.8 CaseCard enrichie

- **Rôle** : carte d'un cas client avec montant, taux et délai (pages dispositif, région, secteur, accueil « Résultats »).
- **Structure** : lien bloc `group flex flex-col h-full rounded-2xl border border-line bg-surface p-6` ; image optionnelle en tête (`photo aspect-[16/10]`, marge négative `-mx-6 -mt-6 mb-5`, `rounded-t-2xl`) ; pastille secteur `text-[0.72rem] font-600 uppercase tracking-wide text-orange700 bg-orange/5 rounded-full px-3 py-1` (4,70:1 ; `orange/10` est à 4,43:1) ; montant `display text-[1.9rem] font-600 text-ink leading-none mt-4` ; libellé `text-[0.8rem] text-slate` « d'aide obtenue » (seul libellé autorisé avec « montant mobilisé ») ; titre du projet `mt-3 text-[0.88rem] font-600 text-slateD` ; contexte `mt-2 text-[0.92rem] text-body flex-1` (≤ 140 caractères) ; pied `mt-4 pt-4 border-t border-line` en grille de 3 colonnes égales : Financeur, Taux, Délai, chacun avec intitulé `text-[0.7rem] uppercase tracking-wide text-slate` et valeur `text-[0.88rem] font-600 text-ink`.
- **Règles** : jamais de nom de client (cas anonymisés) ; le taux est « taux d'aide » (ex. « 40 % ») et non un taux de succès.
- **États** : survol : `border-ink`, montant en `text-orange700`, image `scale(1.06)` (classe `photo` existante) ; focus : `.focusable` sur la carte entière ; vide : champ facultatif absent = colonne omise, pied masqué si les trois manquent ; grille vide : la section parente ne rend pas son H2 ; chargement : « Charger plus » de `CasGrid` (6 cas rendus côté serveur, puis +6) ; erreur d'image : fond `bg-cream` sans image.
- **Mobile** : pleine largeur, pied en 3 colonnes conservé (valeurs courtes), texte à `0.84rem`.

### 4.9 TocSidebar

- **Rôle** : sommaire ancré pour les pages de plus de 1 200 mots (dispositif, région, newsletter, glossaire).
- **Structure (≥ 1 024 px)** : `<nav aria-label="Sur cette page">` dans la colonne latérale (4 colonnes sur 12), `sticky top-28`, `rounded-2xl border border-line bg-cream p-6` ; kicker `text-orange700` (4,51:1) ; liste `space-y-2.5 text-[0.88rem]`, liens `text-body` ; sous le sommaire, le CtaContext de la page.
- **Structure (< 1 024 px)** : `<details>` replié sous le H1, résumé « Sur cette page » `font-600 text-ink` avec chevron, liste identique ; aucune colonne latérale.
- **Section courante (facultatif, client)** : `IntersectionObserver` ; lien actif `text-ink font-600` avec filet gauche 2 px `border-orange` et `aria-current="location"`.
- **États** : survol : `text-orange700` ; focus : `.focusable` ; vide : moins de 3 entrées, ne rend rien ; chargement et erreur : sans objet (sans JS, le sommaire reste fonctionnel).
- **Cible des ancres** : chaque H2 porte un `id` en slug français et `scroll-margin-top: 7rem` (hauteur du header).

### 4.10 CtaContext

- **Rôle** : appel à l'action qui transmet le contexte au formulaire (`/contact?dispositif=`, `offre=`, `secteur=`, `region=`, `objet=`).
- **Structure** : encadré `rounded-2xl bg-ink text-white p-7` ; titre optionnel `display text-[1.35rem] font-600` (ex. « Un projet Fonds Chaleur ? ») ; phrase `text-[0.92rem] text-white/70` (8,33:1) ; bouton primaire pleine largeur dans la colonne latérale, largeur auto dans le corps ; lien secondaire facultatif « ou appelez le {téléphone du cabinet} » `text-white underline decoration-white/40` (numéro du cabinet uniquement, jamais d'une personne).
- **Paramètres** : valeur encodée (`encodeURIComponent`), slugs uniquement ; le formulaire pré-remplit le champ correspondant (A3).
- **États** : survol et focus du bouton : voir §2.1 ; sur `ink`, l'anneau #C2480F fait 3,15:1 ; vide : libellé absent, ne rend rien ; erreur : paramètre inconnu, lien vers `/contact` sans paramètre.
- **Mobile** : encadré pleine largeur, bouton pleine largeur ; sur les pages longues, une barre fixe basse est **proscrite** (elle masque le contenu et double le CTA du header).

### 4.11 Testimonial

- **Rôle** : un verbatim client en exergue (accueil « Ils nous font confiance », pages offre et cas).
- **Données** : `citation`, `auteur` (fonction), `entreprise`, `confirme`. Rendu seulement si `confirme === true` ; **jamais** les verbatims d'Edeis ni de MEBOR, ni d'Arboriste du Sud.
- **Structure** : `<figure>` `max-w-3xl` ; guillemet ouvrant « décoratif `display text-[4rem] leading-none text-orange` (`aria-hidden`) ; `<blockquote>` `display text-[clamp(1.35rem,1.1rem_+_1vw,1.9rem)] font-500 text-ink leading-snug` ; `<figcaption>` `mt-5 text-[0.9rem] text-slateD` : « {fonction}, {entreprise} » avec filet orange de 24 px avant. Fond de section `cream`. Pas d'étoiles ni de note inventée ; la note globale (9,1/10, enquête mai à juin 2025, 18 clients) vient de `config/chiffres.ts` et s'affiche à part, datée.
- **États** : repos seulement (non interactif) ; vide : ne rend rien, la section parente non plus ; plusieurs verbatims : un seul affiché, pas de carrousel automatique (si carrousel, boutons précédent et suivant, pause, `aria-live="polite"`).
- **Mobile** : citation à 1,3 rem, guillemet à 3 rem.

### 4.12 Quiz (client)

- **Rôle** : orientation en 3 à 5 questions vers les dispositifs pertinents, puis vers le diagnostic. Ce n'est **pas** un test d'éligibilité : aucune promesse, aucun « vous êtes éligible ».
- **Structure** : carte `rounded-2xl border border-line bg-surface p-6 lg:p-8` ; barre de progression `h-1.5 rounded-full bg-sand` remplie en `bg-orange` + texte « Question 2 sur 4 » `text-[0.8rem] text-slateD` (`aria-live="polite"`) ; chaque question est un `<fieldset>` avec `<legend class="display text-[1.35rem] font-600 text-ink">` ; réponses en cartes radio `rounded-xl border border-slate px-4 py-3.5` (vraies `<input type="radio">` masquées visuellement mais focalisables) ; boutons « Retour » (`btn-ghost`) et « Continuer » (primaire).
- **Résultat** : titre « Les pistes à étudier pour votre projet » ; 2 à 4 cartes de dispositifs (nom, financeur, une phrase, lien vers la page dispositif) ; phrase obligatoire `text-[0.85rem] text-slate` : « Ces pistes sont indicatives. L'éligibilité dépend de votre projet et du calendrier du financeur : le diagnostic gratuit la confirme. » ; CtaContext « Demander un diagnostic gratuit » avec `?objet=quiz&pistes={slugs}`.
- **États** : repos ; survol d'une réponse : `border-ink bg-cream` ; réponse choisie : `border-orange700 bg-orange/5` + coche `text-orange700` ; focus : anneau `.focusable` sur la carte réponse (via `:focus-visible` de l'input) ; après changement de question, le focus va sur la `<legend>` (`tabIndex={-1}`) ; chargement : si le résultat est calculé côté serveur, squelette de 3 cartes `bg-sand animate-pulse` (désactivé sous `prefers-reduced-motion`) ; vide (aucune piste) : « Votre projet ne correspond à aucune piste automatique. Décrivez-le nous : beaucoup de financements se trouvent au cas par cas. » + CTA ; erreur (Continuer sans réponse) : « Choisissez une réponse pour continuer. » `text-orange700`, `role="alert"`.
- **Mobile** : réponses pleine largeur empilées ; boutons en bas, « Continuer » pleine largeur.
- **Mesure** : événements `quiz_demarre`, `quiz_termine`, `quiz_vers_diagnostic`.


## 5. Gabarits de pages

Squelette commun des pages de contenu : bandeau d'en-tête `bg-cream` (`pt-32 lg:pt-40 pb-12 lg:pb-16`, sous le header fixe) avec fil d'Ariane, kicker, H1 `display h-mega font-600 text-ink max-w-[22ch]`, VerifiedBadge, chapô `lede text-body measure` ; puis corps `wrap py-16 lg:py-24` en grille `lg:grid-cols-12 gap-12` : colonne principale `lg:col-span-8` (`prose-accelium` pour le texte), colonne latérale `lg:col-span-4` (TocSidebar + CtaContext) ; puis RelatedLinks, puis CtaBlock existant (`bg-ink`).

### 5.1 Dispositif (`/le-financement-public/dispositifs/[slug]`)

Ordre (plan §6.1) : fil d'Ariane ; kicker « Dispositif · {Financeur} » ; H1 ; VerifiedBadge ; `definition` en chapô (40 à 70 mots) ; DispositifTable ; H2 « À qui s'adresse… » ; H2 « Ce qu'il finance » ; H2 « Montants et taux » (tableau par taille d'entreprise, même style que DispositifTable, en cartes sous 768 px) ; H2 « Calendrier et procédure » (étapes numérotées : pastille 32 px `rounded-full bg-ink text-white display` + délai en `text-slateD`) ; H2 « Les erreurs qui font échouer un dossier » (liste, pictogramme « ! » `text-orange700`) ; H2 « Comment Accelium vous accompagne » + CtaContext `dispositif` ; H2 « Projets financés » (CaseCard, 3 colonnes dès `md`) ; FaqBlock ; SourcesBlock ; RelatedLinks. Colonne latérale : TocSidebar puis CtaContext (sticky ensemble). Mobile : TocSidebar en `<details>` sous le chapô, CtaContext après « Comment Accelium vous accompagne ».

### 5.2 Région (`/regions/[slug]`) et hub `/regions`

Page : kicker « Aides par région » ; H1 ; définition (60 mots) ; à droite du bandeau (≥ 1 024 px), une mini RegionMap (240 px, région courante en `orange/30`, non interactive, `aria-hidden`) ; H2 « Les financeurs en {région} » (grille de 6 cartes texte, sans logo, cf. `docs/logos-financeurs.md`) ; H2 « Les dispositifs régionaux » (tableau : nom, objet, taux, calendrier, source ; cartes sous 768 px) ; H2 « Les dispositifs nationaux mobilisables » (cartes liens vers les pages dispositifs) ; H2 « Nos projets financés en {région} » (CaseCard) ; H2 « Comment nous intervenons » (deux colonnes : à distance, sur site) ; FaqBlock ; SourcesBlock ; CtaContext `region`. Aucune mention d'établissement local ni d'adresse régionale.
Hub : H1 « Des aides publiques dans toutes les régions » ; RegionMap pleine taille + liste ; chiffres de `config/chiffres.ts` datés.

### 5.3 Partenaires et cercle (`/cabinet/partenaires`)

H1 « Nos partenaires et le cercle Accelium » ; paragraphe d'intention `lede` ; sections par catégorie (bureaux d'études, experts-comptables, banques, écoles, réseaux), chacune : H2 `display text-[1.6rem]`, grille de PartnerCard ; section « Les membres du cercle » (même composant, fond `cream`) ; section « Devenir partenaire » : encadré `bg-ink` avec CtaContext `objet=partenariat`. **Vide** : tant qu'aucune entrée n'est `confirme: true`, les sections de grilles ne sont pas rendues ; la page affiche seulement l'intention, la description du cercle (sans noms) et « Devenir partenaire » ; la page reste en `noindex` tant qu'elle compte moins de 5 entrées confirmées (décision à valider par A1 et A2). JSON-LD `ItemList` des seules entrées confirmées.

### 5.4 Newsletter (`/ressources/newsletters/[slug]`) et hub

Article : bandeau crème avec kicker « Newsletter n° {numero} », H1 = titre, date `<time>` `text-slateD`, résumé en chapô ; corps `prose-accelium` en colonne principale ; TocSidebar construite depuis les rubriques ; les clients félicités n'apparaissent nommés que s'ils sont `confirme: true`, sinon la phrase est anonymisée à la rédaction ; NewsletterSignup (variante sombre) en fin d'article ; navigation « Newsletter précédente » et « suivante » (deux cartes `border-line`, flèches `text-orange`).
Hub : H1 « Les newsletters d'Accelium » ; NewsletterSignup (variante claire) en tête ; liste antéchronologique en cartes `rounded-2xl border border-line p-6` : date et numéro `kicker text-orange700`, titre `display text-[1.3rem]`, résumé 2 lignes, thèmes en pastilles `bg-cream text-slateD`. Vide : la route n'est pas publiée tant qu'il n'y a aucune newsletter.

### 5.5 Glossaire (`/le-financement-public/glossaire`)

H1 « Glossaire du financement public » ; chapô ; barre alphabétique `sticky top-20 bg-surface/95 backdrop-blur border-b border-line` : 26 lettres en liens ancrés `w-9 h-9 rounded-full` (lettres sans terme : `text-slate`, non cliquables, `aria-disabled`) ; filtre texte facultatif (client) `<input type="search">` avec bordure `slate` et message « Aucun terme ne correspond à {saisie}. » quand vide ; termes groupés par lettre sous un H2 `display text-[2rem] text-orange700` ; chaque terme dans une `<dl>` : `<dt id="{slug}">` `display text-[1.25rem] font-600 text-ink` et `<dd>` `text-body measure` (40 à 80 mots, citable) + lien « Voir le dispositif » `text-orange700`. Mobile : barre alphabétique en défilement horizontal interne (`overflow-x-auto`, la page elle ne défile pas horizontalement). JSON-LD `DefinedTermSet` (A2).

### 5.6 FAQ transversale (`/le-financement-public/questions-frequentes`)

H1 « Questions fréquentes sur les aides publiques » ; chapô ; navigation par thèmes (pastilles ancrées `rounded-full border border-slate px-4 py-2`, actif `bg-ink text-white`) ; une section par thème : H2 + FaqBlock `withSchema={false}` et `title` vide ; **un seul JSON-LD `FAQPage` fusionné** pour la page ; encadré final CtaContext « Votre question n'y est pas ? » `objet=question`.

### 5.7 Merci (`/merci-diagnostic`, `/merci-livre-blanc`)

`noindex`. Bandeau crème plein, contenu centré `max-w-2xl` : pastille 56 px `rounded-full bg-orange/15` avec coche `text-orange700` ; H1 `display h-sec` « Merci, votre demande est bien reçue » (livre blanc : « Votre livre blanc est prêt ») ; phrase `lede` ; « Et maintenant ? » en 3 étapes numérotées (pastilles `bg-ink text-white`) : accusé de réception par email, rappel par un consultant dans le délai affiché sur la page contact (« réponse sous 24 h ouvrées », une seule source pour ce délai), premier échange gratuit ; téléphone du cabinet en `display text-[1.4rem] text-ink` (lien `tel:`) ; 3 liens contextuels en cartes (cas clients, dispositifs, newsletter). Pas de second formulaire ni de CtaBlock. Livre blanc : bouton primaire « Télécharger le PDF » en premier élément après le H1.


## 6. Image OG par défaut (pour A2)

`app/opengraph-image.tsx` existe déjà (A2) ; la spécification ci-dessous fixe les valeurs exactes. Unités en pixels sur la toile 1 200 × 630.

| Élément | Valeur |
|---|---|
| Toile | 1 200 × 630, fond `#1B2336` plein, sans dégradé |
| Marges | 80 à gauche et à droite, 72 en haut, 72 en bas (zone utile 1 040 × 486) |
| Logo | `public/assets/logo-horizontal-blanc.png`, hauteur 52, largeur 249 (ratio 4,79), coin haut gauche en (80, 72) |
| Kicker | « CABINET DE CONSEIL EN FINANCEMENTS PUBLICS », General Sans 600, 20, interlettrage 4 (0,2em), capitales, couleur `#FF7536` (5,86:1), haut du bloc à y = 282 |
| Titre | « Financez vos projets d'investissement, d'innovation et de transition », Clash Display 600, 60, interligne 1,05 (63), interlettrage -1,2 (-0,02em), `#FFFFFF` (15,67:1), largeur max 1 000, 3 lignes max, haut du bloc à y = 318 (12 sous le kicker et son interligne) |
| Baseline | « Partout en France · accelium-conseil.fr », General Sans 400, 26, couleur `rgba(255, 255, 255, 0.72)` (≈ 8,7:1), ligne de base à y = 558, alignée à gauche x = 80 |
| Accent | barre `#F26122` de 1 200 × 8 collée au bord bas (y = 622) ; aucun autre orange |
| Alt | « Accelium Conseil : financez vos projets d'investissement, d'innovation et de transition grâce aux aides publiques » |

Variante par page (facultative, `opengraph-image.tsx` dans les segments) : kicker = type de page (« DISPOSITIF · ADEME », « AIDES PAR RÉGION », « CAS CLIENT », « NEWSLETTER »), titre = H1 ; taille 60 si ≤ 60 caractères, 52 si ≤ 90, au-delà coupe au mot + « … ». Jamais de montant ni de taux dans l'image (ils changent, l'image est mise en cache par les réseaux).

Recadrages : LinkedIn, X et Facebook affichent la toile entière (1,91:1) ; WhatsApp et iMessage peuvent recadrer au carré central (x 285 à 915) : le logo sera coupé, c'est accepté, le titre reste lisible.

**Note polices (bloquant pour la conformité typographique)** : `next/og` (satori) ne lit pas le WOFF2. Le dépôt ne contient que `public/fonts/*.woff2` : A2 doit ajouter les versions TTF ou WOFF de Clash Display 600 et General Sans 400 et 600 (licence Fontshare ITF Free Font License, usage commercial permis) hors de `public/` (par exemple `assets/og-fonts/`) et les passer dans l'option `fonts` d'`ImageResponse`. Sans cela, l'image sort dans la police de repli, ce qui est le cas aujourd'hui (`fontFamily: "sans-serif"`).

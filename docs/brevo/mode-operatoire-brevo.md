# Mode opératoire Brevo : campagne de demandes de liens (L8.3)

**Pour qui.** Clément BARBIER. **Préparé le** 03/10/2026. **Durée** : 1 h de mise en place (dont l'attente DNS), puis 10 minutes par envoi.
**Rien n'est envoyé à ce jour.** Les envois se font **après la bascule DNS** du site (voir `docs/go-live.md`) : vérifier d'abord que https://www.accelium-conseil.fr, /contact, /regions/centre-val-de-loire et /secteurs/foret-bois répondent.

Fichiers du dossier `docs/brevo/` :

| Fichier | Usage |
|---|---|
| `contacts-brevo.csv` | import Brevo (18 lignes : 4 avec email générique, 14 sans email à traiter à la main) |
| `sources-contacts.md` | source de chaque adresse et constat pour chaque cible |
| `modele-email-partenaire-client.html` | Telos Santé, puis partenaires de la deuxième vague |
| `modele-email-institution.html` | Dev'up (et CCI si l'adresse est confirmée) |
| `modele-email-reseau-federation.html` | Fibois Centre-Val de Loire, Fibois France |
| `modele-email-annuaire-plateforme.html` | annuaires (texte réutilisable pour les formulaires) |
| `envoi-manuel.md` | 14 cibles par formulaire, compte ou contact direct, avec le texte à coller |

## 1. Créer la liste

1. Brevo > **Contacts** > **Listes** > **Créer une liste**.
2. Nom : `Autorité 2026 : demandes de liens` ; dossier : `Partenariats`.

## 2. Créer les attributs

Brevo > **Contacts** > **Paramètres** > **Attributs de contact** > **Ajouter un attribut**. Type **Texte** pour tous :

`ORGANISATION`, `FONCTION`, `CIBLE`, `PRIORITE`, `PAGE_CIBLE`, `CANAL`.

`PRENOM` et `NOM` existent déjà dans un compte Brevo en français (sinon, les créer aussi). Ils restent vides : les adresses sont génériques, les messages commencent par « Bonjour, ».

## 3. Importer le CSV

1. **Contacts** > **Importer des contacts** > **Importer un fichier** > choisir `contacts-brevo.csv`.
2. Séparateur : **point-virgule** ; encodage : **UTF-8** (vérifier dans l'aperçu que « Médiateur », « Pépinières », « Santé » s'affichent bien).
3. Mapping : chaque colonne vers l'attribut du même nom (EMAIL vers l'adresse email).
4. Liste de destination : `Autorité 2026 : demandes de liens`.
5. Statut : ne pas cocher d'option d'abonnement à la newsletter. Ces contacts ne doivent **jamais** être ajoutés aux listes de la newsletter.
6. Résultat attendu : **4 contacts importés**. Les 14 lignes sans email sont signalées comme non importées : c'est normal, elles sont traitées par `envoi-manuel.md`.

## 4. Expéditeur et domaine (à faire une seule fois)

### 4.1 Expéditeur

Brevo > **Expéditeurs, domaines et IP dédiées** > **Expéditeurs** > **Ajouter un expéditeur** :
- Nom : `Clément BARBIER, Accelium Conseil`
- Email : `contact@accelium-conseil.fr` (les réponses arrivent dans la boîte habituelle). Valider le code reçu.

### 4.2 Authentifier le domaine accelium-conseil.fr (DNS chez IONOS)

1. Brevo > **Domaines** > **Ajouter un domaine** > `accelium-conseil.fr` > choisir la configuration manuelle (IONOS n'est pas toujours proposé en automatique). Brevo affiche les enregistrements à créer : **les recopier exactement tels qu'affichés** (les valeurs ci-dessous sont indicatives).
2. IONOS > **Domaines et SSL** > `accelium-conseil.fr` > **DNS** > **Ajouter un enregistrement** :

| Enregistrement | Type | Nom (hôte) | Valeur |
|---|---|---|---|
| Code de vérification Brevo | TXT | `@` | `brevo-code:xxxxxxxx` (fourni par Brevo) |
| DKIM | CNAME (ou TXT selon l'affichage Brevo) | `brevo1._domainkey` et `brevo2._domainkey` | valeurs fournies par Brevo |
| DMARC | TXT | `_dmarc` | si aucun DMARC n'existe : `v=DMARC1; p=none; rua=mailto:rua@dmarc.brevo.com` (valeur proposée par Brevo) |
| SPF | TXT | `@` | **un seul enregistrement SPF par domaine** : si Brevo demande un `include`, l'ajouter dans l'enregistrement SPF existant, sans en créer un second |

3. **Attention à la messagerie existante.** Le domaine envoie déjà des emails (Outlook / Microsoft 365, IONOS). Avant toute modification, faire une capture de la zone DNS actuelle. Le SPF fusionné doit garder les `include` existants, par exemple : `v=spf1 include:spf.protection.outlook.com include:spf.brevo.com ~all` (adapter à l'existant ; ne jamais supprimer un `include` en place). Si un DMARC existe déjà, ne pas le remplacer : ajouter seulement l'adresse `rua` de Brevo si souhaité.
4. Attendre la propagation (de quelques minutes à 24 h), puis Brevo > **Domaines** > **Vérifier**. Les quatre pastilles doivent être vertes avant le premier envoi.
5. Ne pas toucher aux enregistrements A, AAAA et CNAME `www` prévus par la bascule du site (`docs/go-live.md`) : les deux chantiers sont indépendants mais se font dans la même zone DNS.

## 5. Créer les envois

Avec seulement 4 contacts, deux options équivalentes. **Option conseillée : une campagne par modèle**, chacune ciblant un segment.

### 5.1 Segments

**Contacts** > **Segments** > **Créer un segment**, dans la liste `Autorité 2026 : demandes de liens` :
- `Liens : partenaire` : CIBLE est égal à `partenaire-client` (Telos Santé)
- `Liens : institution` : CIBLE est égal à `institution` (Dev'up)
- `Liens : réseau` : CIBLE est égal à `reseau-federation` (Fibois Centre-Val de Loire, Fibois France)

### 5.2 Campagnes

**Campagnes** > **Emails** > **Créer une campagne**, une par segment :

| Campagne | Segment | Modèle | Objet | Préheader |
|---|---|---|---|---|
| Liens 1 partenaire | Liens : partenaire | `modele-email-partenaire-client.html` | Un lien vers notre nouveau site sur votre page partenaires ? | Une petite demande : ajouter le lien https://www.accelium-conseil.fr sur la fiche Accelium Conseil. |
| Liens 2 institution | Liens : institution | `modele-email-institution.html` | Accelium Conseil : demande de référencement dans votre annuaire | Cabinet de conseil en financements publics, siège à Tours, intervention partout en France. |
| Liens 3 réseau | Liens : réseau | `modele-email-reseau-federation.html` | Une fiche pratique gratuite sur les aides publiques pour vos adhérents | Dispositifs ouverts, calendrier, erreurs à éviter : un contenu rédigé pour votre filière, relu par vos équipes. |

Pour chaque campagne :
1. Expéditeur : `Clément BARBIER, Accelium Conseil` <contact@accelium-conseil.fr> ; adresse de réponse : la même.
2. **Conception** > **Coder votre propre HTML** > coller le contenu du fichier `.html` (ouvrir le fichier dans le Bloc-notes, tout sélectionner, copier).
3. Vérifier que Brevo reconnaît `{{ contact.ORGANISATION }}`, `{{ contact.PAGE_CIBLE }}` et `{{ unsubscribe }}` (aperçu avec un contact de la liste).
4. Paramètres avancés : **désactiver le suivi des ouvertures et des clics** (message de relation professionnelle, liens plus propres) ; ne pas ajouter de pièce jointe ; ne pas activer le pied de page publicitaire si l'offre le permet.

### 5.3 Alternative : envoi un par un

Pour un message encore plus personnel (recommandé pour Telos Santé, partenaire connu), envoyer depuis Outlook en recopiant le texte du modèle et en remplaçant les variables. Dans ce cas, pas de lien de désinscription Brevo : ajouter la phrase « Si vous ne souhaitez plus recevoir de messages de notre part, répondez simplement à cet email. »

## 6. Test

1. Dans chaque campagne : **Envoyer un test** à contact@accelium-conseil.fr et à une adresse personnelle Gmail.
2. Contrôler : objet et préheader, variables remplacées (nom de l'organisation, lien de la page), lien cliquable et fonctionnel vers le site en production (https), lien de désinscription présent, affichage sur téléphone, arrivée en boîte de réception (pas en spam).
3. En cas d'arrivée en spam : vérifier l'authentification du domaine (§4.2) avant tout envoi réel.

## 7. Envoi échelonné

- **Semaine 1** (mardi ou jeudi, entre 9h et 10h) : P1, Telos Santé (campagne 1) ; en parallèle, démarches manuelles P1 de `envoi-manuel.md` (Médiateur, La French Fab, Pépinières, Hellopro, Trustfolio).
- **Semaine 2** : P2, Dev'up (campagne 2) ; démarches manuelles CCI Touraine, Kompass, Bpifrance.
- **Semaine 3** : P3, Fibois Centre-Val de Loire et Fibois France (campagne 3) ; formulaires FNB, UNPG, Routes de France ; écoles.
- **Relance à J+15** sans réponse : réponse directe depuis Outlook au message envoyé (« Je me permets de revenir vers vous au sujet de ma demande du [date]… »), une seule relance.

## 8. Suivi des réponses

Les réponses arrivent dans contact@accelium-conseil.fr. Tenir le tableau ci-dessous (ou le recopier dans un onglet Excel), puis reporter le statut dans `docs/plan-autorite.md` (à faire, envoyé, relancé, obtenu, refusé).

| # | Cible | Canal | Date d'envoi | Relance (J+15) | Réponse | Lien obtenu (URL) | Statut |
|---|---|---|---|---|---|---|---|
| 1 | Médiateur des entreprises | dossier | | | | | à faire |
| 2 | Telos Santé | Brevo | | | | | à faire |
| 3 | La French Fab | espace entreprise | | | | | à faire |
| 4 | Pépinières Tours Métropole | contact direct | | | | | à faire |
| 5 | Hellopro | inscription | | | | | à faire |
| 6 | Trustfolio | inscription | | | | | à faire |
| 7 | compass-financement | à requalifier | | | | | en attente de décision |
| 8 | Dev'up Centre-Val de Loire | Brevo | | | | | à faire |
| 9 | CCI Touraine | formulaire | | | | | à faire |
| 10 | Kompass | inscription | | | | | à faire |
| 11 | Bpifrance Club PAI / RIA | contact direct | | | | | à faire |
| 12a | Lead Innovation Day (EDHEC) | contact direct | | | | | à faire |
| 12b | INTERFACES (Centrale Lyon) | à confirmer | | | | | à faire |
| 13a | Fibois Centre-Val de Loire | Brevo | | | | | à faire |
| 13b | Fibois France | Brevo | | | | | à faire |
| 13c | FNB | formulaire | | | | | à faire |
| 14 | UNPG | formulaire | | | | | à faire |
| 15 | Routes de France | formulaire | | | | | à faire |

Quand un lien est obtenu : vérifier qu'il pointe vers https://www.accelium-conseil.fr (https et www), noter l'URL de la page qui le porte, et le compter dans les « domaines référents » du tableau de bord mensuel (`docs/tableau-de-bord.md`).

## 9. Rappel RGPD

- **Base légale** : intérêt légitime (art. 6.1.f du RGPD). Pour la prospection B2B par email, la CNIL admet l'envoi sans consentement préalable lorsque le message est en rapport avec l'activité professionnelle du destinataire (art. L34-5 du code des postes et des communications électroniques), à condition d'informer et de permettre l'opposition. Les adresses utilisées ici sont des adresses **génériques d'organisations** (contact@), publiées sur leur site officiel ; aucune adresse nominative n'a été collectée.
- **Information** : chaque modèle indique l'origine de l'adresse, le responsable du traitement et renvoie à la politique de confidentialité du site.
- **Opposition** : lien de désinscription Brevo `{{ unsubscribe }}` dans chaque email ; toute demande reçue par réponse est traitée immédiatement (désinscription dans Brevo, mention dans le tableau de suivi). Ne jamais réécrire à une organisation qui a refusé.
- **Minimisation et durée** : pas de données au-delà des colonnes du CSV ; supprimer de Brevo les contacts sans suite trois ans après le dernier échange (durée recommandée par la CNIL pour les prospects).
- **Séparation** : cette liste ne sert qu'aux demandes de liens ; jamais d'ajout à la newsletter sans inscription volontaire (double opt-in, voir `docs/newsletter.md`).

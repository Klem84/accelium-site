# Email de confirmation des références (clients, partenaires, cercle)

**Objet.** Obtenir l'accord écrit de chaque entreprise avant d'afficher son nom, son logo, une phrase et, le cas échéant, un verbatim sur accelium-conseil.fr.
**Qui envoie.** Clément BARBIER, depuis sa boîte habituelle, un email par entreprise (pas de copie groupée).
**Après la réponse.** Oui : passer `confirme: true` sur l'entrée dans `config/references.ts` (et corriger la phrase si l'entreprise l'a modifiée). Non ou sans réponse : ne rien changer, l'entreprise reste invisible. Refus explicite : ajouter `refuse: true`.
**Source des données.** `config/references.ts` (préparé le 27/09/2026 depuis l'extraction Monday, espace Communication).

---

## 1. Modèle pour un client

**Objet :** Votre accord pour citer [Entreprise] sur notre site

Bonjour [Prénom],

Nous mettons en ligne une nouvelle version du site d'Accelium Conseil et nous aimerions y présenter quelques entreprises que nous avons eu le plaisir d'accompagner. [Entreprise] en fait partie, après [le projet : ex. « votre nouvelle ligne de palettes financée par la Région Centre-Val de Loire »].

Concrètement, nous afficherions :

- le nom de [Entreprise] et votre logo (celui de votre site internet) ;
- la phrase suivante : « [phrase proposée, reprise de `references.ts`] » ;
- [si verbatim ou note] votre appréciation lors de notre enquête de satisfaction de 2025 : « [verbatim] » (note de [note]/10).

Rien d'autre : ni montant d'aide rattaché à votre nom, ni coordonnées de personne. Le détail chiffré de nos dossiers reste présenté de façon anonyme.

Une réponse simple suffit : **oui** ou **non**. Si vous souhaitez modifier la phrase, vous pouvez me renvoyer votre version. Vous pourrez bien sûr nous demander de retirer la mention à tout moment.

Merci encore pour votre confiance, et au plaisir d'échanger bientôt.

Bien cordialement,

Clément BARBIER
Président, Accelium Conseil
contact@accelium-conseil.fr · 06 99 79 85 85
www.accelium-conseil.fr

---

## 2. Variante pour un partenaire

**Objet :** Votre accord pour présenter [Entreprise] parmi nos partenaires

Bonjour [Prénom],

Notre nouveau site comprendra une page « Nos partenaires et le cercle Accelium ». Nous aimerions y faire figurer [Entreprise], avec votre logo, un lien vers votre site et la phrase suivante : « [phrase proposée] ».

Une réponse simple suffit : **oui** ou **non**, et n'hésitez pas à corriger la phrase si elle ne vous convient pas.

Bien cordialement,

Clément BARBIER
Président, Accelium Conseil

---

## 3. Variante pour un membre du Cercle Accelium

**Objet :** Reprise de votre portrait du Cercle Accelium sur notre site

Bonjour [Prénom],

Votre portrait publié sur LinkedIn dans la série du Cercle Accelium a été très apprécié. Nous souhaiterions le reprendre, en version courte, sur la page « Le cercle Accelium » de notre nouveau site : votre nom, votre fonction, [Entreprise], votre logo, deux phrases issues du portrait et un lien vers votre site ou votre profil LinkedIn.

Texte proposé : « [phrase proposée] »

Une réponse simple suffit : **oui** ou **non**. Vous pouvez aussi m'envoyer une photo ou un logo plus récent si vous le souhaitez.

Bien cordialement,

Clément BARBIER
Président, Accelium Conseil

---

## 4. Qui contacter et quoi montrer

Légende : **Accord Monday** = colonne « Accord contact pour publier » du tableau Félicitations. **Logo** : fichier disponible dans `public/logos/references/` (sinon, le demander dans l'email). Le nom du contact est dans Monday (tableaux Félicitations, Liste clients, Contacts du Cercle) ; il n'est pas recopié ici.

### Clients

| Priorité | Entreprise | Accord Monday | Montrer | Logo | Verbatim / note |
|---|---|---|---|---|---|
| 1 | Scierie Gauthier | Obtenu | nom, logo, phrase | à demander | note 9/10 |
| 1 | Distillerie du Beaujolais | Obtenu | nom, logo, phrase | à demander | note 10/10 |
| 1 | S.B.I. Société de Béton Industriel | Obtenu | nom, logo, phrase | oui (blanc) | non |
| 1 | Cap Bois Pyrénées | Obtenu | nom, logo, phrase | à demander | non |
| 1 | Curé Emballages | Obtenu | nom, logo, phrase | oui (basse résolution) | note 9/10 |
| 1 | Établissements Crozat Frères | Obtenu | nom, logo, phrase | oui | non |
| 1 | Charpentes Vallery | Obtenu | nom, logo, phrase | oui (blanc) | note 10/10 |
| 1 | Mokko Agencement (Menuiserie Costil) | Obtenu | nom, logo, phrase | icône seule, logo complet à demander | note 10/10 |
| 1 | Aquitaine Électrique | Obtenu | nom, logo, phrase | oui | note 10/10 |
| 1 | Breizh Bell | Obtenu | nom, phrase, témoignage | à demander | 10/10 ; faire valider la phrase « j'indique à tous nos participants… qu'Accelium est parfaite » (réponse email, pas le questionnaire) |
| 1 | Jaqu'Auto | Obtenu | nom, logo, phrase, témoignage | oui | 10/10 ; demander une phrase de témoignage |
| 2 | Scierie Labrousse | Obtenu | nom, logo, phrase | oui | non (a répondu « plus tard ») |
| 2 | Termovia | Obtenu (mise en avant) | nom, logo, phrase | oui | non |
| 2 | Fraktion | Obtenu (mise en avant) | nom, logo, phrase | oui | note 10/10 |
| 2 | Human Ocean | vide | nom, phrase, témoignage | à demander | 10/10 et verbatim du questionnaire : « Nous sommes toujours clients… » |
| 2 | VMC Bois | En attente | nom, logo, phrase | oui | non |
| 3 | Linfini | vide | nom, phrase | à demander | non |
| 3 | Technicant | vide | nom, phrase | à demander | non |
| 3 | Scierie Mourlan (Groupe Enviris) | vide | nom, logo, phrase | oui (blanc) | note 10/10 |
| 3 | Planète Terre Hauts-de-France | vide | nom, phrase | à demander | non |
| 3 | Agriopale | vide | nom, logo, phrase | oui (basse résolution) | non |
| 3 | AN-C | vide | nom, phrase | à demander | note 8/10 |
| 3 | Charier | vide | nom, logo, phrase | oui (blanc) | ne pas citer de note |
| 3 | Edeis, Ports de Saint-Malo et Cancale | vide | nom, logo, phrase | oui | **aucun verbatim ni note** (arbitrage) |
| ne pas contacter | Arboriste du Sud | Refusé | rien | exclu | refus de publication |

### Partenaires équipementiers et partenaires connectés

| Priorité | Entreprise | Montrer | Logo |
|---|---|---|---|
| 1 | HOMAG France (aussi cercle) | nom, logo, phrase | oui |
| 1 | Cattinair (aussi cercle) | nom, logo, phrase | oui (basse résolution) |
| 1 | Stradal (aussi cercle) | nom, logo, phrase | oui |
| 1 | Telos Santé (aussi cercle) | nom, logo, phrase, vérifier le lien retour vers accelium-conseil.fr | oui (blanc) |
| 1 | MEBOR / Scierie Au Pas de l'Arbre | nom, logo, phrase ; **aucun verbatim** | oui |
| 2 | Promill, VBI-BOIS, Steriflow, CETEC Industrie, Carbon Stop, 3M Maison Machine Menuiserie, ANDRE Technologies, Aa-Biomasse | nom, logo, phrase | oui |
| 2 | SNBPE, Ynergie | nom, logo, phrase | oui |
| 3 | MACH Diffusion, Atreelog, FILPACK, Aloès, Eiffel Investment Group, Dynergie, Carbon Impact | nom, phrase ; demander le logo | à demander |

### Membres du Cercle Accelium (portrait public déjà accepté sur LinkedIn)

| Priorité | Membre (entreprise) | Montrer | Logo |
|---|---|---|---|
| 1 | Alexandre Popiolek (AMPATIA) | nom, fonction, phrase | à demander |
| 1 | Brendan Tangi (Dxsigner) | nom, fonction, logo, phrase | oui |
| 1 | Christian Auriach (Scenent) | nom, fonction, phrase | à demander |
| 1 | Delphine Gardin (L'Éclaircie Communication) | nom, fonction, logo, phrase | oui |
| 1 | Hugues Julien (Stradal) | nom, fonction, logo, phrase | oui |
| 1 | Julien Levavasseur (Telos Santé) | nom, fonction, logo, phrase | oui |
| 1 | Thomas Varinot (Unici'T) | nom, fonction, phrase | à demander |
| 2 | Yves Grosjean (Courtage & Services) | nom, fonction, phrase | à demander |
| 2 | Thierry Gahamanyi (MAGMA Energy) | nom, fonction, logo, phrase (portrait programmé le 13/10/2026) | oui (basse résolution) |
| 2 | Olivier Ulmann (HOMAG France) | nom, fonction, logo, phrase (portrait prévu le 10/11/2026) | oui |
| 2 | Marc Kupietzki (Cattinair) | nom, fonction, logo, phrase (pas de portrait publié) | oui |
| 2 | Guillaume Mayot (Lukeiōn Advisory) | nom, fonction, phrase (pas de portrait publié) | à demander |
| 2 | Marleen De Haas (PGC Formation) | nom, fonction, logo, phrase (post d'arrivée à valider) | oui |

Ordre conseillé : les 11 clients de priorité 1 (accord déjà donné pour LinkedIn, relance la plus simple), puis les membres du cercle, puis les partenaires.

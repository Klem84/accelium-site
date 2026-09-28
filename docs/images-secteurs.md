# Photos des secteurs et des cas clients : évaluation et remplacements (A8, run V2)

**Date** : 27/09/2026. **Pour** : A4 (rapatriement local, `next/image`, AVIF/WebP), A6 (frontmatter `image` des secteurs), A1 (crédits dans les mentions légales).
**Règle de la charte** (DESIGN.md, « Imagerie ») : pas de photo de banque d'images cliché ; visuels industriels cohérents, de préférence français, hébergés localement, nommés et décrits.

## 1. Constat

Les 12 visuels actuels viennent d'Unsplash (licence Unsplash, usage commercial libre, sans attribution : aucun problème juridique). Le problème est **la cohérence** : 7 images sur 12 ne montrent pas le secteur qu'elles illustrent (une plantation de thé pour la distillerie, une centrale électrique américaine pour le béton, une aciérie abandonnée pour la défense, une ligne d'électroménager pour les enrobés, un toit de climatiseurs pour l'agroalimentaire), 2 sont des clichés (circuit imprimé, stéthoscope sur clavier), aucune n'est identifiable comme française.

Plus grave, le pool des vignettes de cas clients (`config/cas-clients-visuels.ts`) contient 4 images hors sujet, dont une **marque d'alcool visible** :
- `photo-1569529465841-dfecdab7503b` (distillerie) : bouteille Johnnie Walker Black Label et verre de whisky. **À retirer en priorité** (marque tierce, alcool mis en scène).
- `photo-1518709268805-4e9042af9f23` (biomasse, forêt-bois) : château d'Eltz dans la brume (Allemagne). Hors sujet.
- `photo-1605281317010-fe5ffe798166` (port-maritime) : yacht de plaisance. Contresens pour des clients portuaires industriels.
- `photo-1496247749665-49cf5b1022e9` (industrie) : aciérie sombre et vétuste. Image de déclin, contraire au message d'investissement.

## 2. Décision par secteur

Légende des licences : **CC BY-SA** et **CC BY** exigent la mention de l'auteur, de la licence et de la source (voir §4) ; **CC0**, **domaine public**, **Licence Unsplash** n'exigent rien ; **Licence Ouverte (Etalab)** exige la mention de la source (« Marine nationale ») et de la date de mise à jour.

Nommage : fichiers dans `public/images/secteurs/`, nom en français sans accent, `secteur-<slug>-<sujet>.avif` (plus `.webp` de repli si A4 le juge utile). Format de découpe : 16:10 pour les cartes (800 × 500 et 1 600 × 1 000 en 2x), 16:9 pour le haut de page secteur (1 600 × 900).

| Secteur | Image actuelle (Unsplash) | Verdict | Proposition (source, auteur, licence) | Fichier cible | Texte alternatif |
|---|---|---|---|---|---|
| agriculture | `photo-1560493676-04071c5f467b` : rangs de cultures au soleil levant | **Garder** (paysage agricole crédible, lumière chaude, pas de cliché) ; à remplacer plus tard par une photo client | Inchangé (licence Unsplash) | `secteur-agriculture-rangs-de-cultures.avif` | « Rangs de cultures dans une parcelle agricole au lever du soleil » |
| agroalimentaire | `photo-1513257805917-a0da1146eb15` : toit technique vu du ciel (climatiseurs, gaines) | **Remplacer** (ne montre pas l'agroalimentaire) | Laiterie industrielle de Surgères (Charente-Maritime), cuves inox et bâtiment de production : https://commons.wikimedia.org/wiki/File:Laiterie_industrielle_de_Surg%C3%A8res.JPG ; auteur Serge Lacotte ; **CC BY-SA 3.0** ; 4 320 × 3 240 | `secteur-agroalimentaire-laiterie-surgeres.avif` | « Cuves en inox et bâtiment de production d'une laiterie coopérative à Surgères » |
| beton | `photo-1578776349090-de61da00ff1a` : centrale thermique à cheminées rouges et blanches (hors de France) | **Remplacer** (centrale électrique, pas une centrale à béton) | Centrale à béton du chantier du tunnel du Mont-Cenis, Saint-Julien-Montdenis (Savoie), silos au pied des montagnes : https://commons.wikimedia.org/wiki/File:01-_Centrale_%C3%A0_b%C3%A9ton_-_Chantier_C08_Tunnel_de_base_du_Mont-Cenis_-_Saint-Julien-Montdenis.jpg ; auteur Otourly ; **CC BY-SA 4.0** ; 3 840 × 2 160 ; recadrer le bas (véhicules) | `secteur-beton-centrale-a-beton-savoie.avif` | « Silos d'une centrale à béton au pied des montagnes de Savoie » |
| biomasse | `photo-1673208769691-e74104d853fd` : vue aérienne de digesteurs de méthanisation | **Garder** (installation réelle, cadrage graphique, cohérent avec méthanisation et biogaz) | Inchangé (licence Unsplash). Second visuel pour les cas (chaufferies) : Chaufferie collective, https://commons.wikimedia.org/wiki/File:Chaufferie_collective.jpg ; auteur U4you ; **CC0** | `secteur-biomasse-digesteurs-vue-aerienne.avif` ; `cas-biomasse-chaufferie-collective.avif` | « Digesteurs d'une unité de méthanisation vus du ciel » ; « Chaufferie collective biomasse et sa cheminée » |
| defense | `photo-1624027492684-327af1fb7559` : aciérie abandonnée, pont roulant rouillé | **Remplacer** (image de friche, sans lien avec la défense) | Sous-marin nucléaire d'attaque De Grasse au départ de ses essais à la mer, Cherbourg : https://commons.wikimedia.org/wiki/File:D%C3%A9but_des_essais_%C3%A0_la_mer_du_sous-marin_nucl%C3%A9aire_d%E2%80%99attaque_De_Grasse_-_2.jpg ; auteur Marine nationale ; **Licence Ouverte (Etalab)** ; 2 000 × 1 330 ; photo officielle, diffusion publique | `secteur-defense-sous-marin-cherbourg.avif` | « Sous-marin De Grasse quittant le port de Cherbourg pour ses essais à la mer » |
| distillerie | `photo-1620200423727-8127f75d7f53` : plantation de thé au coucher du soleil | **Remplacer** (contresens complet) | Alambics en cuivre de la distillerie Émile Pernot, Pontarlier (Doubs) : https://commons.wikimedia.org/wiki/File:Distillerie_fils_Emile_Pernot_012.JPG ; auteur Arnaud 25 ; **CC BY-SA 3.0** ; 1 600 × 1 200 (suffisant pour les cartes, pas pour un plein écran) | `secteur-distillerie-alambics-cuivre.avif` | « Alambics traditionnels en cuivre dans une distillerie du Doubs » |
| enrobes | `photo-1717386255773-1e3037c81788` : ligne d'assemblage d'électroménager | **Remplacer** (usine sans rapport avec les enrobés) | Centrale d'enrobés de Brumath (Bas-Rhin), halle de stockage des granulats et tour de malaxage : https://commons.wikimedia.org/wiki/File:Brumath_brumath_enrob%C3%A9s3.jpg ; auteur Didivo67 ; **CC BY-SA 4.0** ; 4 120 × 1 442 (panoramique : recadrer en 16:10 sur la tour) | `secteur-enrobes-centrale-brumath.avif` | « Centrale d'enrobés moderne avec sa halle de granulats couverte, en Alsace » |
| foret-bois | `photo-1616761286619-2acae0580383` : futaie de résineux | **Garder** (forêt gérée crédible, sobre) | Inchangé (licence Unsplash). Second visuel pour les cas (scieries) : parc à grumes arrosé de la scierie d'Urmatt, https://commons.wikimedia.org/wiki/File:Urmatt-For%C3%AAt.jpg ; auteur Ji-Elle ; **domaine public** | `secteur-foret-bois-futaie-resineux.avif` ; `cas-foret-bois-parc-a-grumes-urmatt.avif` | « Futaie de résineux en forêt de production » ; « Parc à grumes arrosé d'une scierie dans une vallée boisée des Vosges » |
| industrie | `photo-1511454493857-0a29f2c023c7` : raffinerie au crépuscule, cadrage vertical | **Remplacer** (pétrochimie étrangère, recadrage 16:10 difficile) | Zone industrielle Ratier-Figeac (Lot) vue du ciel, lumière dorée : https://commons.wikimedia.org/wiki/File:Figeac_Vue_A%C3%A9rienne_ZI_Ratier-Figeac.jpg ; auteur Dr Brains ; **domaine public** ; 2 245 × 1 069. Second visuel pour les cas : zone industrielle de Mitry-Compans (voir `maquettes/assets/propositions-hero/README.md`, CC BY-SA 4.0) | `secteur-industrie-zone-industrielle-figeac.avif` ; `cas-industrie-zone-mitry-compans.avif` | « Zone industrielle de Figeac vue du ciel, dans la vallée du Lot » ; « Zone industrielle et logistique de Mitry-Compans vue d'avion » |
| port-maritime | `photo-1606185540834-d6e7483ee1a4` : porte-conteneurs et remorqueurs, vue aérienne | **Garder** (industriel, lisible, dynamique) ; port non identifié comme français | Inchangé (licence Unsplash) | `secteur-port-maritime-porte-conteneurs.avif` | « Porte-conteneurs manoeuvré par des remorqueurs devant un terminal portuaire » |
| sante | `photo-1576091160550-2173dba999ef` : stéthoscope posé sur un ordinateur portable | **Remplacer** (cliché de banque d'images, aucun lien avec l'industrie de santé) | Salle blanche de production d'Exxelia, Chanteloup-en-Brie (Seine-et-Marne) : https://commons.wikimedia.org/wiki/File:Exxelia_-_Salle_blanche_Chanteloup_en_Brie.jpg ; auteur Exxelia Groupe ; **CC BY 3.0** ; 1 772 × 1 109. Alternative sans attribution : salle blanche avec robot, https://commons.wikimedia.org/wiki/File:Reinraum_BBS_Automation_Blaichach.jpg ; auteur Clemenspool ; **CC0** (Allemagne) | `secteur-sante-salle-blanche.avif` | « Opérateur en tenue de salle blanche devant des équipements de production » |
| numerique | `photo-1518770660439-4636190af475` : macro de circuit imprimé | **Remplacer** (cliché générique) | Salle serveurs du datacenter de l'École polytechnique (Palaiseau) : https://commons.wikimedia.org/wiki/File:Datacenter_informatique_de_l%27Ecole_Polytechnique_(33231398121).jpg ; auteur École polytechnique (photo J. Barande) ; **CC BY-SA 2.0** ; 5 662 × 3 775 | `secteur-numerique-salle-serveurs.avif` | « Allée de baies de serveurs dans un datacenter » |

Bilan : 4 gardées (agriculture, biomasse, forêt-bois, port-maritime), 8 remplacées, dont 8 visuels identifiés comme français sur 12 après remplacement.

## 3. Vignettes des cas clients

Les cas étant anonymisés, ils prennent le visuel de leur secteur. Nouveau pool proposé pour `config/cas-clients-visuels.ts` (A4 applique, chemins locaux) :

| Secteur | Pool (rotation) |
|---|---|
| biomasse | `secteur-biomasse-digesteurs-vue-aerienne`, `cas-biomasse-chaufferie-collective` |
| foret-bois | `secteur-foret-bois-futaie-resineux`, `cas-foret-bois-parc-a-grumes-urmatt` |
| industrie | `secteur-industrie-zone-industrielle-figeac`, `cas-industrie-zone-mitry-compans` |
| tous les autres | le seul visuel du secteur |

Retirer définitivement : `photo-1569529465841-dfecdab7503b` (whisky), `photo-1518709268805-4e9042af9f23` (château), `photo-1605281317010-fe5ffe798166` (yacht), `photo-1496247749665-49cf5b1022e9` (aciérie). Les 93 fichiers `content/cas-clients/*.mdx` portent encore un champ `image` avec une URL Unsplash : A7 ou A4 doit le supprimer (le visuel vient du pool) pour atteindre « 0 URL Unsplash dans `content/` » (DoD A8).

Autres URL Unsplash repérées hors des 12 secteurs (pour A4) : hero Paris `photo-1526821799652-2dc51675628e` (conservé, à héberger localement), bandeau « Partout en France » Lyon `photo-1602719092282-f027126b6b74` (remplacé par `RegionMap`, §5.1), troisième image de l'accueil `photo-1566838217578-1903568a76d9`, visuel du billet `content/blog/lf-2026-cir-cii.mdx` et vignettes de `config/fiches-decryptage.ts`.

## 4. Téléchargement et crédits (A4, A1)

- Wikimedia Commons : récupérer une version de 1 600 px de large par l'API (`action=query&prop=imageinfo&iiprop=url&iiurlwidth=1600&titles=File:...`) via PowerShell, avec un en-tête `User-Agent` descriptif et une pause de quelques secondes entre deux requêtes (l'API renvoie des erreurs 429 en rafale).
- Les recadrages et conversions AVIF d'images CC BY-SA sont des adaptations : elles restent sous la même licence (aucune contrainte pratique pour le site, il suffit de créditer).
- Bloc « Crédits photographiques » à ajouter dans `content/pages/mentions-legales.mdx` (hors périmètre A8, texte proposé) :

> Crédits photographiques : laiterie de Surgères, Serge Lacotte (CC BY-SA 3.0) ; centrale à béton du Mont-Cenis, Otourly (CC BY-SA 4.0) ; sous-marin De Grasse, Marine nationale (Licence Ouverte) ; distillerie Émile Pernot, Arnaud 25 (CC BY-SA 3.0) ; centrale d'enrobés de Brumath, Didivo67 (CC BY-SA 4.0) ; zone industrielle de Mitry-Compans, Pymouss (CC BY-SA 4.0) ; salle blanche Exxelia, Exxelia Groupe (CC BY 3.0) ; datacenter de l'École polytechnique, École polytechnique, J. Barande (CC BY-SA 2.0) ; images Wikimedia Commons, liens vers les pages sources. Autres photographies : Unsplash (licence Unsplash), domaine public ou CC0.

Chaque nom d'auteur doit être un lien vers la page Commons du fichier et chaque licence un lien vers le texte de la licence.

# Iconographie des financeurs : logos ou typographie (A8, run V2)

**Date de vérification** : 27/09/2026 (pages officielles consultées ce jour).
**Contexte** : section « Financeurs » de l'accueil (plan V2 §5.1). Le marquee texte actuel doit devenir une rangée de logos officiels **si les licences le permettent** ; sinon, typographie. Usage visé : désigner l'institution auprès de laquelle Accelium accompagne ses clients, sans revendiquer de partenariat.

## Conclusion

**Aucun logo n'est téléchargé.** Seul l'emblème européen est ouvert à tous par un texte officiel ; pour tous les autres financeurs, les textes publiés imposent un accord exprès, réservent le logo aux bénéficiaires ou partenaires, ou ne disent rien (donc pas de licence claire). En outre, ADEME, ASP et les six agences de l'eau utilisent un bloc-marque contenant la Marianne, réservée aux services de l'État.

**Décision A8 : section « Financeurs » en typographie**, avec le drapeau européen en option (seul logo autorisé), et une mention « Organismes auprès desquels nous accompagnons nos clients. Aucun partenariat ni agrément. » sous la rangée.

## Tableau par financeur

| Financeur | Conclusion | Règle et source (consultée le 27/09/2026) | Fichier officiel | Rendu retenu |
|---|---|---|---|---|
| ADEME | Logo sur autorisation préalable | CGU : toute utilisation des marques et logos est interdite sauf accord exprès de l'ADEME ; interdiction de laisser croire à un soutien ou agrément. https://www.ademe.fr/conditions-generales-dutilisation/ ; demande via https://www.ademe.fr/contact/ | Aucun en libre accès | Typographie « ADEME » |
| Bpifrance | Logo sur autorisation préalable (interdit par défaut) | CGU art. 6.1 et 6.2 : pas d'usage des dénominations, marques et logos sans autorisation préalable. https://www.bpifrance.fr/conditions-generales-dutilisation-du-site-bpifrancefr (les mentions légales y renvoient : https://www.bpifrance.fr/mentions-legales) | Aucun | Typographie « Bpifrance » |
| Régions de France | Logo sur autorisation préalable | Mentions légales : reproduction électronique interdite sauf autorisation expresse du directeur de la publication. https://regions-france.org/mentions-legales/ . Remarque : Régions de France est l'association des Régions, pas un financeur. | Aucun | Typographie « Conseils régionaux » (plutôt que « Régions de France ») |
| FranceAgriMer | Logo sur autorisation préalable | Mentions légales et CGU du portail : reproduction des signes distinctifs (marque, dénomination, logo) prohibée sans autorisation expresse ; la licence ouverte ne couvre que les informations publiques. https://www.franceagrimer.fr/mentions-legales | Aucun | Typographie « FranceAgriMer » |
| Agences de l'eau (6) | Logo réservé aux partenaires et bénéficiaires | Adour-Garonne : kit destiné aux structures partenaires ou aidées, avec Marianne obligatoire (https://eau-grandsudouest.fr/telecharger-notre-logo). Artois-Picardie : usage autorisé par le service communication, sur demande, pour des actions financées (https://www.eau-artois-picardie.fr/utilisation-du-logo-de-lagence-de-leau-artois-picardie). Loire-Bretagne, Rhin-Meuse, Seine-Normandie : version réservée aux partenaires, pas d'usage commercial ni de caution suggérée (https://agence.eau-loire-bretagne.fr/home/services-et-outils/demande-de-logo.html, https://www.eau-rhin-meuse.fr/demande-de-logo, https://www.eau-seine-normandie.fr/logo). Rhône Méditerranée Corse : site eaurmc.fr inaccessible le 27/09/2026 ; même logique probable, non vérifiée. | Réservé | Typographie « Agences de l'eau » |
| ASP | Non clair, traité comme réservé | Les mentions légales (https://www.asp.gouv.fr/mentions-legales) ne disent rien sur la propriété intellectuelle ; l'identité de l'ASP est un bloc-marque « République française », dont la Marianne ne peut être utilisée que dans les blocs-marque de l'État (https://www.info.gouv.fr/marque-de-letat/les-symboles-de-la-republique-francaise). | Aucun | Typographie « ASP » (ou « Agence de services et de paiement ») |
| Union européenne (emblème) | Logo autorisé pour désigner l'institution, sous conditions | Accord administratif Commission et Conseil de l'Europe (JO C 271 du 08/09/2012) : toute personne physique ou morale peut utiliser l'emblème, y compris commercialement, à condition de ne pas suggérer de lien, de soutien ou de parrainage de l'UE. https://eur-lex.europa.eu/legal-content/FR/TXT/HTML/?uri=CELEX:42012Y0908(01) . Ne pas confondre avec le logo de la Commission européenne (permission préalable). | Page officielle : https://european-union.europa.eu/principles-countries-history/symbols/european-flag_fr ; SVG couleur, SVG blanc et bleu, SVG noir et blanc proposés au téléchargement sur cette page ; guide graphique : https://style-guide.europa.eu/fr/content/-/isg/topic?identifier=annex-a1-graphics-guide-european-emblem | Drapeau possible (voir ci-dessous) ou typographie « Union européenne » |
| France 2030 | Non clair, traité comme réservé | La page SGPI propose un zip de logos sans condition écrite (https://www.info.gouv.fr/organisation/secretariat-general-pour-l-investissement-sgpi/logos-france-2030), mais la charte « label France 2030 » (relayée pour les lauréats) n'a pas pu être lue ; afficher ce logo pourrait laisser croire qu'Accelium est lauréat. | Zip non téléchargé | Typographie « France 2030 » |

## Spécification du rendu typographique (section « Financeurs »)

- Conteneur : `wrap`, fond `surface` (#FFFFFF) ou `cream` (#F5F4EF) selon l'alternance de la page ; filets `border-y border-line`.
- Kicker au-dessus : `kicker text-orange700` « Les financeurs que nous mobilisons » (4,97:1 sur blanc, 4,51:1 sur crème).
- Noms : `display font-600`, `text-[clamp(1.25rem,1rem_+_0.9vw,1.75rem)]`, couleur **`text-ink/70`** et non `ink/60` : `ink/60` donne 4,24:1 sur blanc et 4,10:1 sur crème (échec pour du texte courant) ; `ink/70` donne 5,84:1 sur blanc et 5,58:1 sur crème. À partir de 24 px (ou 18,7 px en gras), `ink/60` passerait le seuil « grand texte » de 3:1, mais on garde `ink/70` pour ne pas dépendre de la taille responsive.
- Séparateur entre noms : point médian `·` en `text-orange` décoratif (`aria-hidden="true"`).
- Survol : si le nom est un lien vers `/le-financement-public/financeurs/<slug>`, passage à `text-ink` et soulignement `decoration-orange underline-offset-4` ; focus : `.focusable`.
- Mouvement : le défilement (marquee) reste possible ; il s'arrête au survol et au focus (`animation-play-state: paused`) et disparaît sous `prefers-reduced-motion` (règle déjà présente dans `globals.css`). Sur mobile (< 640 px) : pas de marquee, grille `grid-cols-2 gap-x-6 gap-y-4`, noms à 1,1 rem.
- Accessibilité : liste sémantique `<ul aria-label="Financeurs mobilisés">` ; en marquee, dupliquer la liste pour la boucle avec `aria-hidden="true"` sur la copie.
- Mention obligatoire sous la liste, `text-[0.8rem] text-slate` (5,35:1 sur blanc, 4,86:1 sur crème) : « Organismes auprès desquels nous accompagnons nos clients. Aucun partenariat ni agrément. »
- Police : celle du site (Clash Display / General Sans). **Jamais la police Marianne**, réservée à l'État (https://www.info.gouv.fr/marque-de-letat/la-typographie).

## Option : drapeau européen

Si Clément souhaite un seul signe graphique, le drapeau UE peut figurer devant « Union européenne » :
- Fichier : SVG officiel couleur de la page européenne ci-dessus, à enregistrer dans `public/logos/financeurs/drapeau-ue.svg` (A4, après validation).
- Taille : 28 × 19 px (ratio officiel 3:2), aligné sur la ligne de base du texte, marge droite 10 px, `alt=""` (le nom est écrit à côté).
- Libellé obligatoire à côté : « Union européenne » ou « Fonds européens (FEDER, FEADER) ». Interdits : « soutenu par », « partenaire », « agréé ».
- Le drapeau ne doit pas être déformé ni recoloré hors des versions officielles.

## Pour aller plus loin (hors run)

Si Clément veut les logos ADEME, Bpifrance ou FranceAgriMer, une demande écrite est nécessaire (formulaires de contact cités ci-dessus). Tant qu'un accord écrit n'est pas archivé, la typographie reste la règle.

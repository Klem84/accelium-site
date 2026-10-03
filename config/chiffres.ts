/* Source unique et datée des chiffres clés du cabinet (accueil, page « À propos »,
   déontologie). Décision de Clément Barbier du 27/09/2026 : voir
   RACINE/PLAN-ACTION-V2-equipe-agents.md §1 et §2.4.

   Un champ à `null` signifie « non vérifié, ne pas afficher » : la valeur ne doit
   jamais être estimée ni inventée. Les composants qui consomment ce fichier
   masquent la ligne correspondante quand le champ est `null`.

   Sans tiret long, conformément aux règles d'écriture du run. */

export type ChiffreCompte = {
  /** Valeur réelle constatée (comptage interne, non arrondie). */
  valeur: number;
  /** Nombre utilisé pour le compteur animé (arrondi vers le bas, conservateur). */
  compteur: number;
  /** Suffixe affiché juste après le compteur (ex. « + »). */
  suffixe: string;
  /** Chaîne d'affichage prête à l'emploi (compteur + suffixe). */
  affichage: string;
  /** Libellé accompagnant le chiffre. */
  libelle: string;
};

export const chiffres = {
  /** Date de référence des chiffres ci-dessous, à afficher sous les compteurs. */
  dateChiffres: "30/09/2026",
  dateChiffresLabel: "Chiffres au 30/09/2026",

  /** Comptage réel : 139 projets montés pour 52 clients (_extraction/chiffres-projets.md).
      Affichage conservateur décidé par Clément le 27/09/2026 : « Plus de 130 ». */
  projets: {
    valeur: 130,
    compteur: 130,
    suffixe: "+",
    affichage: "130+",
    libelle: "projets de financement accompagnés depuis 2022",
  } satisfies ChiffreCompte,

  /** Comptage réel : 52 clients. Affichage conservateur : « 50+ ». */
  clients: {
    valeur: 52,
    compteur: 50,
    suffixe: "+",
    affichage: "50+",
    libelle: "clients accompagnés",
  } satisfies ChiffreCompte,

  /** Enquête de satisfaction mai-juin 2025, 18 clients. Non animées (ratios, pas des
      comptages) : à afficher en texte statique, jamais dans un compteur data-count. */
  satisfaction: {
    recommandation: 9.1,
    recommandationSur: 10,
    satisfaction: 4.67,
    satisfactionSur: 5,
    methode: "Enquête auprès de 18 clients, mai-juin 2025",
  },

  /** Montant d'aides obtenues : somme des aides conventionnées trouvées dans les dossiers
      clients (actifs et archivés), recensement du 03/10/2026 (_run-v2/conventions-dossiers-*.md).
      Décision de Clément : toute aide trouvée est comptée, convention signée ou non.
      31 aides, 21 clients : 7 926 831,75 € (dossiers actifs) + 1 571 600,80 € (archives).
      Hors total : crédits d'impôt et aides antérieures à 2022 ou montées hors Accelium. */
  montantAidesObtenues: 9498432 as number | null,
  montantAides: {
    valeur: 9.4,
    affichage: "9,4 M€",
    libelle: "d'aides obtenues pour nos clients depuis 2022",
    nombreAides: 31,
    dateLabel: "au 03/10/2026",
  },

  /** Référencement CIR/CII du Médiateur des entreprises : statut à vérifier (§2.4).
      La ligne correspondante (lib/cabinetData.ts : mediateurTitre) reste masquée
      tant que ce champ est `null`. Une chaîne non vide l'affiche comme description. */
  referencementMediateur: null as string | null,

  /** Régions où Accelium a au moins un client (déduites le 27/09/2026 des cas clients,
      des félicitations Monday et des dossiers clients ; à confirmer par Clément, §2.4). */
  regionsClientes: [
    "nouvelle-aquitaine",
    "auvergne-rhone-alpes",
    "grand-est",
    "hauts-de-france",
    "occitanie",
    "provence-alpes-cote-d-azur",
    "bretagne",
    "centre-val-de-loire",
    "normandie",
    "pays-de-la-loire",
    "ile-de-france",
    "bourgogne-franche-comte",
  ] as string[] | null,
} as const;

/* Export nommé pour compatibilité avec les consommateurs qui lisent directement
   `referencementMediateur` (ex. app/cabinet/[slug]/page.tsx). */
export const referencementMediateur = chiffres.referencementMediateur;

export type Chiffres = typeof chiffres;

/* Données structurées des financeurs : pilotent la « fiche financeur » par blocs.
   Texte fidèle aux fiches, sans tiret long. */

export type FinanceurData = {
  echelon: string; // Europe | État | Région
  echelonNote: string; // ex : "Opérateur de l'État"
  echelonIcon: "europe" | "etat" | "region";
  pourQui: string;
  interventions: string[];
  description: string[];
  dispositifs: string[];
};

export const financeursData: Record<string, FinanceurData> = {
  ademe: {
    echelon: "État",
    echelonNote: "Opérateur national",
    echelonIcon: "etat",
    pourQui:
      "Entreprises engagées dans la transition : industrie, chaleur renouvelable, efficacité énergétique, recyclage, mobilité bas carbone.",
    interventions: ["Subventions", "Appels à projets", "France 2030"],
    description: [
      "L'Agence de la transition écologique est l'un des principaux opérateurs de l'aide publique sur l'énergie, la décarbonation et l'économie circulaire. Elle opère pour l'État une part majeure de France 2030.",
      "Elle finance la décarbonation industrielle, la chaleur renouvelable, l'efficacité énergétique, le recyclage et la mobilité bas carbone, le plus souvent par appels à projets (plateforme ADEME AGIR).",
    ],
    dispositifs: [
      "Décarbonation de l'industrie (DECARB IND, AO Grands Projets)",
      "Fonds Chaleur & BCIAT",
      "Décarbonation maritime",
      "Économie circulaire",
    ],
  },

  bpifrance: {
    echelon: "État",
    echelonNote: "Banque publique d'investissement",
    echelonIcon: "etat",
    pourQui: "Start-up, PME et ETI en phase d'innovation, de développement ou de transition.",
    interventions: ["Aides à l'innovation", "Prêts", "Garanties", "Fonds propres", "France 2030"],
    description: [
      "La banque publique d'investissement soutient les entreprises à chaque étape, par des aides à l'innovation, des prêts (dont des prêts verts), des garanties bancaires et des interventions en fonds propres. Elle opère de nombreux dispositifs de France 2030.",
    ],
    dispositifs: [
      "Prêts verts, sans garantie et à l'innovation",
      "Garanties bancaires",
      "Aides à l'innovation",
      "France 2030",
    ],
  },

  franceagrimer: {
    echelon: "État",
    echelonNote: "Établissement public",
    echelonIcon: "etat",
    pourQui: "Exploitants, coopératives, industries agroalimentaires, distilleries.",
    interventions: ["Aides de filière", "France 2030", "Appels à projets"],
    description: [
      "Établissement public au service des filières agricoles, agroalimentaires et de la pêche, FranceAgriMer opère des dispositifs France 2030 (agroéquipements innovants) et des aides de filière, dont la filière vitivinicole.",
    ],
    dispositifs: ["France 2030 agroéquipements", "Aides de filière vitivinicole", "Soutiens aux filières agricoles"],
  },

  regions: {
    echelon: "Région",
    echelonNote: "Chef de file du développement économique",
    echelonIcon: "region",
    pourQui:
      "TPE, PME et ETI portant un projet d'investissement, d'innovation ou d'implantation sur le territoire régional.",
    interventions: ["Investissement", "Innovation", "Immobilier d'entreprise", "Gestion FEDER / FEADER"],
    description: [
      "Depuis la loi NOTRe (2015), la Région est le chef de file du développement économique : c'est l'acteur de référence pour les aides individuelles aux entreprises. Aides à l'investissement, à l'innovation, à l'immobilier d'entreprise, gestion d'une partie des fonds européens (FEDER, FEADER) : les dispositifs varient selon les territoires.",
      "Chaque Région définit son SRDEII (Schéma Régional de Développement Économique, d'Innovation et d'Internationalisation), qui fixe le cap pour cinq ans. C'est lui qui explique pourquoi une même aide peut exister dans une Région et pas dans la voisine, et pourquoi il faut une lecture fine et à jour de chaque territoire.",
      "Les demandes sont instruites par les services régionaux, puis votées en commission permanente du Conseil régional. Communes et intercommunalités peuvent intervenir en complément, mais uniquement par convention avec la Région, notamment pour l'immobilier d'entreprise.",
    ],
    dispositifs: [
      "Aides à l'investissement",
      "Aides à l'innovation",
      "Immobilier d'entreprise",
      "Gestion FEDER / FEADER",
    ],
  },

  ue: {
    echelon: "Europe",
    echelonNote: "Union européenne",
    echelonIcon: "europe",
    pourQui:
      "Entreprises et consortiums portant des projets de R&D, d'innovation ou structurants, souvent à plusieurs partenaires.",
    interventions: ["Fonds structurels", "Programmes thématiques", "Fonds sectoriels"],
    description: [
      "L'Europe finance les entreprises via les fonds structurels (FEDER, FEADER, FEAMPA), des programmes thématiques (Horizon Europe pour la R&D) et des fonds sectoriels, dont le Fonds européen de la défense. Des financements puissants mais exigeants, souvent en consortium.",
    ],
    dispositifs: ["FEDER", "FEADER", "FEAMPA", "Horizon Europe", "Fonds européen de la défense"],
  },

  aid: {
    echelon: "État",
    echelonNote: "Ministère des Armées",
    echelonIcon: "etat",
    pourQui: "PME et ETI portant une innovation duale civile/militaire, et start-up de défense.",
    interventions: ["Innovation duale", "Subventions", "Fonds propres", "France 2030"],
    description: [
      "Rattachée au ministère des Armées, l'AID soutient l'innovation de défense, notamment via le dispositif RAPID (innovation duale civile/militaire, pour les PME et ETI). La DGA accompagne par ailleurs les start-up et PME (dispositif PEPS), et des fonds dédiés (Fonds Innovation Défense, Definvest) interviennent en financement.",
    ],
    dispositifs: ["RAPID", "PEPS (DGA)", "Fonds Innovation Défense", "Definvest", "France 2030"],
  },
};

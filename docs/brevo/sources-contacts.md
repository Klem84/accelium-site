# Sources des contacts de `contacts-brevo.csv`

Relevé le 03/10/2026 par l'agent B1 (run V2). Règle appliquée : uniquement des adresses génériques publiées sur le site officiel de l'organisation ; aucune adresse nominative, aucune adresse devinée. Les pages ont été lues avec PowerShell `Invoke-WebRequest`, WebFetch ou WebSearch.

## Contacts avec adresse email générique (import Brevo)

| Organisation | Adresse | Source (page officielle où l'adresse est publiée) | Remarque |
|---|---|---|---|
| Telos Santé | contact@telos-sante.fr | https://telos-sante.fr/ (lien `mailto:` du pied de page) et https://telos-sante.fr/partenaires/accelium-conseil/ | La fiche partenaire Accelium existe mais ne renvoie aujourd'hui que vers la page LinkedIn d'Accelium et vers une recherche Google : aucun lien vers le site. C'est précisément la demande à faire. |
| Dev'up Centre-Val de Loire | contact@devup-centrevaldeloire.fr | https://www.devup-centrevaldeloire.fr/ (pied de page) et https://www.devup-centrevaldeloire.fr/territoire/contactez-nous/ | La page liste aussi des adresses nominatives de chargés d'affaires : non retenues. |
| Fibois Centre-Val de Loire | contact@fibois-cvl.fr | https://www.fibois-cvl.fr/contacts/ (lien `mailto:`) et https://fibois-france.fr/vos-contacts-en-region/ | Adresses nominatives de l'équipe non retenues. |
| Fibois France (réseau national des interprofessions) | contact@fibois-france.fr | https://fibois-france.fr/nous-contacter/ (lien `mailto:`) | Les autres Fibois régionaux publient aussi une adresse générique sur https://fibois-france.fr/vos-contacts-en-region/ (par exemple contact@fibois-paysdelaloire.fr, contact@fibois-aura.org, contact@fibois-grandest.com, contact@fibois-normandie.fr, accueil@fiboisbretagne.fr ; Fibois Nouvelle-Aquitaine n'y publie que des adresses nominatives) : à ajouter en deuxième vague selon les régions des cas forêt-bois, après vérification de chaque adresse sur cette page. |

## Cibles sans adresse générique utilisable (envoi manuel)

| Organisation | Canal retenu | Constat |
|---|---|---|
| Médiateur des entreprises | https://www.economie.gouv.fr/mediateur-des-entreprises/les-missions/linnovation/le-referencement-cir-cii | Page refusée aux outils (HTTP 403) le 03/10/2026. Procédure et adresse de dépôt à lire par Clément dans le document officiel du dispositif (V4 du 13/10/2025). |
| La French Fab | espace entreprise sur https://www.lafrenchfab.fr/ | Adresse générique publiée sur https://www.lafrenchfab.fr/contact/ : lafrenchfab@bpifrance.fr. Elle n'est pas mise dans le CSV car la mise à jour se fait par le compte existant ; à utiliser seulement en repli si l'espace entreprise ne permet pas la modification. |
| Pépinières de Tours Métropole | https://www.tours-metropole.fr/pepinieres-dentreprises | Site en JavaScript, aucune adresse lisible par les outils. Pas d'adresse générique trouvée sur le site officiel. Passer par l'accueil de la pépinière (contact connu de Clément) ou le formulaire du site. |
| Hellopro | https://www.hellopro.fr/online/page_fournisseur.php ; contact : https://www.hellopro.fr/nous-contacter.html | Inscription fournisseur en ligne, pas d'adresse générique publiée. |
| Trustfolio | https://www.trustfolio.co/ | Site refusé aux outils (HTTP 429) ; création de profil prestataire en libre-service. |
| compass-financement | aucun | Le site https://compass-financement.com/ présente un cabinet de conseil en financement (subventions, CIR, CII, JEI) et non un annuaire de cabinets : c'est un concurrent. Adresse publiée de type webmail (gmail), non retenue. Cible à requalifier. |
| CCI Touraine | https://www.touraine.cci.fr/ | Site refusé aux outils (HTTP 403). Une adresse contact37@touraine.cci.fr circule sur des annuaires tiers (annuaire-administration.com) mais n'a pas pu être vérifiée sur le site officiel : non retenue. Clément peut la confirmer sur touraine.cci.fr avant usage. |
| Kompass | https://fr.kompass.com/ | Site refusé aux outils (HTTP 403) ; fiche en libre-service (création ou revendication). |
| Bpifrance (Club PAI et RIA) | contact de l'organisateur de l'intervention du 04/06/2024 | Aucune page publique identifiée pour cet événement ; Clément dispose de l'échange avec les organisateurs. |
| Lead Innovation Day (EDHEC Paris) | https://leadinnovation.day/ (page « Speakers ») | Aucune adresse générique publiée ; seul un formulaire Tally de préinscription 2027 existe (non adapté à une demande de lien). Passer par le contact de l'organisateur connu de Clément. |
| INTERFACES (Centrale Lyon) | https://www.centraliens-lyon.net/contact | L'association des Centraliens de Lyon publie contact@centraliens-lyon.net sur sa page contact, mais le lien entre cette association et le réseau INTERFACES n'a pas pu être confirmé : à vérifier par Clément avant envoi, d'où le traitement manuel. |
| Fédération nationale du bois | https://www.fnbois.com/contactez-nous/ | Formulaire uniquement (champ « Type d'activité »), aucune adresse publiée. |
| UNPG | https://www.unpg.fr/contact/ | Formulaire uniquement (« Contactez-nous »), aucune adresse publiée. |
| Routes de France | https://www.routesdefrance.com/contact/ | Formulaire uniquement (société, prénom, nom, email, fonction, message) ; standard 01 44 13 32 90. |

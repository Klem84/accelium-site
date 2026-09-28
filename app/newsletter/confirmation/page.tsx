import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { buildMetadata } from "@/lib/seo";
import { verifyNewsletterToken, addContactToAudience } from "@/lib/newsletter";

// Fiche L8.6 : page atteinte depuis le lien de confirmation envoyé par email (double opt-in).
// Hors index : elle n'a de sens qu'avec un jeton valide dans l'URL.
export const metadata: Metadata = buildMetadata(
  {
    title: "Confirmation de votre inscription à la newsletter",
    description: "Confirmez votre inscription à la newsletter d'Accelium Conseil.",
    noindex: true,
  },
  "/newsletter/confirmation"
);

export default async function NewsletterConfirmationPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const result = verifyNewsletterToken(searchParams.token, "confirmation");

  let etat: "succes" | "echec-ajout" | "lien-invalide" | "lien-expire" | "indisponible";
  if (!result.ok) {
    etat =
      result.reason === "expire"
        ? "lien-expire"
        : result.reason === "non-configure"
        ? "indisponible"
        : "lien-invalide";
  } else {
    const ajout = await addContactToAudience(result.email);
    etat = ajout.ok ? "succes" : "echec-ajout";
  }

  const messages: Record<typeof etat, { titre: string; texte: string }> = {
    succes: {
      titre: "Votre inscription est confirmée",
      texte:
        "Merci ! Vous recevrez désormais la newsletter d'Accelium Conseil. Un lien de désinscription est présent dans chaque email.",
    },
    "echec-ajout": {
      titre: "Une erreur est survenue",
      texte:
        "Votre lien de confirmation est valide, mais l'ajout à la liste de diffusion a échoué. Merci de réessayer plus tard ou de nous contacter.",
    },
    "lien-invalide": {
      titre: "Lien de confirmation invalide",
      texte: "Ce lien de confirmation n'est pas valide. Vérifiez que vous avez copié l'intégralité du lien reçu par email.",
    },
    "lien-expire": {
      titre: "Lien de confirmation expiré",
      texte: "Ce lien de confirmation a expiré (validité de 7 jours). Merci de vous réinscrire depuis notre page ressources.",
    },
    indisponible: {
      titre: "Inscription momentanément indisponible",
      texte: "Le service d'inscription à la newsletter est momentanément indisponible. Merci de réessayer plus tard.",
    },
  };

  const { titre, texte } = messages[etat];

  return (
    <>
      <PageHero kicker="Newsletter" title={titre} intro={texte} />
      <section className="wrap py-16 lg:py-24">
        <Link href="/ressources/newsletters" className="text-orange700 underline focusable">
          Voir les newsletters déjà publiées
        </Link>
      </section>
    </>
  );
}

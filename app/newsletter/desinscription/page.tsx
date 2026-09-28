import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/blocks/PageHero";
import { buildMetadata } from "@/lib/seo";
import { verifyNewsletterToken, unsubscribeContact } from "@/lib/newsletter";

// Fiche L8.6 : page atteinte depuis le lien de désinscription présent dans chaque newsletter.
export const metadata: Metadata = buildMetadata(
  {
    title: "Désinscription de la newsletter",
    description: "Désinscrivez-vous de la newsletter d'Accelium Conseil.",
    noindex: true,
  },
  "/newsletter/desinscription"
);

export default async function NewsletterDesinscriptionPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const result = verifyNewsletterToken(searchParams.token, "desinscription");

  let etat: "succes" | "echec" | "lien-invalide" | "lien-expire" | "indisponible";
  if (!result.ok) {
    etat =
      result.reason === "expire"
        ? "lien-expire"
        : result.reason === "non-configure"
        ? "indisponible"
        : "lien-invalide";
  } else {
    const maj = await unsubscribeContact(result.email);
    etat = maj.ok ? "succes" : "echec";
  }

  const messages: Record<typeof etat, { titre: string; texte: string }> = {
    succes: {
      titre: "Vous êtes désinscrit",
      texte: "Vous ne recevrez plus la newsletter d'Accelium Conseil. Vous pouvez vous réinscrire à tout moment.",
    },
    echec: {
      titre: "Une erreur est survenue",
      texte: "Votre lien de désinscription est valide, mais la mise à jour a échoué. Merci de nous contacter pour être retiré manuellement.",
    },
    "lien-invalide": {
      titre: "Lien de désinscription invalide",
      texte: "Ce lien de désinscription n'est pas valide. Vérifiez que vous avez copié l'intégralité du lien reçu par email.",
    },
    "lien-expire": {
      titre: "Lien de désinscription expiré",
      texte: "Ce lien a expiré. Contactez-nous pour être retiré de la liste de diffusion.",
    },
    indisponible: {
      titre: "Service momentanément indisponible",
      texte: "Le service de désinscription est momentanément indisponible. Merci de réessayer plus tard ou de nous contacter.",
    },
  };

  const { titre, texte } = messages[etat];

  return (
    <>
      <PageHero kicker="Newsletter" title={titre} intro={texte} />
      <section className="wrap py-16 lg:py-24">
        <Link href="/contact" className="text-orange700 underline focusable">
          Nous contacter
        </Link>
      </section>
    </>
  );
}

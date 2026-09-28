import { z } from "zod";

export const diagnosticSchema = z.object({
  nom: z.string().min(2, "Votre nom est requis.").max(120),
  societe: z.string().min(1, "Le nom de votre entreprise est requis.").max(160),
  email: z.string().email("Adresse email invalide."),
  telephone: z.string().max(40).optional().or(z.literal("")),
  secteur: z.string().max(80).optional().or(z.literal("")),
  projet: z.string().max(4000).optional().or(z.literal("")),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est requis." }),
  }),
  // Contexte de pré-remplissage (?offre=/?secteur=/?dispositif=/?objet=), transmis à la
  // colonne source Monday pour savoir depuis quelle page la demande provient (L2.7).
  origine: z.string().max(160).optional().or(z.literal("")),
  // honeypot : doit rester vide
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export type DiagnosticInput = z.infer<typeof diagnosticSchema>;

export const livreBlancSchema = z.object({
  nom: z.string().min(2, "Votre nom est requis.").max(120),
  societe: z.string().max(160).optional().or(z.literal("")),
  email: z.string().email("Adresse email invalide."),
  livreBlanc: z.string().min(1, "Document manquant.").max(80),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est requis." }),
  }),
  // honeypot : doit rester vide
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export type LivreBlancInput = z.infer<typeof livreBlancSchema>;

export const newsletterSchema = z.object({
  email: z.string().email("Adresse email invalide."),
  consentement: z.literal(true, {
    errorMap: () => ({ message: "Le consentement est requis." }),
  }),
  // honeypot : doit rester vide
  website: z.string().max(0).optional().or(z.literal("")),
  turnstileToken: z.string().optional().or(z.literal("")),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;

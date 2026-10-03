"use client";

/**
 * Quiz (§4.12 de docs/components-v2.md, client) : orientation en 3 à 5 questions
 * vers les dispositifs pertinents, puis vers le diagnostic. Ce n'est PAS un test
 * d'éligibilité : aucune promesse, aucun « vous êtes éligible » n'est produit ou
 * ne doit être ajouté aux données passées en props.
 *
 * Toutes les données (questions, réponses, résultats) sont fournies en props :
 * aucun appel réseau, aucun script tiers. Le composant calcule le résultat
 * entièrement côté client à partir de `questions[].pistes` accumulées par
 * réponse choisie.
 *
 * Props :
 * - questions : QuizQuestion[]. Chaque question a un `id`, un `legende` (le
 *   texte de la question) et des `reponses` (QuizReponse[]).
 * - reponses[].pistes : string[] de slugs de dispositifs associés à ce choix ;
 *   ces slugs sont accumulés sur l'ensemble du quiz puis dédupliqués.
 * - dispositifs : Record<slug, { nom, financeur, phrase, href }> : le
 *   catalogue utilisé pour afficher les cartes de résultat correspondant aux
 *   pistes accumulées. Une piste dont le slug ne figure pas dans ce catalogue
 *   est ignorée.
 * - onTermine : callback optionnel (pistes: string[]) => void, pour les
 *   événements de mesure (quiz_demarre, quiz_termine, quiz_vers_diagnostic) que
 *   la page appelante câble avec son propre outil d'analytics.
 *
 * Ne rend rien si `questions` est vide. Si aucune piste ne correspond au
 * catalogue à la fin du quiz, affiche le message d'état vide prévu par la
 * spec plutôt qu'une liste vide.
 */

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { CtaContext } from "@/components/collections/CtaContext";

export type QuizReponse = { id: string; label: string; pistes: string[] };
export type QuizQuestion = {
  id: string;
  legende: string;
  reponses: QuizReponse[];
  /** Mode connaissances uniquement. */
  bonneReponse?: string;
  explication?: string;
  lien?: string;
};
export type QuizDispositif = { nom: string; financeur: string; phrase: string; href: string };

export function Quiz({
  questions,
  dispositifs,
  onDemarrage,
  onTermine,
  mode = "orientation",
}: {
  questions: QuizQuestion[];
  dispositifs: Record<string, QuizDispositif>;
  onDemarrage?: () => void;
  onTermine?: (pistes: string[]) => void;
  /** orientation (défaut) : pistes de dispositifs. connaissances : bonne réponse, explication, score. */
  mode?: "orientation" | "connaissances";
}) {
  if (mode === "connaissances") {
    return <QuizConnaissances questions={questions} onDemarrage={onDemarrage} onTermine={onTermine} />;
  }
  return (
    <QuizOrientation
      questions={questions}
      dispositifs={dispositifs}
      onDemarrage={onDemarrage}
      onTermine={onTermine}
    />
  );
}

function QuizConnaissances({
  questions,
  onDemarrage,
  onTermine,
}: {
  questions: QuizQuestion[];
  onDemarrage?: () => void;
  onTermine?: (pistes: string[]) => void;
}) {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [choix, setChoix] = useState<Record<string, string>>({});
  const [demarre, setDemarre] = useState(false);
  const legendeRef = useRef<HTMLLegendElement>(null);
  const resultatRef = useRef<HTMLHeadingElement>(null);

  if (!questions?.length) return null;

  const termine = index >= questions.length;
  const score = questions.reduce(
    (n, q) => n + (choix[q.id] && choix[q.id] === q.bonneReponse ? 1 : 0),
    0
  );

  if (termine) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 lg:p-8">
        <h3
          ref={resultatRef}
          tabIndex={-1}
          className="display text-[1.35rem] font-600 text-ink outline-none"
        >
          Votre score : {score} sur {questions.length}
        </h3>
        <p className="mt-3 text-[0.92rem] text-body">
          Chaque réponse est détaillée dans les pages du site. Pour savoir ce qui s&apos;applique à
          votre projet, le diagnostic est gratuit.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={() => {
              setChoix({});
              setIndex(0);
              requestAnimationFrame(() => legendeRef.current?.focus());
            }}
            className="btn-ghost focusable rounded-full px-6 py-3 text-[0.9rem]"
          >
            Recommencer
          </button>
          <CtaContext label="Demander un diagnostic gratuit" param="objet" value="quiz" />
        </div>
      </div>
    );
  }

  const question = questions[index];
  const choisi = choix[question.id];
  const repondu = Boolean(choisi);
  const estDerniere = index === questions.length - 1;
  const bonne = question.reponses.find((r) => r.id === question.bonneReponse);
  const juste = repondu && choisi === question.bonneReponse;

  function choisir(reponseId: string) {
    if (repondu) return;
    if (!demarre) {
      setDemarre(true);
      onDemarrage?.();
    }
    setChoix((prev) => ({ ...prev, [question.id]: reponseId }));
  }

  function suivante() {
    if (estDerniere) {
      onTermine?.([]);
      setIndex(index + 1);
      requestAnimationFrame(() => resultatRef.current?.focus());
    } else {
      setIndex(index + 1);
      requestAnimationFrame(() => legendeRef.current?.focus());
    }
  }

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 lg:p-8">
      <div className="h-1.5 rounded-full bg-sand overflow-hidden">
        <div
          className="h-full bg-orange rounded-full transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-[0.8rem] text-slateD">
        Question {index + 1} sur {questions.length}
      </p>

      <fieldset className="mt-6">
        <legend
          ref={legendeRef}
          tabIndex={-1}
          className="display text-[1.35rem] font-600 text-ink outline-none"
        >
          {question.legende}
        </legend>

        <div className="mt-5 space-y-3">
          {question.reponses.map((r) => {
            const choisie = choisi === r.id;
            const estBonne = repondu && r.id === question.bonneReponse;
            const inputId = `${baseId}-${question.id}-${r.id}`;
            return (
              <label
                key={r.id}
                htmlFor={inputId}
                className={
                  "flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-[#c2480f] focus-within:outline-offset-2 " +
                  (repondu ? "cursor-default " : "cursor-pointer ") +
                  (choisie || estBonne
                    ? "border-orange700 bg-orange/5"
                    : repondu
                    ? "border-line"
                    : "border-slate hover:border-ink hover:bg-cream")
                }
              >
                <input
                  id={inputId}
                  type="radio"
                  name={question.id}
                  value={r.id}
                  checked={choisie}
                  onChange={() => choisir(r.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={
                    "shrink-0 text-orange700 " + (choisie || estBonne ? "opacity-100" : "opacity-0")
                  }
                >
                  ✓
                </span>
                <span className="text-[0.95rem] text-ink">{r.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      <div aria-live="polite" className="mt-5">
        {repondu && (
          <div className="rounded-xl bg-cream p-4">
            <p className="font-600 text-orange700">
              {juste ? "Bonne réponse" : `La bonne réponse était : ${bonne?.label ?? ""}`}
            </p>
            {question.explication && (
              <p className="mt-2 text-[0.92rem] text-body leading-relaxed">{question.explication}</p>
            )}
            {question.lien && (
              <Link
                href={question.lien}
                className="mt-3 inline-flex font-600 text-[0.9rem] text-orange700 underline underline-offset-2 focusable"
              >
                En savoir plus
              </Link>
            )}
          </div>
        )}
      </div>

      {repondu && (
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={suivante}
            className="btn-primary focusable rounded-full px-6 py-3 text-[0.9rem]"
          >
            {estDerniere ? "Voir mon score" : "Question suivante"}
          </button>
        </div>
      )}
    </div>
  );
}

function QuizOrientation({
  questions,
  dispositifs,
  onDemarrage,
  onTermine,
}: {
  questions: QuizQuestion[];
  dispositifs: Record<string, QuizDispositif>;
  onDemarrage?: () => void;
  onTermine?: (pistes: string[]) => void;
}) {
  const baseId = useId();
  const [index, setIndex] = useState(0);
  const [reponsesChoisies, setReponsesChoisies] = useState<Record<string, string>>({});
  const [erreur, setErreur] = useState<string | null>(null);
  const [demarre, setDemarre] = useState(false);
  const legendeRef = useRef<HTMLLegendElement>(null);

  if (!questions?.length) return null;

  const question = questions[index];
  const estDerniere = index === questions.length - 1;
  const termine = index >= questions.length;

  const pistes = useMemo(() => {
    const set = new Set<string>();
    for (const q of questions) {
      const choixId = reponsesChoisies[q.id];
      const reponse = q.reponses.find((r) => r.id === choixId);
      reponse?.pistes.forEach((p) => set.add(p));
    }
    return Array.from(set).filter((slug) => Boolean(dispositifs[slug]));
  }, [questions, reponsesChoisies, dispositifs]);

  function choisir(reponseId: string) {
    if (!demarre) {
      setDemarre(true);
      onDemarrage?.();
    }
    setErreur(null);
    setReponsesChoisies((prev) => ({ ...prev, [question.id]: reponseId }));
  }

  function continuer() {
    if (!reponsesChoisies[question.id]) {
      setErreur("Choisissez une réponse pour continuer.");
      return;
    }
    setErreur(null);
    if (estDerniere) {
      onTermine?.(pistes);
      setIndex(index + 1);
    } else {
      setIndex(index + 1);
      requestAnimationFrame(() => legendeRef.current?.focus());
    }
  }

  function retour() {
    setErreur(null);
    setIndex((i) => Math.max(0, i - 1));
  }

  if (termine) {
    return (
      <div className="rounded-2xl border border-line bg-surface p-6 lg:p-8">
        <h3 className="display text-[1.35rem] font-600 text-ink mb-4">
          Les pistes à étudier pour votre projet
        </h3>
        {pistes.length ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              {pistes.map((slug) => {
                const d = dispositifs[slug];
                return (
                  <Link
                    key={slug}
                    href={d.href}
                    className="rounded-xl border border-line p-4 hover:border-ink transition-colors focusable"
                  >
                    <p className="font-600 text-ink">{d.nom}</p>
                    <p className="text-[0.8rem] text-slate mt-0.5">{d.financeur}</p>
                    <p className="mt-2 text-[0.88rem] text-body">{d.phrase}</p>
                  </Link>
                );
              })}
            </div>
            <p className="mt-5 text-[0.85rem] text-slate">
              Ces pistes sont indicatives. L&apos;éligibilité dépend de votre projet et du
              calendrier du financeur : le diagnostic gratuit la confirme.
            </p>
            <div className="mt-5">
              <CtaContext
                label="Demander un diagnostic gratuit"
                param="objet"
                value="quiz"
                extra={{ pistes: pistes.join(",") }}
              />
            </div>
          </>
        ) : (
          <>
            <p className="text-[0.92rem] text-body">
              Votre projet ne correspond à aucune piste automatique. Décrivez le nous :
              beaucoup de financements se trouvent au cas par cas.
            </p>
            <div className="mt-5">
              <CtaContext label="Demander un diagnostic gratuit" param="objet" value="quiz" />
            </div>
          </>
        )}
      </div>
    );
  }

  const progressId = `${baseId}-progress`;

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 lg:p-8">
      <div className="h-1.5 rounded-full bg-sand overflow-hidden">
        <div
          className="h-full bg-orange rounded-full transition-all"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>
      <p id={progressId} className="mt-2 text-[0.8rem] text-slateD" aria-live="polite">
        Question {index + 1} sur {questions.length}
      </p>

      <fieldset className="mt-6">
        <legend
          ref={legendeRef}
          tabIndex={-1}
          className="display text-[1.35rem] font-600 text-ink outline-none"
        >
          {question.legende}
        </legend>

        <div className="mt-5 space-y-3">
          {question.reponses.map((r) => {
            const choisie = reponsesChoisies[question.id] === r.id;
            const inputId = `${baseId}-${question.id}-${r.id}`;
            return (
              <label
                key={r.id}
                htmlFor={inputId}
                className={
                  "flex items-center gap-3 rounded-xl border px-4 py-3.5 cursor-pointer transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-[#c2480f] focus-within:outline-offset-2 " +
                  (choisie
                    ? "border-orange700 bg-orange/5"
                    : "border-slate hover:border-ink hover:bg-cream")
                }
              >
                <input
                  id={inputId}
                  type="radio"
                  name={question.id}
                  value={r.id}
                  checked={choisie}
                  onChange={() => choisir(r.id)}
                  className="sr-only"
                />
                <span
                  aria-hidden="true"
                  className={
                    "shrink-0 text-orange700 " + (choisie ? "opacity-100" : "opacity-0")
                  }
                >
                  ✓
                </span>
                <span className="text-[0.95rem] text-ink">{r.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>

      {erreur && (
        <p role="alert" className="mt-4 text-[0.85rem] text-orange700">
          {erreur}
        </p>
      )}

      <div className="mt-6 flex justify-between gap-3">
        <button
          type="button"
          onClick={retour}
          disabled={index === 0}
          className="btn-ghost focusable rounded-full px-6 py-3 text-[0.9rem] disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Retour
        </button>
        <button
          type="button"
          onClick={continuer}
          className="btn-primary focusable rounded-full px-6 py-3 text-[0.9rem]"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";

// Redirige les anciennes URL à ancre vers les nouvelles pages dédiées.
// Le fragment (#...) n'étant pas transmis au serveur, la redirection se fait
// côté client. window.location.replace ne laisse pas d'entrée dans l'historique
// (comportement équivalent à un 301 du point de vue de l'utilisateur).
const HASH_MAP: Record<string, string> = {
  "#livres-blancs": "/ressources/livres-blancs",
  "#fiches-decryptage": "/blog#fiches",
  "#application-cir-cii": "/ressources/agrement-cir-cii",
};

export function RessourcesHashRedirect() {
  useEffect(() => {
    const target = HASH_MAP[window.location.hash];
    if (target) window.location.replace(target);
  }, []);

  return null;
}

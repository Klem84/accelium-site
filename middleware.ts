import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Fiche J.1.14 / tâche L1.5 : normalise les URL avant qu'elles n'atteignent le routeur.
// - /index.html -> /
// - toute URL contenant des majuscules -> sa version en minuscules (308)
// N'intercepte jamais /_next, /api, ni un fichier statique (chemin avec extension).
export const config = {
  matcher: ["/((?!_next|api).*)"],
};

const HAS_EXTENSION = /\.[a-zA-Z0-9]+$/;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/index.html") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url, 308);
  }

  if (HAS_EXTENSION.test(pathname)) {
    return NextResponse.next();
  }

  const lower = pathname.toLowerCase();
  if (lower !== pathname) {
    const url = request.nextUrl.clone();
    url.pathname = lower;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

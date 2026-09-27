/**
 * Point d'entrée de `npm run check` : exécute tous les scripts de vérification
 * présents dans scripts/ (check-*.ts) et échoue si l'un d'eux échoue.
 */
import { readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import path from "node:path";

const dir = path.join(process.cwd(), "scripts");
const checks = readdirSync(dir).filter((f) => /^check-.+\.ts$/.test(f)).sort();

if (checks.length === 0) {
  console.log("Aucun script de vérification pour l'instant.");
  process.exit(0);
}

let failed = 0;
for (const file of checks) {
  console.log(`\n▶ ${file}`);
  const r = spawnSync(process.execPath, ["--import", "tsx", path.join(dir, file)], { stdio: "inherit" });
  if (r.status !== 0) failed++;
}
console.log(failed ? `\n✗ ${failed} vérification(s) en échec` : "\n✓ Toutes les vérifications sont vertes");
process.exit(failed ? 1 : 0);

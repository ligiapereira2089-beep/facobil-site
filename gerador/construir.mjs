// Constrói o site na pasta _site a partir de conteudo/site.json.
// Uso: node gerador/construir.mjs   (corre sozinho no GitHub sempre que se publica)
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gerarSite } from "./gerar.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const saida = join(raiz, "_site");
const conteudo = JSON.parse(readFileSync(join(raiz, "conteudo", "site.json"), "utf8"));

rmSync(saida, { recursive: true, force: true });
mkdirSync(saida, { recursive: true });
cpSync(join(raiz, "estatico"), saida, { recursive: true });
if (existsSync(join(raiz, "docs"))) cpSync(join(raiz, "docs"), join(saida, "docs"), { recursive: true });
cpSync(join(raiz, "admin"), join(saida, "admin"), { recursive: true });
cpSync(join(raiz, "gerador", "gerar.mjs"), join(saida, "admin", "gerar.mjs"));

const ficheiros = gerarSite(conteudo);
for (const [nome, texto] of Object.entries(ficheiros)) {
  const destino = join(saida, nome);
  mkdirSync(dirname(destino), { recursive: true });
  writeFileSync(destino, texto);
}
console.log(`Site gerado: ${Object.keys(ficheiros).length} ficheiros em _site/`);
